import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, UserCheck, Building2, BellRing, ChevronRight } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/sampleEntries';

interface CriticalAlertBannerProps {
  distressScore: number;
  riskSeverity: string;
  studentAlias?: string;
  studentContext?: string;
  onOpenDirectory?: () => void;
}

export const CriticalAlertBanner: React.FC<CriticalAlertBannerProps> = ({
  distressScore,
  riskSeverity,
  studentAlias = 'Student',
  studentContext,
  onOpenDirectory,
}) => {
  return (
    <div className="bg-red-600 text-white rounded-2xl p-6 shadow-xl shadow-red-200/60 relative overflow-hidden mb-8 border border-red-500">
      
      {/* Background Accent Lines */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-red-500/80">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs flex items-center justify-center shrink-0">
            <AlertTriangle className="h-8 w-8 text-amber-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-3 flex-wrap gap-y-2">
              <span className="bg-white text-red-600 px-4 py-1.5 rounded-lg font-black tracking-widest text-base shadow-sm font-mono">
                **CRITICAL_ALERT**
              </span>
              <span className="bg-red-800/80 text-red-100 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-red-400/40">
                Immediate Intervention Protocol
              </span>
            </div>
            <p className="text-sm text-red-100 font-medium mt-2">
              High psychological distress detected for <strong className="text-white underline">{studentAlias}</strong> ({studentContext || 'Hostel / Campus Student'}). Distress Score is <strong className="text-amber-200 font-bold">{distressScore}/100</strong> (Threshold &lt; 40 triggers Critical Protocol).
            </p>
          </div>
        </div>

        {/* Quick Dial Button */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:14416"
            className="flex items-center space-x-2 bg-white hover:bg-slate-100 text-red-700 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all"
          >
            <PhoneCall className="h-4 w-4 animate-spin text-red-600" />
            <span>Call Tele-MANAS (14416)</span>
          </a>
          {onOpenDirectory && (
            <button
              onClick={onOpenDirectory}
              className="bg-red-800 hover:bg-red-900 text-white px-3 py-2.5 rounded-xl font-bold text-xs border border-red-400/40 transition-all"
            >
              All Helplines &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Immediate Protocol Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-xs">
        
        {/* Step 1: Parents / Guardians */}
        <div className="bg-red-700/50 p-4 rounded-xl border border-red-400/30 space-y-1.5">
          <div className="flex items-center space-x-2 text-amber-200 font-bold text-sm">
            <UserCheck className="h-4 w-4 text-amber-300" />
            <span>1. Parents / Guardian Action</span>
          </div>
          <p className="text-red-100 leading-relaxed font-normal">
            Notify parents or emergency contact immediately with empathy. Avoid accusatory tone; ask them to conduct a gentle, supportive in-person or video check-in.
          </p>
        </div>

        {/* Step 2: Warden / Counselors */}
        <div className="bg-red-700/50 p-4 rounded-xl border border-red-400/30 space-y-1.5">
          <div className="flex items-center space-x-2 text-amber-200 font-bold text-sm">
            <Building2 className="h-4 w-4 text-amber-300" />
            <span>2. Hostel Warden & Mentors</span>
          </div>
          <p className="text-red-100 leading-relaxed font-normal">
            Alert the Hostel Block Warden or Resident Counselor for discreet in-room welfare safety check within 30 minutes. Ensure room balcony/window safety.
          </p>
        </div>

        {/* Step 3: Psychiatric Response */}
        <div className="bg-red-700/50 p-4 rounded-xl border border-red-400/30 space-y-1.5">
          <div className="flex items-center space-x-2 text-amber-200 font-bold text-sm">
            <BellRing className="h-4 w-4 text-amber-300" />
            <span>3. Clinical Psychiatric Review</span>
          </div>
          <p className="text-red-100 leading-relaxed font-normal">
            Schedule priority appointment with Campus Psychiatrist / Clinical Psychologist. Initiate 24-hour peer-buddy observation protocol.
          </p>
        </div>

      </div>

      {/* Emergency Phone Quick Contacts Strip */}
      <div className="mt-5 pt-3 border-t border-red-500/80 flex flex-wrap items-center justify-between text-xs text-red-100 gap-2">
        <span className="font-bold text-amber-200 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
          <ShieldAlert className="h-3.5 w-3.5" /> Emergency Helplines (24/7):
        </span>
        <div className="flex flex-wrap gap-2">
          {EMERGENCY_CONTACTS.slice(0, 3).map((contact, idx) => (
            <a
              key={idx}
              href={`tel:${contact.phone.split('/')[0].trim()}`}
              className="bg-red-800/90 hover:bg-red-900 px-3 py-1 rounded-lg text-white font-mono text-[11px] font-bold flex items-center gap-1.5 border border-red-400/40 transition-all"
            >
              <PhoneCall className="h-3 w-3 text-amber-300" />
              <span>{contact.name.split(' ')[0]}: {contact.phone}</span>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};
