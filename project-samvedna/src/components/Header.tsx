import React from 'react';
import { HeartPulse, ShieldAlert, BookOpen, Activity, PhoneCall, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'analyzer' | 'history' | 'directory';
  setActiveTab: (tab: 'analyzer' | 'history' | 'directory') => void;
  criticalCount: number;
  onEmergencyClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  criticalCount,
  onEmergencyClick,
}) => {
  return (
    <header className="bg-white text-slate-800 border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('analyzer')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-xs">
              <span className="text-white font-black text-base font-mono">S</span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-800 flex items-center gap-1.5">
                PROJECT SAMVEDNA
                <span className="text-indigo-600 font-semibold">/ AI COUNSELOR</span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Psychiatric Triage & Early Distress Diagnostic System
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              id="tab-analyzer"
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Diagnostic Analyzer</span>
            </button>

            <button
              id="tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Case History</span>
              {criticalCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-black rounded-full animate-bounce">
                  {criticalCount}
                </span>
              )}
            </button>

            <button
              id="tab-directory"
              onClick={() => setActiveTab('directory')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'directory'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Crisis Helplines</span>
            </button>
          </nav>

          {/* System Status & Emergency Action */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                Operational
              </span>
            </div>

            <button
              id="btn-emergency-hotline"
              onClick={onEmergencyClick}
              className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm transition-all"
            >
              <ShieldAlert className="h-4 w-4 animate-bounce text-amber-200" />
              <span className="hidden sm:inline">24/7 Helpline</span>
              <span className="sm:hidden">Call</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
