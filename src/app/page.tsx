'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const event = formData.get('event') as string;
    const experienceLevel = formData.get('experienceLevel') as string;

    if (!fullName || fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!event) {
      newErrors.event = 'Please select an event';
    }

    if (!experienceLevel) {
      newErrors.experienceLevel = 'Please select your experience level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Log form data
    const formValues = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      event: formData.get('event'),
      experienceLevel: formData.get('experienceLevel'),
    };
    console.log('Submitting form with data:', formValues);

    // Validate form
    if (!validateForm(formData)) {
      console.log('Form validation failed');
      return;
    }

    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to register for this event?')) {
      console.log('User cancelled registration');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Sending registration request...');
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (!response.ok) {
        if (data.errors) {
          console.log('Server validation errors:', data.errors);
          setErrors(data.errors.reduce((acc: Record<string, string>, curr: { field: string, message: string }) => {
            acc[curr.field] = curr.message;
            return acc;
          }, {}));
          throw new Error('Validation failed');
        }
        throw new Error(data.error || 'Failed to register');
      }

      // Clear form and errors
      form.reset();
      setErrors({});
      
      // Show success message
      toast.success('Successfully registered! Please check your email for confirmation.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to register. Please try again.';
      console.error('Registration error:', error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-sui-black relative overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3">
        <div className="bg-gradient-to-r from-[#0C4020] via-[#0A3518] to-[#083518] rounded-full shadow-xl shadow-black/10 backdrop-blur-sm border border-white/[0.02]">
          <div className="container mx-auto">
            <div className="flex items-center justify-between h-[3.25rem] px-4">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 pl-2">
                <div className="w-10 h-10 flex items-center justify-center bg-[#1A4D2E]/30 rounded-full">
                  <Image
                    src="/logo.png"
                    alt="SuiNG Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <span className="text-white/95 font-medium text-[17px] tracking-wide">SuiNG</span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-7">
                <button 
                  onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-[#A3C2B5] hover:text-white/95 transition-colors duration-200 text-[13px] font-medium cursor-pointer"
                >
                  Home
                </button>
                <button 
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-[#A3C2B5] hover:text-white/95 transition-colors duration-200 text-[13px] font-medium cursor-pointer"
                >
                  About
                </button>
                <button 
                  onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-[#A3C2B5] hover:text-white/95 transition-colors duration-200 text-[13px] font-medium cursor-pointer"
                >
                  Events
                </button>
                <button 
                  onClick={() => document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-[#A3C2B5] hover:text-white/95 transition-colors duration-200 text-[13px] font-medium cursor-pointer"
                >
                  Community
                </button>
              </div>

              {/* Register Button */}
              <button 
                className="bg-[#19A86E]/20 hover:bg-[#19A86E]/30 text-[#7EDBA7] hover:text-[#98FFB3] px-6 py-[6px] rounded-full text-[13px] font-medium transition-all duration-200 border border-[#19A86E]/20"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-16">
        <section id="home" className="flex flex-col lg:flex-row items-center gap-12 min-h-[calc(100vh-5rem)]">
          {/* Left Column - Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 max-w-2xl pt-8"
          >
            <h1 className="text-6xl font-bold text-white mb-6">
              Welcome to <br />
              Sui Nigeria <Image src="/nigeria.png" alt="Nigeria Flag" width={45} height={45} className="inline-block" />
            </h1>
            <p className="text-[#A3C2B5] text-xl leading-relaxed mb-8">
              Discover opportunities, connect with possibilities, and join a community driving change.
            </p>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex gap-4"
            >
              <button className="bg-[#25B96B] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1ea65d] transition-colors">
                Join Community
              </button>
              <button className="bg-[#1A1A1A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#252525] transition-colors">
                Learn More
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column - Cards */}
          <div className="w-[50%] relative h-[600px] flex items-center justify-end">
            <div className="relative w-[460px] h-[500px] flex items-center justify-end mr-8">
              {/* Left card - Eke */}
              <motion.div
                className="absolute right-[55%] top-16 w-[300px] h-[380px] z-[1]"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ 
                  transform: 'rotate(-3deg) translateX(60px)',
                  filter: 'brightness(0.98)',
                }}
              >
                <div className="profile-stack">
                  <div className="profile-card secondary">
                    <div className="profile-image">
                      <Image
                        src="/profile-card-2.png"
                        alt="Eke Profile"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="profile-content">
                      <div className="profile-name">
                        Nefarii.sui
                        <span className="profile-verified"></span>
                      </div>
                      <div className="profile-handle">@NefariiLightt
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main card - Joshua */}
              <motion.div
                className="absolute right-[15%] -top-4 w-[360px] h-[440px] z-[3]"
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{ 
                  filter: 'brightness(1.05)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                }}
              >
                <div className="profile-stack">
                  <div className="profile-card primary">
                    <div className="profile-image">
                      <Image
                        src="/profile-card.png"
                        alt="Joshua Profile"
                        width={360}
                        height={360}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="profile-content">
                      <div className="profile-name">
                        JoshuaOrhue.sui
                        <span className="profile-verified"></span>
                      </div>
                      <div className="profile-handle">@joshuaorhue_</div>
                    </div>
                    <div className="card-glow"></div>
                  </div>
                </div>
              </motion.div>

              {/* Right card - Ruru */}
              <motion.div
                className="absolute -right-4 top-12 w-[300px] h-[380px] z-[2]"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ 
                  transform: 'rotate(3deg) translateX(-20px)',
                  filter: 'brightness(0.98)',
                }}
              >
                <div className="profile-stack">
                  <div className="profile-card secondary">
                    <div className="profile-image">
                      <Image
                        src="/profile-card-3.png"
                        alt="Ruru Profile"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="profile-content">
                      <div className="profile-name">
                      Rainbows.sui 
                        <span className="profile-verified"></span>
                      </div>
                      <div className="profile-handle">@Rainbowsdotsui
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* Stats Section */}
      <div className="w-full bg-[#0A2818] mt-24 py-20 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#25B96B_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute inset-0 opacity-20 rotate-45 bg-[radial-gradient(#25B96B_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>

        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#25B96B]/10 rounded-full blur-[128px] -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#25B96B]/10 rounded-full blur-[128px] -translate-y-1/2"></div>

        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Community Members */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative group"
            >
              <div className="relative bg-gradient-to-br from-[#1A4D2E]/50 to-[#153D26]/50 backdrop-blur-xl rounded-2xl p-10 overflow-hidden border border-[#25B96B]/10">
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#25B96B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Number */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-baseline gap-1 mb-6"
                >
                  <span className="text-6xl font-bold bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">2k</span>
                  <span className="text-4xl text-[#25B96B] font-bold ml-1 group-hover:scale-110 transition-transform origin-left">+</span>
                </motion.div>

                {/* Label */}
                <div className="relative">
                  <div className="h-px w-12 bg-[#25B96B]/30 mb-4"></div>
                  <p className="text-[#A3C2B5] text-lg font-medium">Community Members</p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#25B96B]/5 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              </div>
            </motion.div>

            {/* Events Hosted */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative group"
            >
              <div className="relative bg-gradient-to-br from-[#1A4D2E]/50 to-[#153D26]/50 backdrop-blur-xl rounded-2xl p-10 overflow-hidden border border-[#25B96B]/10">
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#25B96B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Number */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-baseline gap-1 mb-6"
                >
                  <span className="text-6xl font-bold bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">20</span>
                  <span className="text-4xl text-[#25B96B] font-bold ml-1 group-hover:scale-110 transition-transform origin-left">+</span>
                </motion.div>

                {/* Label */}
                <div className="relative">
                  <div className="h-px w-12 bg-[#25B96B]/30 mb-4"></div>
                  <p className="text-[#A3C2B5] text-lg font-medium">Events Hosted</p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#25B96B]/5 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              </div>
            </motion.div>

            {/* Projects Built */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="relative group"
            >
              <div className="relative bg-gradient-to-br from-[#1A4D2E]/50 to-[#153D26]/50 backdrop-blur-xl rounded-2xl p-10 overflow-hidden border border-[#25B96B]/10">
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#25B96B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Number */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-baseline gap-1 mb-6"
                >
                  <span className="text-6xl font-bold bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">10</span>
                  <span className="text-4xl text-[#25B96B] font-bold ml-1 group-hover:scale-110 transition-transform origin-left">+</span>
                </motion.div>

                {/* Label */}
                <div className="relative">
                  <div className="h-px w-12 bg-[#25B96B]/30 mb-4"></div>
                  <p className="text-[#A3C2B5] text-lg font-medium">Projects Built</p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#25B96B]/5 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <section id="events" className="container mx-auto px-6 py-32 relative">
        {/* Background Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-96 bg-[#25B96B]/5 rounded-full blur-[128px] -z-10"></div>
        
        <div className="max-w-3xl relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <h2 className="text-6xl font-bold text-white leading-tight">
              Highlights from <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25B96B] to-[#1ea65d]">
                Past Events
              </span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#A3C2B5] text-xl font-medium leading-relaxed"
          >
            Relive the experiences from Past Events, as though you're currently there.
          </motion.p>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {/* Abakaliki Meetup Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#25B96B]/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="bg-gradient-to-br from-[#1A4D2E] to-[#153D26] rounded-3xl overflow-hidden relative">
              <div className="relative h-72">
                <Image
                  src="/events/abakaliki.jpg"
                  alt="Abakaliki Meetup 2024"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A4D2E] to-transparent opacity-70"></div>
              </div>
              <div className="p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A4D2E] via-[#1A4D2E] to-transparent"></div>
                <div className="relative">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#25B96B] transition-colors">
                    Abakaliki Meetup 2024
                  </h3>
                  <button className="text-[#25B96B] hover:text-white transition-colors flex items-center gap-2 group/btn">
                    See more 
                    <span className="text-lg transition-all duration-300 group-hover/btn:translate-x-2 relative">
                      →
                      <span className="absolute inset-0 text-white/30 translate-x-1">→</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Benin City Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#25B96B]/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="bg-gradient-to-br from-[#1A4D2E] to-[#153D26] rounded-3xl overflow-hidden relative">
              <div className="relative h-72">
                <Image
                  src="/events/benin.jpg"
                  alt="Benin City Hackathon 2024"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A4D2E] to-transparent opacity-70"></div>
              </div>
              <div className="p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A4D2E] via-[#1A4D2E] to-transparent"></div>
                <div className="relative">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#25B96B] transition-colors">
                    Benin City Hackathon 2024
                  </h3>
                  <button className="text-[#25B96B] hover:text-white transition-colors flex items-center gap-2 group/btn">
                    See more 
                    <span className="text-lg transition-all duration-300 group-hover/btn:translate-x-2 relative">
                      →
                      <span className="absolute inset-0 text-white/30 translate-x-1">→</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enugu Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#25B96B]/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="bg-gradient-to-br from-[#1A4D2E] to-[#153D26] rounded-3xl overflow-hidden relative">
              <div className="relative h-72">
                <Image
                  src="/events/enugu.jpg"
                  alt="Enugu Outreach 2025"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A4D2E] to-transparent opacity-70"></div>
              </div>
              <div className="p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A4D2E] via-[#1A4D2E] to-transparent"></div>
                <div className="relative">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#25B96B] transition-colors">
                    Enugu Outreach 2025
                  </h3>
                  <button className="text-[#25B96B] hover:text-white transition-colors flex items-center gap-2 group/btn">
                    See more 
                    <span className="text-lg transition-all duration-300 group-hover/btn:translate-x-2 relative">
                      →
                      <span className="absolute inset-0 text-white/30 translate-x-1">→</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="community" className="container mx-auto px-6 py-32 relative">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#25B96B_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute inset-0 opacity-20 rotate-45 bg-[radial-gradient(#25B96B_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>

        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#25B96B]/10 rounded-full blur-[128px] -translate-y-1/2 -z-10"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#25B96B]/10 rounded-full blur-[128px] -translate-y-1/2 -z-10"></div>
        
        {/* Section Header */}
        <div className="mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <span className="text-[#25B96B] text-lg font-medium px-4 py-2 rounded-full bg-[#25B96B]/10 backdrop-blur-sm border border-[#25B96B]/20">
              Event Calendar
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl font-bold mt-6 mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
              Upcoming Events
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#A3C2B5] text-xl max-w-2xl"
          >
            Join Sui Nigeria events, community meetups, workshops, hackathons and more
          </motion.p>
        </div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#25B96B]/20 via-[#25B96B]/5 to-transparent blur-xl -z-10"></div>
          <div className="flex items-center gap-4 bg-[#1A2C24]/80 rounded-2xl p-3 backdrop-blur-xl border border-[#25B96B]/10">
            <div className="flex-1 flex items-center gap-3 px-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#A3C2B5]">
                <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.5 17.5L13.875 13.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search events..." 
                className="bg-transparent w-full text-white placeholder-[#A3C2B5] focus:outline-none text-lg"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="text-[#A3C2B5] hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5">
                Sort (A-Z)
              </button>
              <button className="bg-[#25B96B] hover:bg-[#1ea65d] text-white px-6 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-[#25B96B]/20 active:scale-95">
                Filter
              </button>
            </div>
          </div>
        </motion.div>

        {/* Events Table */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Background Blur Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#25B96B]/10 via-transparent to-[#25B96B]/5 blur-xl -z-10"></div>
          
          <div className="bg-[#1A2C24]/80 backdrop-blur-xl rounded-3xl border border-[#25B96B]/10 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-[#25B96B]/10 relative">
              <div className="text-[#A3C2B5] font-medium">Date</div>
              <div className="text-[#A3C2B5] font-medium">Event</div>
              <div className="text-[#A3C2B5] font-medium">Location</div>
              <div className="text-[#A3C2B5] font-medium"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#25B96B]/10">
              {/* January 25th - Plateau State */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-4 gap-4 p-6 hover:bg-[#25B96B]/10 transition-all cursor-pointer group relative"
              >
                <div className="text-white font-medium">January 25th</div>
                <div className="text-white font-medium group-hover:text-[#25B96B] transition-colors">Sui Nigeria Meetup</div>
                <div className="text-[#A3C2B5] flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Plateau State
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25B96B]/10 text-[#25B96B] text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-[#25B96B]"></span>
                    Meetup
                  </span>
                  <svg className="w-6 h-6 text-[#25B96B] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.91003 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91003 4.08" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>

              {/* January 29th - Enugu State */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-4 gap-4 p-6 hover:bg-[#25B96B]/10 transition-all cursor-pointer group relative"
              >
                <div className="text-white font-medium">January 29th</div>
                <div className="text-white font-medium group-hover:text-[#25B96B] transition-colors">Sui Nigeria Meetup</div>
                <div className="text-[#A3C2B5] flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Enugu State
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25B96B]/10 text-[#25B96B] text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-[#25B96B]"></span>
                    Meetup
                  </span>
                  <svg className="w-6 h-6 text-[#25B96B] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.91003 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91003 4.08" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>

              {/* January 30th - Ondo State */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-4 gap-4 p-6 hover:bg-[#25B96B]/10 transition-all cursor-pointer group relative"
              >
                <div className="text-white font-medium">January 30th</div>
                <div className="text-white font-medium group-hover:text-[#25B96B] transition-colors">Sui Nigeria Meetup</div>
                <div className="text-[#A3C2B5] flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Ondo State
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25B96B]/10 text-[#25B96B] text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-[#25B96B]"></span>
                    Meetup
                  </span>
                  <svg className="w-6 h-6 text-[#25B96B] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.91003 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91003 4.08" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>

              {/* February 1st - Jigawa State */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-4 gap-4 p-6 hover:bg-[#25B96B]/10 transition-all cursor-pointer group relative"
              >
                <div className="text-white font-medium">February 1st</div>
                <div className="text-white font-medium group-hover:text-[#25B96B] transition-colors">Sui Nigeria Meetup</div>
                <div className="text-[#A3C2B5] flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Jigawa State
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25B96B]/10 text-[#25B96B] text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-[#25B96B]"></span>
                    Meetup
                  </span>
                  <svg className="w-6 h-6 text-[#25B96B] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.91003 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91003 4.08" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>

              {/* February 7th - Osun State DeFi */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-4 gap-4 p-6 hover:bg-[#25B96B]/10 transition-all cursor-pointer group relative"
              >
                <div className="text-white font-medium">February 7th</div>
                <div className="text-white font-medium group-hover:text-[#25B96B] transition-colors">Sui Nigeria DeFi Meetup</div>
                <div className="text-[#A3C2B5] flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Osun State
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25B96B]/10 text-[#25B96B] text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-[#25B96B]"></span>
                    DeFi Meetup
                  </span>
                  <svg className="w-6 h-6 text-[#25B96B] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.91003 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91003 4.08" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>

              {/* February 15th - Oyo State */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="grid grid-cols-4 gap-4 p-6 hover:bg-[#25B96B]/10 transition-all cursor-pointer group relative"
              >
                <div className="text-white font-medium">February 15th</div>
                <div className="text-white font-medium group-hover:text-[#25B96B] transition-colors">Sui Nigeria Meetup</div>
                <div className="text-[#A3C2B5] flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Oyo State
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25B96B]/10 text-[#25B96B] text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-[#25B96B]"></span>
                    Meetup
                  </span>
                  <svg className="w-6 h-6 text-[#25B96B] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.91003 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91003 4.08" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>

              {/* February 15th - Katsina State */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="grid grid-cols-4 gap-4 p-6 hover:bg-[#25B96B]/10 transition-all cursor-pointer group relative"
              >
                <div className="text-white font-medium">February 15th</div>
                <div className="text-white font-medium group-hover:text-[#25B96B] transition-colors">Sui Nigeria Meetup</div>
                <div className="text-[#A3C2B5] flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Katsina State
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25B96B]/10 text-[#25B96B] text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-[#25B96B]"></span>
                    Meetup
                  </span>
                  <svg className="w-6 h-6 text-[#25B96B] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.91003 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91003 4.08" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>

              {/* February 21st - Ondo State DeFi */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="grid grid-cols-4 gap-4 p-6 hover:bg-[#25B96B]/10 transition-all cursor-pointer group relative"
              >
                <div className="text-white font-medium">February 21st</div>
                <div className="text-white font-medium group-hover:text-[#25B96B] transition-colors">Sui Nigeria DeFi Meetup</div>
                <div className="text-[#A3C2B5] flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Ondo State
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25B96B]/10 text-[#25B96B] text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-[#25B96B]"></span>
                    DeFi Meetup
                  </span>
                  <svg className="w-6 h-6 text-[#25B96B] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.91003 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91003 4.08" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>

              {/* February 22nd - Plateau State */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="grid grid-cols-4 gap-4 p-6 hover:bg-[#25B96B]/10 transition-all cursor-pointer group relative"
              >
                <div className="text-white font-medium">February 22nd</div>
                <div className="text-white font-medium group-hover:text-[#25B96B] transition-colors">Sui Nigeria Meetup</div>
                <div className="text-[#A3C2B5] flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Plateau State
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25B96B]/10 text-[#25B96B] text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-[#25B96B]"></span>
                    Meetup
                  </span>
                  <svg className="w-6 h-6 text-[#25B96B] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.91003 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91003 4.08" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>

              {/* March 8th - Lagos State DeFi */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="grid grid-cols-4 gap-4 p-6 hover:bg-[#25B96B]/10 transition-all cursor-pointer group relative"
              >
                <div className="text-white font-medium">March 8th</div>
                <div className="text-white font-medium group-hover:text-[#25B96B] transition-colors">Sui Nigeria DeFi Meetup</div>
                <div className="text-[#A3C2B5] flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Lagos State
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25B96B]/10 text-[#25B96B] text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-[#25B96B]"></span>
                    DeFi Meetup
                  </span>
                  <svg className="w-6 h-6 text-[#25B96B] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.91003 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91003 4.08" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Registration Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Registration Form */}
            <div className="bg-[#1A2C24]/80 backdrop-blur-xl rounded-3xl p-8 border border-[#25B96B]/10">
              <h2 className="text-3xl font-bold text-white mb-2">Register for Events</h2>
              <p className="text-[#A3C2B5] mb-8">Join our upcoming events and be part of the SUI ecosystem.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-[#A3C2B5] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    required
                    className={`w-full px-4 py-3 bg-[#1A2C24] border ${
                      errors.fullName ? 'border-red-500' : 'border-[#25B96B]/20'
                    } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#25B96B]/50`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#A3C2B5] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className={`w-full px-4 py-3 bg-[#1A2C24] border ${
                      errors.email ? 'border-red-500' : 'border-[#25B96B]/20'
                    } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#25B96B]/50`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Event Selection */}
                <div>
                  <label htmlFor="event" className="block text-sm font-medium text-[#A3C2B5] mb-2">
                    Select Event
                  </label>
                  <select
                    name="event"
                    id="event"
                    required
                    className={`w-full px-4 py-3 bg-[#1A2C24] border ${
                      errors.event ? 'border-red-500' : 'border-[#25B96B]/20'
                    } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#25B96B]/50`}
                  >
                    <option value="">Select an event</option>
                    <option value="plateau-jan25">Sui Nigeria Meetup - Plateau State (Jan 25)</option>
                    <option value="enugu-jan29">Sui Nigeria Meetup - Enugu State (Jan 29)</option>
                    <option value="ondo-jan30">Sui Nigeria Meetup - Ondo State (Jan 30)</option>
                    <option value="osun-feb1">Sui Nigeria DeFi Meetup - Osun State (Feb 1)</option>
                    <option value="oyo-feb15">Sui Nigeria Meetup - Oyo State (Feb 15)</option>
                    <option value="katsina-feb15">Sui Nigeria Meetup - Katsina State (Feb 15)</option>
                    <option value="ondo-feb21">Sui Nigeria DeFi Meetup - Ondo State (Feb 21)</option>
                    <option value="plateau-feb22">Sui Nigeria Meetup - Plateau State (Feb 22)</option>
                  </select>
                  {errors.event && (
                    <p className="mt-1 text-sm text-red-500">{errors.event}</p>
                  )}
                </div>

                {/* Experience Level */}
                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-[#A3C2B5] mb-2">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    id="experienceLevel"
                    required
                    className={`w-full px-4 py-3 bg-[#1A2C24] border ${
                      errors.experienceLevel ? 'border-red-500' : 'border-[#25B96B]/20'
                    } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#25B96B]/50`}
                  >
                    <option value="">Select your experience level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {errors.experienceLevel && (
                    <p className="mt-1 text-sm text-red-500">{errors.experienceLevel}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-[#25B96B] to-[#1ea65d] text-white font-medium py-3 px-6 rounded-xl hover:opacity-90 transition-opacity ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#2ECC7A] hover:to-[#25B96B]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </>
                  ) : (
                    'Register Now'
                  )}
                </button>
              </form>
            </div>

            {/* Benefits Section */}
            <div className="lg:pt-8">
              <h3 className="text-2xl font-bold text-white mb-8">Why Join Our Events?</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#25B96B] to-[#1ea65d] p-0.5 shrink-0">
                    <div className="w-full h-full rounded-xl bg-[#1A2C24] flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#25B96B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Learn from Experts</h4>
                    <p className="text-[#A3C2B5]">Get insights and knowledge from experienced developers in the SUI ecosystem.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#25B96B] to-[#1ea65d] p-0.5 shrink-0">
                    <div className="w-full h-full rounded-xl bg-[#1A2C24] flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#25B96B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Network & Connect</h4>
                    <p className="text-[#A3C2B5]">Meet like-minded developers and build valuable connections in the community.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#25B96B] to-[#1ea65d] p-0.5 shrink-0">
                    <div className="w-full h-full rounded-xl bg-[#1A2C24] flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#25B96B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Hands-on Experience</h4>
                    <p className="text-[#A3C2B5]">Get practical experience building on SUI through workshops and hackathons.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Join Our Community Section */}
      <div className="container mx-auto px-6 py-32 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#25B96B_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>

        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold"
          >
            Join our community
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Twitter Community Card */}
          <motion.a
            href="https://twitter.com/SuiNetworkNG"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group"
          >
            <div className="bg-[#1A2C24]/80 backdrop-blur-xl rounded-3xl p-8 border border-[#25B96B]/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#25B96B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#25B96B] to-[#1ea65d] p-0.5 mb-6">
                  <div className="w-full h-full rounded-2xl bg-[#1A2C24] flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#25B96B]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Twitter</h3>
                <p className="text-[#A3C2B5] mb-6">Follow us on Twitter for the latest updates, events, and community highlights.</p>
                <div className="flex items-center text-[#25B96B] font-medium">
                  Join <span className="i-carbon-arrow-right ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                </div>
              </div>
            </div>
          </motion.a>

          {/* Telegram Community Card */}
          <motion.a
            href="https://t.me/SuiNetworkNigeria"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group"
          >
            <div className="bg-[#1A2C24]/80 backdrop-blur-xl rounded-3xl p-8 border border-[#25B96B]/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#25B96B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#25B96B] to-[#1ea65d] p-0.5 mb-6">
                  <div className="w-full h-full rounded-2xl bg-[#1A2C24] flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#25B96B]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Telegram</h3>
                <p className="text-[#A3C2B5] mb-6">Join our Telegram group to connect with fellow developers and stay updated.</p>
                <div className="flex items-center text-[#25B96B] font-medium">
                  Join <span className="i-carbon-arrow-right ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                </div>
              </div>
            </div>
          </motion.a>

          {/* Discord Community Card */}
          <motion.a
            href="https://discord.gg/suinigeria"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group"
          >
            <div className="bg-[#1A2C24]/80 backdrop-blur-xl rounded-3xl p-8 border border-[#25B96B]/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#25B96B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#25B96B] to-[#1ea65d] p-0.5 mb-6">
                  <div className="w-full h-full rounded-2xl bg-[#1A2C24] flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#25B96B]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Discord</h3>
                <p className="text-[#A3C2B5] mb-6">Join our Discord server for technical discussions and community support.</p>
                <div className="flex items-center text-[#25B96B] font-medium">
                  Join <span className="i-carbon-arrow-right ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                </div>
              </div>
            </div>
          </motion.a>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-6 py-32 relative">
        {/* Background Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-96 bg-[#25B96B]/5 rounded-full blur-[128px] -z-10"></div>
        
        {/* Section Header */}
        <div className="text-center mb-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="text-[#25B96B] text-lg font-medium px-4 py-2 rounded-full bg-[#25B96B]/10 backdrop-blur-sm border border-[#25B96B]/20">
              Our Team
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl font-bold mt-6 mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25B96B] to-[#1ea65d]">
              Meet The Team
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#A3C2B5] text-xl max-w-2xl"
          >
            The brilliant minds behind Sui Nigeria's vision and growth
          </motion.p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Joshua - Founder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group"
          >
            <div className="bg-[#1A2C24]/80 backdrop-blur-xl rounded-3xl p-6 border border-[#25B96B]/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#25B96B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#25B96B] to-[#1ea65d] p-1 mb-6 mx-auto">
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src="/team/joshua.jpg"
                      alt="Joshua - Founder"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Joshua</h3>
                <p className="text-[#25B96B] text-center font-medium">Founder</p>
              </div>
            </div>
          </motion.div>

          {/* Nefarii - Co-founder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group"
          >
            <div className="bg-[#1A2C24]/80 backdrop-blur-xl rounded-3xl p-6 border border-[#25B96B]/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#25B96B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#25B96B] to-[#1ea65d] p-1 mb-6 mx-auto">
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src="/team/nefarii.jpg"
                      alt="Nefarii - Co-founder"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Nefarii</h3>
                <p className="text-[#25B96B] text-center font-medium">Co-founder</p>
              </div>
            </div>
          </motion.div>

          {/* Jenny - Head of Operations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group"
          >
            <div className="bg-[#1A2C24]/80 backdrop-blur-xl rounded-3xl p-6 border border-[#25B96B]/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#25B96B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#25B96B] to-[#1ea65d] p-1 mb-6 mx-auto">
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src="/team/jenny.jpg"
                      alt="Jenny - Head of Operations"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Jenny</h3>
                <p className="text-[#25B96B] text-center font-medium">Head of Operations</p>
              </div>
            </div>
          </motion.div>

          {/* Currency - Content Manager */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group"
          >
            <div className="bg-[#1A2C24]/80 backdrop-blur-xl rounded-3xl p-6 border border-[#25B96B]/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#25B96B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#25B96B] to-[#1ea65d] p-1 mb-6 mx-auto">
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src="/team/currency.jpg"
                      alt="Currency - Content Manager"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Currency</h3>
                <p className="text-[#25B96B] text-center font-medium">Content Manager</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      {/* ... */}
    </main>
  );
}
