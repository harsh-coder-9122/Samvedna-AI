import React, { useState } from 'react';
import { DiagnosticReport } from '../types';
import { CriticalAlertBanner } from './CriticalAlertBanner';
import ReactMarkdown from 'react-markdown';
import { ShieldAlert, AlertTriangle, Activity, Heart, CheckCircle2, UserCheck, Building2, Copy, Check, FileDown, Eye, Save, Sparkles, BookOpen } from 'lucide-react';

interface DiagnosticReportViewProps {
  report: DiagnosticReport;
  onSaveToHistory?: (report: DiagnosticReport) => void;
  onOpenDirectory?: () => void;
  isSaved?: boolean;
}

export const DiagnosticReportView: React.FC<DiagnosticReportViewProps> = ({
  report,
  onSaveToHistory,
  onOpenDirectory,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'rawText'>('visual');

  const handleCopy = () => {
    navigator.clipboard.writeText(report.rawReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Color mapping for Risk Severity
  const getRiskBadgeClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'text-red-600 font-black italic text-3xl';
      case 'moderate':
        return 'text-amber-600 font-black italic text-3xl';
      case 'low':
      default:
        return 'text-emerald-600 font-black italic text-3xl';
    }
  };

  // Color mapping for Distress Score Meter
  const getScoreMeterColor = (score: number) => {
    if (score < 40) return 'bg-red-600';
    if (score < 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div id="diagnostic-report-container" className="space-y-6">
      
      {/* Critical Alert Top Banner (Triggered if distressScore < 40 or risk is Critical) */}
      {report.isCriticalAlert && (
        <CriticalAlertBanner
          distressScore={report.distressScore}
          riskSeverity={report.riskSeverity}
          studentAlias={report.studentAlias}
          studentContext={report.studentContext}
          onOpenDirectory={onOpenDirectory}
        />
      )}

      {/* Main Diagnostic Card Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-slate-900">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <Activity className="h-4 w-4" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-tight">
                Diagnostic Analysis
              </h2>
            </div>
            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-1">
              <span>Subject: <strong className="text-slate-800 font-bold">{report.studentAlias}</strong></span>
              <span>•</span>
              <span>Context: <strong className="text-slate-800 font-bold">{report.studentContext}</strong></span>
              <span>•</span>
              <span>Report generated {new Date(report.timestamp).toLocaleString()}</span>
            </p>
          </div>

          {/* Action Toolbar & Critical Badge */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {report.isCriticalAlert && (
              <div className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-black tracking-widest text-sm shadow-md shadow-red-100 uppercase">
                **CRITICAL_ALERT**
              </div>
            )}

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all"
              title="Copy Exact Markdown Report"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>PDF</span>
            </button>

            {onSaveToHistory && (
              <button
                onClick={() => onSaveToHistory(report)}
                disabled={isSaved}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                {isSaved ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <Save className="h-3.5 w-3.5" />}
                <span>{isSaved ? 'Saved in History' : 'Save Record'}</span>
              </button>
            )}
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center space-x-2 mt-4">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'visual'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Diagnostic Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('rawText')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'rawText'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Clinical Markdown Output</span>
          </button>
        </div>

        {/* TAB 1: VISUAL DIAGNOSTIC DASHBOARD */}
        {activeTab === 'visual' && (
          <div className="mt-6 space-y-8">
            
            {/* 📊 Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Distress Score */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Distress Score
                </p>
                <div className="flex items-end space-x-2">
                  <span className={`text-5xl font-black ${report.distressScore < 40 ? 'text-red-600' : report.distressScore < 70 ? 'text-amber-500' : 'text-emerald-600'}`}>
                    {report.distressScore}
                  </span>
                  <span className="text-slate-400 text-xl font-light mb-1 uppercase">/ 100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div
                    className={`h-full ${getScoreMeterColor(report.distressScore)}`}
                    style={{ width: `${Math.min(100, Math.max(0, report.distressScore))}%` }}
                  />
                </div>
              </div>

              {/* Primary Emotion */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Primary Emotion
                </p>
                <span className="text-3xl font-bold text-slate-800 capitalize">
                  {report.primaryEmotion}
                </span>
                <div className="mt-4 flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase">
                    Apathy / Hopelessness
                  </span>
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase">
                    Linguistic Triage
                  </span>
                </div>
              </div>

              {/* Risk Severity Level */}
              <div className={`rounded-2xl p-6 border shadow-xs ${
                report.riskSeverity.toLowerCase() === 'critical'
                  ? 'bg-red-50 border-red-100'
                  : report.riskSeverity.toLowerCase() === 'moderate'
                  ? 'bg-amber-50 border-amber-100'
                  : 'bg-emerald-50 border-emerald-100'
              }`}>
                <p className={`text-[11px] font-bold uppercase tracking-widest mb-4 ${
                  report.riskSeverity.toLowerCase() === 'critical' ? 'text-red-500' : 'text-slate-400'
                }`}>
                  Risk Severity Level
                </p>
                <span className={getRiskBadgeClass(report.riskSeverity)}>
                  {report.riskSeverity}
                </span>
                <p className={`mt-4 text-[11px] font-bold uppercase tracking-wider ${
                  report.riskSeverity.toLowerCase() === 'critical' ? 'text-red-600' : 'text-slate-500'
                }`}>
                  {report.riskSeverity.toLowerCase() === 'critical' ? 'Immediate Intervention Required' : 'Standard Monitoring Protocol'}
                </p>
              </div>

            </div>

            {/* Grid for Risk Indicators & Actionable Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Key Risk Indicators Identified */}
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center">
                  <span className="w-2 h-4 bg-indigo-600 mr-2 rounded-xs"></span>
                  🔍 Key Risk Indicators Identified
                </h3>

                {report.keyIndicators && report.keyIndicators.length > 0 ? (
                  <ul className="space-y-4">
                    {report.keyIndicators.map((trigger, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <span className="w-5 h-5 rounded bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 font-mono">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {trigger}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 italic">No explicit high-risk behavioral indicators detected.</p>
                )}
              </div>

              {/* Recommended Actionable Steps */}
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center">
                  <span className="w-2 h-4 bg-emerald-500 mr-2 rounded-xs"></span>
                  🛠️ Recommended Actionable Steps
                </h3>

                <div className="space-y-4">
                  <div className="p-4 bg-white border border-slate-200 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">
                      For Parents / Guardians
                    </p>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      {report.recommendedSteps.parentsGuardians}
                    </p>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">
                      For Hostel Wardens / Counselors
                    </p>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      {report.recommendedSteps.wardensCounselors}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Original Text Reference Box */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">
                Input Log Content (Diary Entry / Message)
              </p>
              <p className="italic text-slate-700 text-sm leading-relaxed">
                "{report.entryText}"
              </p>
            </div>

          </div>
        )}

        {/* TAB 2: EXACT MARKDOWN OUTPUT TEXT */}
        {activeTab === 'rawText' && (
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-mono text-indigo-600 font-bold uppercase tracking-wider">
                Clinical Markdown Report Output
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-bold"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="prose max-w-none text-xs sm:text-sm font-mono leading-relaxed p-5 bg-white rounded-xl border border-slate-200 text-slate-800 whitespace-pre-wrap">
              <ReactMarkdown>{report.rawReport}</ReactMarkdown>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
