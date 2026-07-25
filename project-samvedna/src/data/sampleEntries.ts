import { SampleJournal, EmergencyContact } from '../types';

export const SAMPLE_JOURNALS: SampleJournal[] = [
  {
    id: 'sample-1',
    title: 'Severe Isolation & Hopelessness Log',
    authorAlias: 'Student #4092',
    context: 'Hostel Block-C, 3rd Sem CS',
    category: 'Critical Risk',
    expectedRisk: 'Critical',
    text: `I can't take this anymore. Everyone in my batch seems to have everything figured out, while I'm just drowning in mid-term backlogs. I haven't left my hostel room for four days straight. I skipped all my meals and nobody even noticed I wasn't there. My parents spent all their hard-earned savings sending me to this institute, and I'm failing them completely. I keep staring at the balcony late at night thinking it would just be so much easier if I wasn't around tomorrow. The dark thoughts won't stop repeating in my head. What is even the point of waking up?`
  },
  {
    id: 'sample-2',
    title: 'Panic & Exam Anxiety Before Finals',
    authorAlias: 'Student #2811',
    context: 'Day Scholar, 1st Year Biotech',
    category: 'Moderate Distress',
    expectedRisk: 'Moderate',
    text: `My hands won't stop shaking. The end-semester exams start in two days and my mind completely blanks out every time I open my notes. I haven't slept more than 2 hours a night this whole week. My heart races constantly and I felt like I couldn't breathe in the library today. I feel so overwhelmed by my family's expectations, but I really want to pull through if I can just get some guidance or relief from this intense anxiety.`
  },
  {
    id: 'sample-3',
    title: 'Hostel Homesickness & Peer Conflict',
    authorAlias: 'Student #1105',
    context: 'Hostel Block-A, Freshmen Mechanical',
    category: 'Moderate Distress',
    expectedRisk: 'Moderate',
    text: `It's Friday evening and everyone in the wing went out together without inviting me again. I feel so lonely here. I miss my mom's food and my home so much. I tried calling home but I didn't want to make them worry by crying on the phone. My roommate doesn't talk to me much either. I feel invisible on this huge campus and wonder if I made a mistake coming here.`
  },
  {
    id: 'sample-4',
    title: 'Healthy Coping & Gratitude Entry',
    authorAlias: 'Student #5120',
    context: 'Hostel Block-D, Final Year Electrical',
    category: 'Low / Positive',
    expectedRisk: 'Low',
    text: `Today was a productive day! Placements season is tough, but I had a good study session with my project partners today at the central library. We practiced mock interview questions together and drank chai afterwards. Feeling much more confident about tomorrow's presentation. Even if things get stressful, I know I have a solid support group here.`
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    name: 'Tele-MANAS (Govt of India Mental Health Helpline)',
    phone: '14416 / 1800-891-4416',
    availability: '24/7 Toll-Free (Multilingual)',
    description: 'National Tele-Mental Health Programme of India providing immediate crisis intervention and psychological support.',
    type: 'national'
  },
  {
    name: 'Vandrevala Foundation Helpline',
    phone: '+91 9999 666 555',
    availability: '24/7 Free Counseling',
    description: 'Experienced psychiatric counselors for acute emotional distress, depression, and suicide prevention.',
    type: 'national'
  },
  {
    name: 'KIRAN Mental Health Rehabilitation',
    phone: '1800-599-0019',
    availability: '24/7 Helpline',
    description: 'Ministry of Social Justice helpline offering early screening, psychological support, and crisis management.',
    type: 'national'
  },
  {
    name: 'Campus Emergency Medical Officer & Counseling Cell',
    phone: 'Ext. 108 / +91-98765-43210',
    availability: '24/7 On-Call Campus Warden & Doctor',
    description: 'Immediate on-site psychiatric response team, ambulance service, and hostel wardens emergency network.',
    type: 'campus'
  }
];
