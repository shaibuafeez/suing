'use client';

import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface Registration {
  id: string;
  fullName: string;
  email: string;
  event: string;
  experienceLevel: string;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const registrationsRef = collection(db, 'registrations');
      const q = query(registrationsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const registrationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Registration[];

      setRegistrations(registrationsData);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (registrationId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success('Status updated successfully');
      fetchRegistrations(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C1618] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C1618] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Registration Management</h1>
        
        <div className="bg-[#1A2C24]/80 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#25B96B]/10">
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Event</th>
                <th className="px-6 py-4 text-left">Experience</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#25B96B]/10">
              {registrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-[#25B96B]/5">
                  <td className="px-6 py-4">{registration.fullName}</td>
                  <td className="px-6 py-4">{registration.email}</td>
                  <td className="px-6 py-4">{registration.event}</td>
                  <td className="px-6 py-4">{registration.experienceLevel}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                      ${registration.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        registration.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                      {registration.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(registration.id, 'approved')}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(registration.id, 'rejected')}
                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
