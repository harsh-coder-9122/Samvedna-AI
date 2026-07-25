/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DiagnosticReport } from './types';
import { Header } from './components/Header';
import { JournalInputForm } from './components/JournalInputForm';
import { DiagnosticReportView } from './components/DiagnosticReportView';
import { HistoricalTrends } from './components/HistoricalTrends';
import { EmergencyDirectory } from './components/EmergencyDirectory';
import { Heart, ShieldCheck, Sparkles, HeartPulse, AlertCircle, PhoneCall } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'samvedna_case_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'history' | 'directory'>('analyzer');
  const [currentReport, setCurrentReport] = useState<DiagnosticReport | null>(null);
  const [historyReports, setHistoryReports] = useState<DiagnosticReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setHistoryReports(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveReportsToStorage = (updated: DiagnosticReport[]) => {
    setHistoryReports(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  };

  // Analyze Journal Entry Handler
  const handleAnalyze = async (text: string, studentAlias: string, studentContext: string) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          studentAlias,
          studentContext,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete diagnostic analysis.');
      }

      const report: DiagnosticReport = data.report;
      setCurrentReport(report);

      // Auto-save to history log
      const updatedHistory = [report, ...historyReports.filter((r) => r.id !== report.id)];
      saveReportsToStorage(updatedHistory);

      // Scroll smoothly to report
      setTimeout(() => {
        const reportEl = document.getElementById('diagnostic-report-container');
        if (reportEl) {
          reportEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (err: any) {
      console.error('Error analyzing entry:', err);
      setApiError(err?.message || 'An error occurred while analyzing the entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual save to history
  const handleSaveToHistory = (report: DiagnosticReport) => {
    const exists = historyReports.some((r) => r.id === report.id);
    if (!exists) {
      const updated = [report, ...historyReports];
      saveReportsToStorage(updated);
    }
  };

  // Handle delete from history
  const handleDeleteReport = (id: string) => {
    const updated = historyReports.filter((r) => r.id !== id);
    saveReportsToStorage(updated);
    if (currentReport?.id === id) {
      setCurrentReport(null);
    }
  };

  // Handle update status in history
  const handleUpdateStatus = (id: string, status: DiagnosticReport['status'], notes?: string) => {
    const updated = historyReports.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status,
          clinicianNotes: notes !== undefined ? notes : r.clinicianNotes,
        };
      }
      return r;
    });
    saveReportsToStorage(updated);
    if (currentReport?.id === id) {
      setCurrentReport((prev) => (prev ? { ...prev, status, clinicianNotes: notes !== undefined ? notes : prev.clinicianNotes } : null));
    }
  };

  const criticalCount = historyReports.filter((r) => r.isCriticalAlert || r.riskSeverity === 'Critical').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        criticalCount={criticalCount}
        onEmergencyClick={() => setActiveTab('directory')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Global Error Notice if API Key Missing or Error */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs text-red-800 flex items-start space-x-3 shadow-sm">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-sm text-red-900">Diagnostic Analysis Error</span>
              <p>{apiError}</p>
              <p className="text-[11px] text-red-700 italic">
                Note: Ensure your GEMINI_API_KEY is configured in Settings &gt; Secrets if accessing remote server.
              </p>
            </div>
          </div>
        )}

        {/* TAB 1: DIAGNOSTIC ANALYZER */}
        {activeTab === 'analyzer' && (
          <div className="space-y-8">
            
            {/* Introductory Mission Badge */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                    <HeartPulse className="h-3.5 w-3.5" />
                  </span>
                  <h2 className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em]">
                    Project Samvedna Diagnostic Mission
                  </h2>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                  Automated psychiatric triage detecting early signs of depression, severe anxiety, loneliness, or suicidal ideation in student journal entries. Confidential analysis powered by Gemini 3.6 Flash AI.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Encrypted Medical Protocol</span>
                </span>
              </div>
            </div>

            {/* Input Form */}
            <JournalInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />

            {/* Diagnostic Report Display */}
            {currentReport && (
              <div className="pt-2">
                <DiagnosticReportView
                  report={currentReport}
                  onSaveToHistory={handleSaveToHistory}
                  onOpenDirectory={() => setActiveTab('directory')}
                  isSaved={historyReports.some((r) => r.id === currentReport.id)}
                />
              </div>
            )}

          </div>
        )}

        {/* TAB 2: HISTORICAL CASE TRENDS */}
        {activeTab === 'history' && (
          <HistoricalTrends
            reports={historyReports}
            onSelectReport={(report) => {
              setCurrentReport(report);
              setActiveTab('analyzer');
            }}
            onDeleteReport={handleDeleteReport}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {/* TAB 3: EMERGENCY DIRECTORY */}
        {activeTab === 'directory' && <EmergencyDirectory />}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-indigo-400" />
            <span className="font-semibold text-slate-200">PROJECT SAMVEDNA</span>
            <span>— SECURE MEDICAL RECORD • HIPAA COMPLIANT ENVIRONMENT</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-mono">
            <span>Tele-MANAS Helpline: 14416</span>
            <span>•</span>
            <span>v4.2.0-stable</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
