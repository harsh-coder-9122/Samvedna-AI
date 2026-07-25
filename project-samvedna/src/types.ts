export type RiskSeverity = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface DiagnosticReport {
  id: string;
  timestamp: string;
  studentAlias?: string;
  studentContext?: string; // e.g. Hostel Resident, Day Scholar, 2nd Year B.Tech
  entryText: string;
  rawReport: string;
  isCriticalAlert: boolean;
  distressScore: number; // 0 to 100 (100 = safe/positive, <40 = critical distress)
  primaryEmotion: string;
  riskSeverity: RiskSeverity;
  keyIndicators: string[];
  recommendedSteps: {
    parentsGuardians: string;
    wardensCounselors: string;
  };
  clinicianNotes?: string;
  status?: 'Pending Review' | 'Intervention Scheduled' | 'Parents Contacted' | 'Closed/Monitored';
}

export interface SampleJournal {
  id: string;
  title: string;
  authorAlias: string;
  context: string;
  text: string;
  expectedRisk: RiskSeverity;
  category: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  availability: string;
  description: string;
  type: 'national' | 'campus' | 'medical';
}
