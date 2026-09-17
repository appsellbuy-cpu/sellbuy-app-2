import React, { useState } from 'react';
import { X, Send, Phone, Mail, CheckCircle2, ShieldCheck, MessageSquare, MapPin } from 'lucide-react';
import { Property } from '../types';
import { api } from '../services/api';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';

interface InquiryModalProps {
  property: Property | null;
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ property, onClose }) => {
  const { showToast } = useProperties();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || 'Alexander Wright');
  const [email, setEmail] = useState(user?.email || 'appsellbuy@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98201 45678');
  const [message, setMessage] = useState('Hi, I am interested in this property. Please contact me with more details.');
  const [inquiryType, setInquiryType] = useState<'Schedule Visit' | 'Price Negotiation' | 'Request Brochure' | 'Loan Assistance' | 'General Query'>('General Query');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!property) return null;

  const quickMessages = [
    { label: 'Schedule Visit', text: 'Hi, I would like to schedule a viewing visit this weekend. Please confirm timings.' },
    { label: 'Price Negotiation', text: 'Hi, is there any flexibility or negotiation on the quoted price/rent?' },
    { label: 'Request Brochure', text: 'Please send me the detailed project brochure, layout plan, and master plan.' },
    { label: 'Loan Assistance', text: 'I am interested in buying this property and require home loan assistance.' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill in your name, email, and query.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitInquiry({
        propertyId: property.id,
        senderName: name,
        senderEmail: email,
        senderPhone: phone,
        message,
        inquiryType
      });

      showToast(`Enquiry sent directly to ${property.ownerName || 'the property owner'}!`);
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to send inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Contact Owner / Agent</h3>
              <p className="text-xs text-slate-400">Direct response • Zero Brokerage</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Property Mini Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3 text-xs">
          <img
            src={property.image}
            alt={property.title}
            className="w-14 h-14 rounded-xl object-cover border"
          />
          <div className="truncate">
            <div className="font-bold text-slate-900 truncate">{property.title}</div>
            <div className="text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-amber-600" />
              <span>{property.locality || property.location}</span>
            </div>
            <div className="text-amber-600 font-bold mt-0.5">
              {property.priceDisplay || `₹${property.price}`}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Quick chips */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Quick Enquiry Templates:</label>
            <div className="flex flex-wrap gap-1.5">
              {quickMessages.map((qm, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMessage(qm.text);
                    setInquiryType(qm.label as any);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs transition border ${
                    inquiryType === qm.label
                      ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {qm.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Your Message</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 block mb-1">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending Message...' : 'Send Direct Message to Owner'}</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Your contact information is never shared with third-party telemarketers.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
