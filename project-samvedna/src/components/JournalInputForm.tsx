import React, { useState } from 'react';
import { BookOpen, Sparkles, User, GraduationCap, Mic, MicOff, Upload, FileText, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SAMPLE_JOURNALS } from '../data/sampleEntries';
import { SampleJournal } from '../types';

interface JournalInputFormProps {
  onAnalyze: (text: string, studentAlias: string, studentContext: string) => Promise<void>;
  isLoading: boolean;
}

export const JournalInputForm: React.FC<JournalInputFormProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const [studentAlias, setStudentAlias] = useState('');
  const [studentContext, setStudentContext] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Preset Sample Selection
  const handleSelectSample = (sample: SampleJournal) => {
    setSelectedSampleId(sample.id);
    setText(sample.text);
    setStudentAlias(sample.authorAlias);
    setStudentContext(sample.context);
    setErrorMsg('');
  };

  // Handle Voice Dictation
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type or paste your log.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setText((prev) => (prev ? prev + ' ' + currentTranscript : currentTranscript));
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Handle File Upload (.txt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setText(content);
        if (!studentAlias) setStudentAlias(file.name.replace(/\.[^/.]+$/, ""));
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setErrorMsg('Please enter or select a student journal entry text to analyze.');
      return;
    }
    setErrorMsg('');
    onAnalyze(text.trim(), studentAlias.trim() || 'Anonymous Student', studentContext.trim() || 'General Student Log');
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-slate-800">
      
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h3 className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-1">
            Input Source Log
          </h3>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <span>Student Journal & Entry Intake</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyze personal logs, diary entries, social messages, or counselor intake notes.
          </p>
        </div>

        {/* Quick Sample Presets Loader */}
        <div className="flex flex-col sm:items-end space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Sample Cases:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_JOURNALS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  selectedSampleId === sample.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={sample.title}
              >
                {sample.category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        
        {/* Student Metadata Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-indigo-600" />
              <span>Student ID / Alias (Optional)</span>
            </label>
            <input
              type="text"
              value={studentAlias}
              onChange={(e) => setStudentAlias(e.target.value)}
              placeholder="e.g. Aryan Mehta or Student #4092"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
              <span>Academic / Hostel Context (Optional)</span>
            </label>
            <input
              type="text"
              value={studentContext}
              onChange={(e) => setStudentContext(e.target.value)}
              placeholder="e.g. 2nd Year B.Tech • Hostel Block C"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Text Area Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
              <span>Input Log (Diary Entry / Message)</span>
            </label>
            <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={6}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Paste student journal entry, personal letter, diary log, or counselor note here... (e.g. 'It's getting harder to wake up every day. The pressure of exams feels like a weight...')"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all leading-relaxed"
            />

            {/* Floating Quick Action Micro-Bar */}
            <div className="absolute bottom-3 right-3 flex items-center space-x-2 bg-white/95 backdrop-blur-md p-1.5 rounded-lg border border-slate-200 shadow-sm">
              
              {/* Voice Dictation Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 font-semibold ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={isListening ? 'Stop Recording' : 'Dictate with Microphone'}
              >
                {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                <span className="text-[10px] hidden sm:inline">{isListening ? 'Listening...' : 'Voice'}</span>
              </button>

              {/* Upload Text File Button */}
              <label
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer text-xs transition-all flex items-center gap-1 font-semibold"
                title="Upload Text Log File"
              >
                <Upload className="h-3.5 w-3.5" />
                <span className="text-[10px] hidden sm:inline">Import .txt</span>
                <input type="file" accept=".txt,.log" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Clear Text */}
              {text && (
                <button
                  type="button"
                  onClick={() => {
                    setText('');
                    setSelectedSampleId('');
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-md text-xs transition-all"
                  title="Clear Input"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Validation Error Message */}
        {errorMsg && (
          <div className="flex items-center space-x-2 text-red-700 bg-red-50 border border-red-200 p-3.5 rounded-xl text-xs font-medium">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Encrypted Diagnostic Processing • Gemini 3.6 Flash</span>
          </div>

          <button
            id="btn-analyze-journal"
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm text-white shadow-sm flex items-center justify-center space-x-2 transition-all ${
              isLoading
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>Running Diagnostic Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-white" />
                <span>Run Samvedna Diagnostic Analysis</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
