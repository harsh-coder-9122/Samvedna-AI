import React from 'react';
import { PhoneCall, ShieldAlert, Heart, Building2, UserCheck, Clock, ExternalLink, HelpCircle } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/sampleEntries';

export const EmergencyDirectory: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Banner */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-2">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-red-100 rounded-xl text-red-600 shrink-0 mt-1">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-red-600 uppercase tracking-[0.2em] mb-1">
              Crisis Protocol Center
            </h3>
            <h2 className="text-xl font-bold text-slate-800">
              Project Samvedna • Emergency Crisis Helplines & Response Directory
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              24/7 National Mental Health Helplines, Tele-MANAS, and Campus Warden Response Standard Operating Procedures.
            </p>
          </div>
        </div>
      </div>

      {/* National Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EMERGENCY_CONTACTS.map((contact, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {contact.type === 'national' ? 'National Helpline 24/7' : 'Campus Emergency'}
                </span>
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-600" /> {contact.availability}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-800">{contact.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{contact.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-mono font-black text-slate-800">{contact.phone}</span>
              <a
                href={`tel:${contact.phone.split('/')[0].trim()}`}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Campus Warden & Counselor SOP Guide */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-1">
            Standard Operating Procedures
          </h3>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            <span>Campus Counselor & Hostel Warden Emergency Protocol</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-red-600 text-xs uppercase tracking-wider block">1. Immediate Safety Check (&lt; 30 Mins)</span>
            <p className="text-slate-600 leading-relaxed">
              When a Critical Alert is triggered, a hostel warden or resident counselor must perform an in-person room check discreetly. Verify student physical safety and ensure balcony/window hardware security.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-indigo-600 text-xs uppercase tracking-wider block">2. Compassionate Active Listening</span>
            <p className="text-slate-600 leading-relaxed">
              Listen without judgment. Never invalidate feelings or dismiss distress as "exam stress." Reassure the student that confidential support is available and they are not alone.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-emerald-600 text-xs uppercase tracking-wider block">3. Peer Buddy & Parents Notification</span>
            <p className="text-slate-600 leading-relaxed">
              Assign a trusted peer-buddy to stay with the student. Gently contact parents or emergency guardians with supportive framing and arrange campus medical consultation.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
