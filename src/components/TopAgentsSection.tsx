import React, { useState } from 'react';
import { INITIAL_AGENTS } from '../data/initialData';
import { Linkedin, Twitter, Facebook, Mail, Phone, ArrowRight, MessageSquare, Send, CheckCircle2, X, ShieldCheck, Clock, User, PhoneCall } from 'lucide-react';
import { Agent, AgentInquiry } from '../types';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { api } from '../services/api';
import { ScrollReveal } from './ScrollReveal';

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const { user } = useAuth();
  const { showToast } = useProperties();

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [inquiryType, setInquiryType] = useState<string>('Buying');
  const [message, setMessage] = useState<string>(
    `Hello ${agent.name.split(' ')[0]}, I am interested in discussing your exclusive property portfolio and scheduling an advisory consultation.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<AgentInquiry | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inquiryTypes = [
    { id: 'Buying', label: 'Buying' },
    { id: 'Selling', label: 'Selling' },
    { id: 'Viewing', label: 'Viewing' },
    { id: 'General', label: 'General' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !message.trim()) {
      setErrorMessage('Please provide your name, email, and inquiry details.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await api.submitAgentInquiry({
        agentId: agent.id,
        agentName: agent.name,
        agentEmail: agent.email,
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        userPhone: userPhone.trim(),
        inquiryType,
        message: message.trim(),
      });

      setSubmittedInquiry(res.inquiry);
      setIsSuccess(true);
      showToast(`Inquiry sent directly to ${agent.name}`);
    } catch (err: unknown) {
      console.error('Error submitting inquiry:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Unable to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setSubmittedInquiry(null);
    setErrorMessage(null);
    setIsContactOpen(false);
  };

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col ${
        isContactOpen
          ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30 shadow-[0_12px_35px_rgba(197,160,89,0.15)]'
          : 'border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]'
      }`}
    >
      {/* 1. CONTACT FORM ACTIVE STATE */}
      {isContactOpen ? (
        <div className="p-5 flex-1 flex flex-col justify-between bg-[#FAF8F5]/50 animate-in fade-in zoom-in-95 duration-200">
          {/* Form Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#C5A059]"
                  referrerPolicy="no-referrer"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white absolute bottom-0 right-0" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-serif font-bold text-[#0A192F]">
                  Contact {agent.name.split(' ')[0]}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-[#9A7632] font-semibold">
                  <Clock className="w-3 h-3" /> Replies in &lt;2 hrs
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsContactOpen(false)}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#0A192F] transition-colors"
              title="Close Form"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success Notification View */}
          {isSuccess ? (
            <div className="py-6 flex-1 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-serif font-bold text-[#0A192F]">
                  Inquiry Dispatched!
                </h4>
                <p className="text-xs text-gray-600 mt-1 max-w-[240px] mx-auto">
                  Your inquiry was routed directly to <strong>{agent.name}</strong>. A confirmation has been logged.
                </p>
                {submittedInquiry && (
                  <span className="inline-block mt-2 px-2.5 py-1 rounded bg-gray-100 text-[10px] font-mono text-gray-600">
                    Ref: {submittedInquiry.id}
                  </span>
                )}
              </div>

              <div className="pt-3 w-full flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2 bg-[#0A192F] text-white text-xs font-semibold rounded-xl hover:bg-[#152a4a] transition-all"
                >
                  Back to Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setMessage('');
                  }}
                  className="w-full py-1.5 text-xs text-gray-500 hover:text-[#0A192F] underline"
                >
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            /* Inquiry Input Form */
            <form onSubmit={handleSubmit} className="mt-3 space-y-2.5 text-left flex-1 flex flex-col justify-between">
              <div>
                {/* Inquiry Type Pills */}
                <div className="mb-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Inquiry Reason
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {inquiryTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setInquiryType(type.id)}
                        className={`py-1 text-[11px] font-medium rounded-lg text-center transition-colors border ${
                          inquiryType === type.id
                            ? 'bg-[#0A192F] text-white border-[#0A192F]'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-[#0A192F] placeholder:text-gray-400 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mt-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Your Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-[#0A192F] placeholder:text-gray-400 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="mt-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-[#0A192F] placeholder:text-gray-400 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="mt-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Message to {agent.name.split(' ')[0]} *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Write your inquiry or question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-[#0A192F] placeholder:text-gray-400 focus:outline-none focus:border-[#C5A059] resize-none"
                  />
                </div>

                {errorMessage && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{errorMessage}</p>
                )}
              </div>

              {/* Submit Action */}
              <div className="pt-2 border-t border-gray-200/80 mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-[#0A192F] hover:bg-[#C5A059] hover:text-[#0A192F] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Sending to {agent.name.split(' ')[0]}...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Inquiry</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mt-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#C5A059]" /> Confidential &amp; direct agent transmission
                </div>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* 2. DEFAULT AGENT PROFILE CARD VIEW */
        <>
          {/* Agent Photo with badges */}
          <div className="aspect-[4/4.2] overflow-hidden bg-gray-50 relative group/photo">
            <img
              src={agent.image}
              alt={agent.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-105"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#0A192F]/85 backdrop-blur-md text-white rounded-md shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
              </span>
            </div>

            <div className="absolute top-3 right-3">
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-white/90 backdrop-blur-md text-[#0A192F] rounded-md shadow-sm">
                ⭐ {agent.rating} ({agent.reviewCount})
              </span>
            </div>

            {/* Quick Contact overlay button when hovering photo */}
            <button
              onClick={() => setIsContactOpen(true)}
              className="absolute bottom-3 left-3 right-3 py-2 bg-[#C5A059] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl opacity-0 group-hover/photo:opacity-100 transition-all duration-200 shadow-md flex items-center justify-center gap-1.5"
              type="button"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Send Direct Inquiry
            </button>
          </div>

          {/* Agent Information */}
          <div className="p-5 flex-1 flex flex-col justify-between text-center">
            <div>
              <h3 className="text-base font-serif font-bold text-[#0A192F] hover:text-[#C5A059] transition-colors">
                {agent.name}
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {agent.role}
              </p>
              <p className="text-[11px] text-[#9A7632] font-semibold mt-1">
                {agent.propertiesCount} Managed Properties
              </p>
            </div>

            {/* Direct Contact Agent Primary CTA */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="w-full py-2.5 px-4 bg-[#0A192F] text-white hover:bg-[#C5A059] hover:text-[#0A192F] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group/btn cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#C5A059] group-hover/btn:text-[#0A192F] transition-colors" />
                <span>Contact Agent</span>
              </button>

              {/* Social and Quick Communication Links */}
              <div className="flex items-center justify-center gap-2 text-gray-400 pt-1">
                <a
                  href={`tel:${agent.phone}`}
                  title={`Call ${agent.name}: ${agent.phone}`}
                  className="w-7 h-7 rounded-full bg-gray-50 hover:bg-[#0A192F] hover:text-white flex items-center justify-center transition-colors text-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  title={`Email ${agent.name}`}
                  className="w-7 h-7 rounded-full bg-gray-50 hover:bg-[#C5A059] hover:text-white flex items-center justify-center transition-colors text-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#linkedin"
                  title="LinkedIn"
                  onClick={(e) => e.preventDefault()}
                  className="w-7 h-7 rounded-full bg-gray-50 hover:bg-[#0A192F] hover:text-white flex items-center justify-center transition-colors text-xs"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#twitter"
                  title="Twitter"
                  onClick={(e) => e.preventDefault()}
                  className="w-7 h-7 rounded-full bg-gray-50 hover:bg-[#0A192F] hover:text-white flex items-center justify-center transition-colors text-xs"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#facebook"
                  title="Facebook"
                  onClick={(e) => e.preventDefault()}
                  className="w-7 h-7 rounded-full bg-gray-50 hover:bg-[#0A192F] hover:text-white flex items-center justify-center transition-colors text-xs"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const TopAgentsSection: React.FC = () => {
  return (
    <section id="agents" className="py-14 lg:py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#9A7632] uppercase block mb-1">
              Dedicated Specialists
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A192F]">
              Meet Our Top Agents
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-lg">
              Industry leaders offering localized market intelligence, discrete advisory, and direct personal representation.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-gray-200 text-[#0A192F] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" /> Average Response: 1.8 Hours
            </span>
          </div>
        </ScrollReveal>

        {/* 4 Agent Cards Grid with embedded Contact Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {INITIAL_AGENTS.map((agent: Agent, index: number) => (
            <ScrollReveal key={agent.id} delay={index * 100} className="w-full">
              <AgentCard agent={agent} />
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
