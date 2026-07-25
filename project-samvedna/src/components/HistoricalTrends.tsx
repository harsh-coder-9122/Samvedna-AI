import React, { useState } from 'react';
import { DiagnosticReport, RiskSeverity } from '../types';
import { Activity, AlertTriangle, CheckCircle2, Search, Filter, Calendar, MessageSquare, Trash2, ArrowUpRight, FileSpreadsheet } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

interface HistoricalTrendsProps {
  reports: DiagnosticReport[];
  onSelectReport: (report: DiagnosticReport) => void;
  onDeleteReport: (id: string) => void;
  onUpdateStatus: (id: string, status: DiagnosticReport['status'], notes?: string) => void;
}

export const HistoricalTrends: React.FC<HistoricalTrendsProps> = ({
  reports,
  onSelectReport,
  onDeleteReport,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.studentAlias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentContext?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.primaryEmotion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.entryText?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      severityFilter === 'All' || r.riskSeverity.toLowerCase() === severityFilter.toLowerCase();

    return matchesSearch && matchesSeverity;
  });

  // Prepare chart data chronologically
  const chartData = [...reports]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((r, index) => ({
      name: `#${index + 1} (${r.studentAlias || 'Anon'})`,
      date: new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      distressScore: r.distressScore,
      severity: r.riskSeverity,
      emotion: r.primaryEmotion,
    }));

  const criticalCount = reports.filter((r) => r.isCriticalAlert || r.riskSeverity === 'Critical').length;
  const moderateCount = reports.filter((r) => r.riskSeverity === 'Moderate').length;
  const lowCount = reports.filter((r) => r.riskSeverity === 'Low').length;

  const handleExportCSV = () => {
    if (reports.length === 0) return;

    const headers = ['ID', 'Timestamp', 'Student Alias', 'Context', 'Distress Score', 'Risk Severity', 'Primary Emotion', 'Status', 'Clinician Notes'];
    const rows = reports.map(r => [
      r.id,
      new Date(r.timestamp).toLocaleString(),
      `"${r.studentAlias || ''}"`,
      `"${r.studentContext || ''}"`,
      r.distressScore,
      r.riskSeverity,
      `"${r.primaryEmotion || ''}"`,
      `"${r.status || 'Pending Review'}"`,
      `"${(r.clinicianNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `samvedna_case_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Header & Stats Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h3 className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-1">
              Case Analytics Log
            </h3>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              <span>Student Psychological Case History & Distress Trends</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Longitudinal tracking of student distress scores, clinical interventions, and case status.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={reports.length === 0}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4 text-indigo-600" />
            <span>Export Case Log CSV</span>
          </button>
        </div>

        {/* Summary Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Cases Logged</span>
            <div className="text-3xl font-black text-slate-800 mt-1">{reports.length}</div>
          </div>

          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Critical Cases
            </span>
            <div className="text-3xl font-black text-red-600 mt-1">{criticalCount}</div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Moderate Distress</span>
            <div className="text-3xl font-black text-amber-600 mt-1">{moderateCount}</div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Low / Safe Logs</span>
            <div className="text-3xl font-black text-emerald-600 mt-1">{lowCount}</div>
          </div>
        </div>
      </div>

      {/* Distress Score Trend Recharts Line Chart */}
      {reports.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-800">
              Distress Score Progression Curve (Score &lt; 40 indicates Critical Zone)
            </h3>
            <span className="text-xs text-slate-400 font-mono">100 = Safe, 0 = Critical</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <ReferenceLine y={40} stroke="#dc2626" strokeDasharray="4 4" label={{ value: 'CRITICAL THRESHOLD (<40)', fill: '#dc2626', fontSize: 10, position: 'insideTopLeft' }} />
                <Line
                  type="monotone"
                  dataKey="distressScore"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#4f46e5', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 8, fill: '#6366f1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cases by student, text, emotion..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-400 hidden sm:inline" />
          <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline uppercase tracking-wider text-[10px]">Severity:</span>
          {['All', 'Critical', 'Moderate', 'Low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                severityFilter === sev
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

      </div>

      {/* Case Logs List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500 text-xs font-medium">
            No diagnostic case records match your current filters.
          </div>
        ) : (
          filteredReports.map((item) => (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl p-5 transition-all space-y-4 ${
                item.isCriticalAlert || item.riskSeverity === 'Critical'
                  ? 'border-red-300 shadow-sm shadow-red-50'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              
              {/* Card Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                    item.riskSeverity === 'Critical'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : item.riskSeverity === 'Moderate'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {item.riskSeverity} Risk
                  </span>
                  
                  <span className="text-sm font-bold text-slate-800">
                    {item.studentAlias || 'Anonymous Student'}
                  </span>

                  <span className="text-xs text-slate-500">({item.studentContext || 'General Log'})</span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {new Date(item.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                  <span className={`font-bold ${item.distressScore < 40 ? 'text-red-600 font-black' : 'text-slate-700'}`}>
                    Score: {item.distressScore}/100
                  </span>
                </div>
              </div>

              {/* Entry Preview */}
              <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                "{item.entryText}"
              </p>

              {/* Counselor Status & Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                
                {/* Intervention Status Selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500 font-bold uppercase text-[10px] tracking-wider">Status:</span>
                  <select
                    value={item.status || 'Pending Review'}
                    onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  >
                    <option value="Pending Review">Pending Review</option>
                    <option value="Intervention Scheduled">Intervention Scheduled</option>
                    <option value="Parents Contacted">Parents Contacted</option>
                    <option value="Closed/Monitored">Closed / Monitored</option>
                  </select>
                </div>

                {/* View Full Report & Delete */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onSelectReport(item)}
                    className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                  >
                    <span>View Diagnostic Report</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteReport(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-all"
                    title="Delete Case Log"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
