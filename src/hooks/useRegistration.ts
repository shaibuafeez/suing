import { useState } from 'react';
import toast from 'react-hot-toast';

interface RegistrationData {
  fullName: string;
  email: string;
  event: string;
  experienceLevel: string;
}

export const useRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const registerForEvent = async (data: RegistrationData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      toast.success('Successfully registered for the event!');
      return result;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerForEvent,
    isLoading,
  };
};
