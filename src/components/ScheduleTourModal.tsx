import React, { useState } from 'react';
import { X, Calendar, Clock, Video, UserCheck, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { Property } from '../types';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';

interface ScheduleTourModalProps {
  property: Property | null;
  onClose: () => void;
  onNavigateToBookings?: () => void;
}

export const ScheduleTourModal: React.FC<ScheduleTourModalProps> = ({ property, onClose, onNavigateToBookings }) => {
  const { addBooking, showToast } = useProperties();
  const { user } = useAuth();

  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('11:00 AM');
  const [tourType, setTourType] = useState<'in_person' | 'video_call'>('in_person');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);

  if (!property) return null;

  const timeSlots = [
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !date || !time) {
      showToast('Please provide all required visit details.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addBooking({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.locality ? `${property.locality}, ${property.city}` : property.location,
        propertyImage: property.image,
        preferredDate: date,
        preferredTime: time,
        tourType: tourType === 'in_person' ? 'In-Person Visit' : 'Live Video Tour',
        userName: name,
        userEmail: email,
        userPhone: phone,
        notes,
        status: 'confirmed'
      });

      setIsBookedSuccess(true);
    } catch (err: any) {
      showToast(err.message || 'Failed to schedule viewing tour.');
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
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Schedule Property Viewing</h3>
              <p className="text-xs text-slate-400">100% Free • Direct with Owner / Agent</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Property Brief Card */}
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

        {isBookedSuccess ? (
          <div className="p-8 text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold font-serif text-slate-900">Visit Scheduled Successfully!</h4>
              <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Your <span className="font-bold text-slate-900">{tourType === 'in_person' ? 'In-Person' : 'Live Video'}</span> tour for <span className="font-bold text-amber-700">{property.title}</span> has been booked for <span className="font-bold text-slate-900">{date}</span> at <span className="font-bold text-slate-900">{time}</span>. Our relationship manager will meet you at the property.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateToBookings) onNavigateToBookings();
                }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Tour Type */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Select Tour Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTourType('in_person')}
                className={`p-3 rounded-xl border text-center transition flex items-center justify-center gap-2 ${
                  tourType === 'in_person'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>In-Person Site Visit</span>
              </button>

              <button
                type="button"
                onClick={() => setTourType('video_call')}
                className={`p-3 rounded-xl border text-center transition flex items-center justify-center gap-2 ${
                  tourType === 'video_call'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Live Video Tour</span>
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Preferred Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800"
                required
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Preferred Time Slot</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-white"
              >
                {timeSlots.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Phone Number</label>
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

          <div>
            <label className="font-medium text-slate-700 block mb-1">Special Requests / Questions</label>
            <input
              type="text"
              placeholder="e.g. Please bring floor plan, will visit with family"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition"
            >
              {isSubmitting ? 'Confirming Tour...' : 'Confirm Viewing Appointment'}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Free Cancellation anytime • Direct Owner Connect
            </p>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
