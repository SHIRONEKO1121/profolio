
import * as React from 'react';
import { useState } from 'react';
import { Send, CheckCircle2, Mail, AlertCircle } from 'lucide-react';

// To make this work: 
// 1. Register at https://formspree.io/
// 2. Create a form and get your Form ID
// 3. Replace 'your-form-id' with your actual ID
const FORMSPREE_ID = 'xgovdgea'; 

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (FORMSPREE_ID === null) {
      alert("Please set your Formspree ID in components/ContactForm.tsx to enable real email sending!");
      // We will simulate success for demo purposes if ID isn't set, 
      // but in a real app you'd just return.
    }

    setStatus('sending');
    
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      console.error('Submission error:', err);
      // If user hasn't set the ID yet, we'll just show success for the UI demo,
      // but log an error.
      if (FORMSPREE_ID === null) {
         setStatus('success');
      } else {
         setStatus('error');
      }
    }
  };

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-blue-50 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
          <Mail size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Inbox
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Send a message to my email
          </p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Message Received!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Meow! I'll get back to you as soon as I finish my nap.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-6 text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors"
          >
            Send another?
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 ml-1">Name</label>
              <input
                required
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 ml-1">Email</label>
              <input
                required
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all dark:text-white"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 ml-1">Message</label>
            <textarea
              required
              name="message"
              rows={4}
              placeholder="What's on your mind?"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all dark:text-white resize-none"
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/40">
              <AlertCircle size={14} />
              <span>Failed to send. Please check your connection and try again.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full md:w-auto px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            {status === 'sending' ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              <>
                <Send size={18} />
                Send Message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
