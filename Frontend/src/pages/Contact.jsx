import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import icon from '../assets/icon.png';
import PublicFooter from '../components/PublicFooter';
import { Mail, Phone, Clock, MapPin, CheckCircle2, Send } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200/90 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={icon} alt="FixMate" className="w-8 h-8 object-contain rounded-lg shadow-xs" />
            <span className="font-black text-slate-900 text-lg">Fix<span className="text-purple-600">Mate</span></span>
          </Link>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link to="/" className="text-slate-600 hover:text-blue-600">Home</Link>
            <Link to="/about" className="text-slate-600 hover:text-blue-600">About Us</Link>
            <Link to="/features" className="text-slate-600 hover:text-blue-600">Features</Link>
            <Link to="/login" className="bg-blue-600 text-white px-3 py-1.5 rounded-xl hover:bg-blue-700">Sign In</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Contact Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            We're Here to Help
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Get in touch with the FixMate facilities desk for questions, onboarding assistance, or system feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="font-bold text-slate-900 text-base">Hostel Desk Information</h3>
            
            <div className="space-y-4 text-xs">
              <a
                href="mailto:support@fixmate.com"
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Email Us</p>
                  <p className="font-bold text-slate-800 text-xs">support@fixmate.com</p>
                </div>
              </a>

              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 transition"
              >
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Call Warden Desk</p>
                  <p className="font-bold text-slate-800 text-xs">+91 98765 43210</p>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Working Hours</p>
                  <p className="font-bold text-slate-800 text-xs">24/7 On-Call Maintenance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Message Sent!</h4>
                <p className="text-xs text-slate-500">
                  Thank you for reaching out. The hostel maintenance team will respond promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-blue-600 hover:underline pt-2 inline-block"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Send Us a Message</h3>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Your Query / Message</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist you?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
                >
                  <span>Submit Message</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
};

export default Contact;

