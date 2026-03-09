import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Users, CircleDollarSign, Download, Plus, Building2, GraduationCap,
  FileSpreadsheet, ClipboardCheck, X, CheckCircle2, CloudCog, AlertTriangle, Info, Pencil,
  Trash2, BookOpen, Briefcase, FileText, CalendarDays, Lock, LogOut, UserPlus, Mail,
  UploadCloud, UserCheck, Phone, CalendarClock, Filter, RotateCcw, History, DatabaseZap,
  BarChart3, IdCard, Megaphone, PenTool, Target, Calculator, Wallet, ShieldAlert, Clock, MessageCircle, TrendingUp
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, doc, setDoc, updateDoc, deleteDoc, writeBatch, query, where } from 'firebase/firestore';

// --- FIREBASE INITIALIZATION ---
const firebaseConfig = {
  apiKey: "AIzaSyCUh4Rnam8LFUkSqOey_trxKheG6pzumeI",
  authDomain: "spero-system-management.firebaseapp.com",
  projectId: "spero-system-management",
  storageBucket: "spero-system-management.firebasestorage.app",
  messagingSenderId: "849912833854",
  appId: "1:849912833854:web:cc34bcb99afb47acd66e6f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Fallback Master Accounts
const MASTER_ROLE_MAP = {
  'md@spero.edu': { role: 'Principal', name: 'Managing Director' },
  'manager@spero.edu': { role: 'Manager', name: 'Be Lar Har' },
  'sumyat@spero.edu': { role: 'Admin Officer', name: 'Su Myat' },
  'kyawzin@spero.edu': { role: 'Senior Teacher', name: 'Kyaw Zin' }
};

// --- STATIC METHODOLOGY DATA ---
const teachingFrameworks = [
  { name: 'PPP Methodology', stages: ['1. Lead-In', '2. Context', '3. MFP', '4. CCQs', '5. Meaning Practice', '6. Form Practice', '7. Freer Practice', '8. Production', '9. Feedback'] },
  { name: 'TBL Approach', stages: ['1. Lead-In', '2. Pre-Teach', '3. Gist Reading', '4. Examples', '5. MFP', '6. CCQs', '7. Meaning', '8. Form', '9. Freer', '10. Production', '11. Feedback'] },
  { name: 'Receptive Skills', stages: ['1. Pre: Lead-in', '2. Pre: Predict', '3. Pre: Vocab', '4. While: Gist', '5. While: Details', '6. While: Inference', '7. Post: Task', '8. Post: Language', '9. Feedback'] },
  { name: 'Productive (Speaking)', stages: ['1. Lead-in', '2. Content Analysis', '3. Language Analysis', '4. Prep Content', '5. Prep Language', '6. Guided', '7. Production', '8. Feedback'] },
  { name: 'Productive (Writing)', stages: ['1. Lead-In', '2. Gist', '3. Text analysis', '4. Structure', '5. Style', '6. Gap Fill', '7. Writing Task', '8. Self Check', '9. Edit', '10. Peer', '11. Teacher', '12. Wrap up'] }
];

const roleDocuments = {
  'Principal': { title: 'Principal / MD', icon: <Building2 className="h-6 w-6 text-slate-800" />, spec: 'CEO of Spero. Responsible for overall enterprise strategy, financial health, and franchise scaling.', workflow: ['Set academic and financial goals.', 'Review revenue and expense statements.', 'Lead management and staff alignment.', 'Drive brand expansion.'], frameworks: [] },
  'Senior Teacher': { title: 'Senior Teacher', icon: <GraduationCap className="h-6 w-6 text-indigo-500" />, spec: 'Academic quality, master curriculum design, and coaching Junior Teachers.', workflow: ['Log in 15 mins prior for tech sync.', 'Review Junior slide decks.', 'Deliver CEFR-aligned classes.', 'Conduct Zoom feedback sessions.'], frameworks: teachingFrameworks },
  'Junior Teacher': { title: 'Junior Teacher', icon: <Users className="h-6 w-6 text-blue-500" />, spec: 'Executing Spero lesson frameworks under guidance.', workflow: ['Prepare lesson assets.', 'Submit plans for approval.', 'Deliver classes adhering to frameworks.', 'Attend pedagogical training.'], frameworks: teachingFrameworks },
  'Admin Officer': { title: 'Admin Officer', icon: <Briefcase className="h-6 w-6 text-emerald-500" />, spec: 'Daily operations, enrollment, CEFR placement, and financial logging.', workflow: ['Open front desk.', 'Consult walk-in students.', 'Process enrollments.', 'Update revenue.'], frameworks: [] },
  'Manager': { title: 'Manager', icon: <Briefcase className="h-6 w-6 text-purple-500" />, spec: 'Oversees daily operations, academic quality, and compliance.', workflow: ['Review financial logs.', 'Monitor pipeline.', 'Review SOP completions.', 'Report metrics to MD.'], frameworks: [] },
  'Supervisor': { title: 'Supervisor', icon: <Users className="h-6 w-6 text-indigo-600" />, spec: 'Oversees a team of teachers, ensuring academic quality.', workflow: ['Conduct class observations.', 'Review lesson plans.', 'Mentor Junior Teachers.', 'Report KPIs.'], frameworks: teachingFrameworks },
  'HR Manager': { title: 'HR Manager', icon: <Briefcase className="h-6 w-6 text-rose-500" />, spec: 'Employee relations, SOP compliance, payroll prep.', workflow: ['Track attendance.', 'Review KPI dashboards.', 'Handle appraisals.', 'Coordinate payroll.'], frameworks: [] },
  'Recruitment Director': { title: 'Recruitment Director', icon: <Users className="h-6 w-6 text-amber-500" />, spec: 'Strategizes talent acquisition.', workflow: ['Post job ads.', 'Conduct interviews.', 'Manage hiring pipeline.', 'Execute onboarding.'], frameworks: [] },
  'Content Editor': { title: 'Content Editor', icon: <PenTool className="h-6 w-6 text-teal-500" />, spec: 'Creating and editing high-quality English content.', workflow: ['Draft captions.', 'Proofread decks.', 'Collaborate with marketing.', 'Ensure brand voice.'], frameworks: [] },
  'Social Media Manager': { title: 'Social Media Manager', icon: <Megaphone className="h-6 w-6 text-pink-500" />, spec: 'Manages online presence and ad campaigns.', workflow: ['Schedule posts.', 'Monitor ads.', 'Engage with comments.', 'Transfer hot leads.'], frameworks: [] }
};

const roleSOPs = {
  'Principal': [
    { id: 'p1', task: '[Strategy] Review weekly net profit and operational metrics on the Dashboard' },
    { id: 'p2', task: '[Leadership] Conduct monthly strategic alignment meeting with Management and Supervisors' },
    { id: 'p3', task: '[Franchise] Audit franchise branch performance and compliance' }
  ],
  'Admin Officer': [
    { id: 'ao1', task: 'Shift ဝင်ကြောင်း သက်ဆိုင်ရာ Group တွင် အကြောင်းကြားရန်' },
    { id: 'ao2', task: 'Sales Target ပြည့်မီစေရန် ကျောင်း Social Media Channel များတွင် စုံစမ်းမေးမြန်းထားသည်များကို သေချာ Consult လုပ်ပြီး စာရင်းပြုစုရန်' },
    { id: 'ao3', task: 'တရက်တာ မိမိဖုန်းခေါ်ဆိုပြီး အရောင်းရှင်းပြရမည့် ကျောင်းသားများစာရင်းကို ပြုစုရန်' },
    { id: 'ao4', task: 'ပြုစုထားသော ဖုန်းခေါ်ဆိုရန် ကျောင်းသားများ စာရင်းကို သေသေချာချာ ဖုန်းဆက်ရှင်းပြပေးရန်' },
    { id: 'ao5', task: 'Leads, Prospects & Enrolled ကျောင်းသူကျောင်းသားများကို စာရင်းပြုစုပြီး Telegram Group များတွင် Report တင်ရန်' },
    { id: 'ao6', task: 'မိမိကိုင်တွယ်ထားသော Leads, Prospects & Enrolled ကျောင်းသူကျောင်းသားများကို Management System တွင် စာရင်းပြုစုရန်' },
    { id: 'ao7', task: 'ဒေတာအချက်အလက်များ မမှားစေရန်အတည်ပြုပြီး Double Check ပြုလုပ်ရန်' },
    { id: 'ao8', task: 'Admin Account များမှ ကျောင်းသူကျောင်းသားများ၏ မေးမြန်းစုံစမ်းမှုများကို စနစ်တကျ ဖြေကြားပေးရန်' },
    { id: 'ao9', task: 'စီမံရေးရာလုပ်ငန်းဆောင်တာများဖြစ်သော ဆရာ၊မ များနှင့်ပြောဆိုချိတ်ဆက် လုပ်ဆောင်မှုများကို လုပ်ဆောင်ရန်နှင့် လိုအပ်သော တောင်းခံမှုများကို ဆောင်ရွက်ပေးရန်' },
    { id: 'ao10', task: 'ကျောင်းစီမံရေးရာလုပ်ငန်းဆောင်တာများဖြစ်သော ကျောင်းသားများ၏စာရွက်စာတမ်းများကို လိုအပ်သလို ပြင်ဆင်ရန်၊ ပို့ပေးရန်' },
    { id: 'ao11', task: 'စီမံရေးရာဌာန၏ လုပ်ငန်းချိန်သတ်မှတ်ရာတွင် လုပ်ငန်းချိန်အတိအကျ တွက်ချက်စစ်ဆေးရန်' }
  ],
  'Senior Teacher': [
    { id: 'st1', task: 'Junior Teacher များကို သင်ကြားရေးနှင့်သက်ဆိုင်သော Spero ၏ Regulated Approaches, Methodologies & Frameworks များကို Training ပေးရန်' },
    { id: 'st2', task: 'Manager မှ ချပေးထားသော Training Topics နှင့် Schedule များအတိုင်း လိုက်နာဆောင်ရွက်ရန်နှင့် မိမိက Junior များကို ပေးလိုသော လိုအပ်မည့် Training များကို ပြင်ဆင်ရန်' },
    { id: 'st3', task: 'Junior Teacher များအား Training ပေးရန် စနစ်တကျ သင်ကြားရေး Material များပြင်ဆင်ပြီး Training မစခင် Manager နှင့်အတူ Review ပြုလုပ်ရန်၊ Manager approval ရယူရန်' },
    { id: 'st4', task: 'Junior Teacher များမှ ရေးဆွဲထားသော Lesson Material & Lesson Plan များကို အမှားအယွင်းမရှိစနစ်တကျ စစ်ဆေးရန် နှင့် Approve, Redo, Reject ပြုလုပ်ရန်' },
    { id: 'st5', task: 'Reject လုပ်သောအခါတွင် Zoom Meeting or Senior Desk တွင် တွေ့ဆုံခေါ်ယူပြီး လိုအပ်သော Review နှင့် Feedback ပေးရန်' },
    { id: 'st6', task: 'Junior များက အတန်းမစခင် 15 မိနစ်ကြိုတင်ပြီး Colleagues များနှင့် Zoom တွင် တွေ့ဆုံပြီး Summarize လုပ်နေစဉ်တွင် Manager တာဝန်ပေးသည့်အတိုင်း အလှည့်ကျ ဝင်ရောက်စစ်ဆေးရန်' },
    { id: 'st7', task: 'စာသင်ချိန်၊ Training တက်ရောက်ချိန်၊ Meeting တွေ့ဆုံချိန်များတွင် သင့်လျော်စွာ ဝတ်စားဆင်ယင်ရန် (အိမ်နေဝတ်၊ ညအိပ်ဝတ် များ လုံးဝ မဝတ်ဆင်ရန်)' },
    { id: 'st8', task: 'စာသင်ကြားသည့်အခါ ကျောင်းမှ စနစ်တကျ ချမှတ်ပေးထားသော Approaches, Methodologies & Frameworks များနှင့်အညီသင်ကြားရန်' },
    { id: 'st9', task: 'ကျောင်းသားများ၏ တက်ရောက်စာရင်း Attendance Record ကို Notion တွင် အတန်းရက်တိုင်းတွင် စနစ်တကျ မှတ်တမ်းတင်ရန်' },
    { id: 'st10', task: 'စာဖြင့်ရေးသားထားသော တက်ရောက်၊ပျက်ကွက်စာရင်း တစောင်ကို သက်ဆိုင်ရာ Admin များထံတွင် တင်ပြရန်' },
    { id: 'st11', task: 'ကျောင်းသူကျောင်းသားများနှင့် သက်ဆိုင်သော ခွင့်၊ request၊ စာမေးမြန်းခြင်းများ ကို အချိန်မနောက်ကျစေဘဲ စနစ်တကျ ဖြေကြားဆောင်ရွက်ရန်' },
    { id: 'st12', task: 'စီမံရေးရာဌာနမှ Admin များ၊ Junior Teacher များမှ ပြောဆိုရေးသားထားသော မေးခွန်းများ၊ လုပ်ငန်းဆောင်တာများကို မနောက်ကျစေဘဲ စနစ်တကျ ဖြေကြားဆောင်ရွက်ရန်' },
    { id: 'st13', task: 'ကျောင်းစီမံရေးရာလုပ်ငန်းဆောင်တာများဖြစ်သော ကျောင်းသားများ၏စာရွက်စာတမ်းများကို လိုအပ်သလို ပြင်ဆင်ရန်၊ ပို့ပေးရန်' },
    { id: 'st14', task: 'Manager ညွန်ကြားသည့်အတိုင်း Junior များအား သင့်လျော်သလို စစ်ဆေးရန်တာဝန်များ ပေးရန်' },
    { id: 'st15', task: 'စစ်ဆေးပြီးသော အိမ်စာ၊ စာမေးပွဲ၊ Test များကို အလျဉ်းသင့်သလို စနစ်တကျ ပြုစုပြီး သက်ဆိုင်ရာ စီမံရေးရာဌာနထံသို့ ပေးပို့ရန်' }
  ],
  'Junior Teacher': [
    { id: 'jt1', task: 'Lesson Plan ရေးဆွဲပြီး ရေးဆွဲထားသော Lesson Material & Lesson Plan များကို Senior များထံ တင်ပြရန်' },
    { id: 'jt2', task: 'Senior မှ Approve လုပ်ထားသော Lesson Material & Lesson Plan များကို Notion တွင် Upload လုပ်ရန်' },
    { id: 'jt3', task: 'အတန်းမစခင် 15 မိနစ်ကြိုတင်ပြီး Colleagues များနှင့် Zoom တွင် တွေ့ဆုံပြီး Summarize လုပ်ရန်' },
    { id: 'jt4', task: 'စာသင်ချိန်၊ Training တက်ရောက်ချိန်၊ Meeting တွေ့ဆုံချိန်များတွင် သင့်လျော်စွာ ဝတ်စားဆင်ယင်ရန် (အိမ်နေဝတ်၊ ညအိပ်ဝတ် များ လုံးဝ မဝတ်ဆင်ရန်)' },
    { id: 'jt5', task: 'စာသင်ကြားသည့်အခါ ကျောင်းမှ စနစ်တကျ ချမှတ်ပေးထားသော Approaches, Methodologies & Frameworks များနှင့်အညီသင်ကြားရန်' },
    { id: 'jt6', task: 'ကျောင်းသားများ၏ တက်ရောက်စာရင်း Attendance Record ကို Notion တွင် အတန်းရက်တိုင်းတွင် စနစ်တကျ မှတ်တမ်းတင်ရန်' },
    { id: 'jt7', task: 'စာဖြင့်ရေးသားထားသော တက်ရောက်၊ပျက်ကွက်စာရင်း တစောင်ကို သက်ဆိုင်ရာ Senior များထံတွင် တင်ပြရန်' },
    { id: 'jt8', task: 'ကျောင်းသူကျောင်းသားများနှင့် သက်ဆိုင်သော ခွင့်၊ request၊ စာမေးမြန်းခြင်းများ ကို အချိန်မနောက်ကျစေဘဲ စနစ်တကျ ဖြေကြားဆောင်ရွက်ရန်' },
    { id: 'jt9', task: 'စီမံရေးရာဌာနမှ Admin များမှ ပြောဆိုရေးသားထားသော မေးခွန်းများ၊ လုပ်ငန်းဆောင်တာများကို မနောက်ကျစေဘဲ စနစ်တကျ ဖြေကြားဆောင်ရွက်ရန်' },
    { id: 'jt10', task: 'ကျောင်းစီမံရေးရာလုပ်ငန်းဆောင်တာများဖြစ်သော ကျောင်းသားများ၏စာရွက်စာတမ်းများကို လိုအပ်သလို ပြင်ဆင်ရန်၊ ပို့ပေးရန်' },
    { id: 'jt11', task: 'မိမိ၏ ကျောင်းသူ၊သားများ နှင့် Senior မှစစ်ရန် တာဝန်ပေးသော ကျောင်းသူ၊သားများ၏ အိမ်စာ၊ စာမေးပွဲ၊ Test များကို စစ်ဆေးရန်' },
    { id: 'jt12', task: 'စစ်ဆေးပြီးသော အိမ်စာ၊ စာမေးပွဲ၊ Test များကို အလျဉ်းသင့်သလို စနစ်တကျ ပြုစုပြီး သက်ဆိုင်ရာ Senior (သို့) စီမံရေးရာဌာနထံသို့ ပေးပို့ရန်' }
  ],
  'Manager': [
    { id: 'm1', task: '[Operations] Review yesterday\'s financial ledger for accuracy' },
    { id: 'm2', task: '[CRM] Audit Admissions Pipeline to ensure no leads are stagnant' },
    { id: 'm3', task: '[HR] Verify all staff have completed their daily/weekly SOP checklists' },
    { id: 'm4', task: '[Strategy] Prepare weekly performance summary for the Managing Director' }
  ],
  'Supervisor': [
    { id: 'sup1', task: '[Academic] Complete 2 formal class observations evaluating adherence to standard frameworks (PPP/TBL/Receptive/Productive)' },
    { id: 'sup2', task: '[Coaching] Conduct 1-on-1 pedagogical feedback sessions with Junior Teachers' },
    { id: 'sup3', task: '[Admin] Approve weekly lesson plans and slide decks' }
  ],
  'HR Manager': [
    { id: 'hr1', task: '[Compliance] Conduct daily audit of global SOP completion rates on the HRM Dashboard' },
    { id: 'hr2', task: '[Admin] Update staff attendance and leave balance ledger' },
    { id: 'hr3', task: '[Culture] Check in with at least 3 staff members for well-being sync' }
  ],
  'Recruitment Director': [
    { id: 'rec1', task: '[Pipeline] Update candidate tracking sheet with new applicants' },
    { id: 'rec2', task: '[Outreach] Source potential teacher candidates from LinkedIn/Job Portals' },
    { id: 'rec3', task: '[Onboarding] Review orientation materials for upcoming hires' }
  ],
  'Content Editor': [
    { id: 'ce1', task: '[Copywriting] Format video captions with short line breaks and dual Eng/MM explanations' },
    { id: 'ce2', task: '[Proofreading] Review academic slide decks for grammar and brand voice consistency' },
    { id: 'ce3', task: '[Strategy] Brainstorm weekly educational hooks based on CEFR A1-B2 pain points' }
  ],
  'Social Media Manager': [
    { id: 'smm1', task: '[Publishing] Schedule 3 Facebook posts per week optimizing for peak traffic times' },
    { id: 'smm2', task: '[Lead Gen] Transfer high-intent Facebook Messenger inquiries to the CRM Pipeline' },
    { id: 'smm3', task: '[Engagement] Reply to post comments within 1 hour to boost algorithm visibility' }
  ]
};

const speroDisciplines = [
  {
    category: "Teaching & Academic Discipline (သင်ကြားရေးရာ)",
    icon: <GraduationCap className="h-6 w-6 text-indigo-500" />,
    rules: [
      "စာသင်ကြားချိန်အတွင်း အစားအသောက်များ စားသောက်ခြင်း လုံးဝမပြုလုပ်ရ။",
      "Online အတန်းမစခင် Device နှင့် အင်တာနက်ကို ကြိုတင်သေချာစွာ ပြင်ဆင်ထားရမည်။",
      "အတန်းမစခင် အခြားဆရာ/မများနှင့် Zoom တွေ့ဆုံရန် ပျက်ကွက်ခြင်းမရှိရ။",
      "အတန်းသင်ကြားနေစဉ် ဖုန်းပြောခြင်း၊ တခြားမလိုလားအပ်သောအရာများ လုပ်ဆောင်ခြင်းမပြုရ။",
      "Training & Meeting များကို တက်ရောက်ရန် ပျက်ကွက်ခြင်း လုံးဝမရှိရ။",
      "Supervisor, Manager, Colleagues, Admin များမှ စာပို့ပါက Response လုပ်ရန် မနှောင့်နှေးရ။ မချေမငံပြောဆိုခြင်း၊ Professional မဆန်သောအပြုအမူများ လုံးဝမပြုလုပ်ရ။"
    ]
  },
  {
    category: "Time Discipline (အချိန်စည်းကမ်း)",
    icon: <Clock className="h-6 w-6 text-blue-500" />,
    rules: [
      "အလုပ်ချိန်အတွင်း Online တွင် အမြဲရှိနေရမည် (Be online and reachable during working hours)",
      "အလုပ်ချိန်အား မှားကြည့်မိခြင်း (သို့) နောက်ကျပြီး ဝင်ခြင်းမပြုလုပ်ရ (Be online 10-15 minutes early / Start meetings on time)",
      "Shift ပြောင်းလဲလိုပါက Supervisor အား ကြိုတင်အကြောင်းကြားရန် (Inform supervisor in advance if late)",
      "အလုပ်ချိန်အတွင်း အကြောင်းမဲ့ ပျောက်သွားခြင်းမရှိရ (No disappearing during working hours)",
      "အကြောင်းမကြားဘဲ အလုပ် သုံးကြိမ်နောက်ကျပါက အရေးယူခြင်းခံရမည်။"
    ]
  },
  {
    category: "Communication Discipline (ဆက်သွယ်ရေးစည်းကမ်း)",
    icon: <MessageCircle className="h-6 w-6 text-emerald-500" />,
    rules: [
      "မိမိရဲ့ လုပ်ဖော်ကိုင်ဖက်များအား စိတ်ဆိုးစွာ အော်ဟစ်ခြင်း၊ ခွဲခြားဆက်ဆံခြင်း မပြုလုပ်ရ။",
      "လုပ်ငန်းနှင့် မသက်ဆိုင်သော emotion, problems, bad attitude များ မထားရ (Professional language is required at all times).",
      "ခွင့်ယူလိုပါက ၁ ရက် သို့ ၂ ရက် ကြိုတင်အကြောင်းကြားရမည်။ (Emergency leave - inform immediately / No repeated last-minute excuses).",
      "လုပ်ငန်းခွင်တွင် အချင်းချင်း အတင်းအဖျင်းမပြောရ။",
      "Team Spirit ပျက်ပြားစေမည့် မည်သည့် မကောင်းစကားများ မပြောရ။ (သိရှိပါက warning ပေးခြင်း (or) လုပ်ငန်းမှ ထုတ်ပယ်ခံရမည်)",
      "Training ၊ Meeting တွင် ကောင်းမွန်စွာ ဝတ်စားဆင်ယင်ရန်။",
      "လုပ်ငန်းကိစ္စများအား ပူးပေါင်းဆွေးနွေး ပါဝင်ရမည်၊ အချင်းချင်း လေးစားမှုရှိရမည်။"
    ]
  },
  {
    category: "Personal & Professional Development (စွမ်းရည်ဖွံ့ဖြိုးမှု)",
    icon: <TrendingUp className="h-6 w-6 text-purple-500" />,
    rules: [
      "Training များသို့ မပြတ်မကွက် တက်ရောက်ရမည်။ ပျက်ကွက်ပြီး လုပ်ငန်းတွင် ထိခိုက်လာပါက Warning (or) Dismiss ပေးခံရပါမည်။",
      "Spero ကို မချစ်မနှစ်သက်သူများ (မိမိ organization တိုးတက်မှမလိုလားသူ / အသင်းအဖွဲ့စိတ်ဓာတ်မရှိသူ / အဆိုးမြင်ဝါဒီ ရှိပြီး အနှောင့်ယှက်ပေးသူ) ကို အဖွဲ့အစည်းမှ ဖယ်ထုတ်သွားမည်။"
    ]
  }
];

const generateStudentID = () => `SP${new Date().getFullYear().toString().slice(-2)}-${Math.floor(1000 + Math.random() * 9000)}`;

const exportCSV = (data, headers, filename) => {
  if (!data || !data.length) return;
  const csvRows = [headers.map(h => `"${h.label || h}"`).join(',')];
  data.forEach(row => { csvRows.push(headers.map(h => `"${String(row[h.key || h] || '').replace(/"/g, '""')}"`).join(',')); });
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.setAttribute('download', filename);
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
};

const getRecentYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for(let i=0; i<5; i++) { years.push((currentYear - i).toString()); }
    return years;
};

// ==========================================
// MAIN COMPONENT APPLICATION
// ==========================================
export default function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [appEnv, setAppEnv] = useState('spero-erp-production'); // ENVIRONMENT SWITCHER
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [hrSubTab, setHrSubTab] = useState('daily-sops'); 
  const [financeSubTab, setFinanceSubTab] = useState('ledger'); 
  const [studentSubTab, setStudentSubTab] = useState('pipeline'); 
  
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [dbError, setDbError] = useState(null); 
  const hasInitialRoutedRef = useRef(false);

  const [transactions, setTransactions] = useState([]);
  const [staffTasks, setStaffTasks] = useState({});
  const [employees, setEmployees] = useState([]); 
  const [students, setStudents] = useState([]); 
  
  const [sopDate, setSopDate] = useState(new Date().toISOString().split('T')[0]);
  const [kpiViewMode, setKpiViewMode] = useState('monthly');
  const [kpiMonth, setKpiMonth] = useState(() => `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
  const [kpiYear, setKpiYear] = useState(() => new Date().getFullYear().toString());

  const [payrollConfigs, setPayrollConfigs] = useState({});
  const [payrollApprovals, setPayrollApprovals] = useState({});
  const [payrollMonth, setPayrollMonth] = useState(() => `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);

  const [dashboardChartYear, setDashboardChartYear] = useState(new Date().getFullYear().toString());
  const [chartTransactions, setChartTransactions] = useState([]);
  const [cloudFetchPeriod, setCloudFetchPeriod] = useState(() => `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`); 

  const [selectedStaffSOP, setSelectedStaffSOP] = useState(null);
  const [selectedRoleDoc, setSelectedRoleDoc] = useState(null);
  const [studentBatchFilter, setStudentBatchFilter] = useState('All'); 
  const [studentClassFilter, setStudentClassFilter] = useState('All');

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', phone: '', inquiredClass: '', status: 'Lead', lastContactDate: '' });

  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editStudentData, setEditStudentData] = useState({ name: '', phone: '', inquiredClass: '', batch: '', status: '' });
  const [deletingStudent, setDeletingStudent] = useState(null);

  const [showFinanceForm, setShowFinanceForm] = useState(false);
  const [newTxn, setNewTxn] = useState({ date: '', type: 'Income', category: 'Student Fees', amount: '', desc: '', studentId: '', studentDisplayId: '', studentName: '', batchNumber: '', inquiredClass: '' });
  const [editingTxnId, setEditingTxnId] = useState(null);
  const [deletingTxn, setDeletingTxn] = useState(null);

  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedStaffForAssignment, setSelectedStaffForAssignment] = useState(null);
  const [tempAssignedTasks, setTempAssignedTasks] = useState([]);
  const [tempCustomTasks, setTempCustomTasks] = useState([]);
  const [newCustomTaskText, setNewCustomTaskText] = useState('');
  const [tempFeedbackText, setTempFeedbackText] = useState('');

  const [uploadFeedback, setUploadFeedback] = useState(null); 
  const [selectedTxns, setSelectedTxns] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const fileInputRef = useRef(null);
  const studentFileInputRef = useRef(null);
  const [studentUploadFeedback, setStudentUploadFeedback] = useState(null);

  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'Junior Teacher', department: 'Academic', experience: '0 Years', certs: '' });
  const [deletingStaff, setDeletingStaff] = useState(null);

  const isPermissionError = (err) => err?.message?.toLowerCase().includes('permission') || err?.code === 'permission-denied';
  const showMsg = (type, msg) => { setUploadFeedback({type, msg}); setTimeout(() => setUploadFeedback(null), 4000); };
  const showStuMsg = (type, msg) => { setStudentUploadFeedback({type, msg}); setTimeout(() => setStudentUploadFeedback(null), 4000); };

  // --- 1. FIREBASE AUTH LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); 
        setUserProfile(MASTER_ROLE_MAP[currentUser.email] || { role: 'Guest', name: 'Loading...' });
      } else {
        setUser(null); 
        setUserProfile(null); 
        hasInitialRoutedRef.current = false; 
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => { 
    e.preventDefault(); 
    setLoginError(''); 
    try { await signInWithEmailAndPassword(auth, loginEmail, loginPassword); } 
    catch (err) { setLoginError('Incorrect email or password.'); } 
  };

  const handleLogout = async () => { 
    await signOut(auth); 
    setLoginEmail(''); 
    setLoginPassword(''); 
    setCloudFetchPeriod(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`); 
    hasInitialRoutedRef.current = false; 
    setActiveTab('dashboard'); 
  };

  // --- 2. DYNAMIC SERVER-SIDE FETCHING EFFECTS ---
  useEffect(() => {
    if (!user) return; 
    setIsCloudSyncing(true); 
    setDbError(null);

    const qTxn = cloudFetchPeriod === 'All' 
      ? collection(db, 'artifacts', appEnv, 'public', 'data', 'transactions') 
      : query(collection(db, 'artifacts', appEnv, 'public', 'data', 'transactions'), where('date', '>=', `${cloudFetchPeriod}-00`), where('date', '<=', `${cloudFetchPeriod}-31`));
    
    const unsubTxns = onSnapshot(qTxn, (snap) => { 
      const fetched = snap.docs.map(d => ({ ...d.data(), firebaseId: d.id })); 
      fetched.sort((a, b) => new Date(b.date) - new Date(a.date)); 
      setTransactions(fetched); 
    }, err => { if (isPermissionError(err)) setDbError("permission-denied"); });
    
    const unsubTasks = onSnapshot(collection(db, 'artifacts', appEnv, 'public', 'data', 'staffTasks'), (snap) => { 
      const fetched = {}; snap.docs.forEach(d => { fetched[d.id] = d.data(); }); setStaffTasks(fetched); 
    }, err => {});
    
    const unsubPayroll = onSnapshot(collection(db, 'artifacts', appEnv, 'public', 'data', 'payrollConfigs'), (snap) => { 
      const fetched = {}; snap.docs.forEach(d => { fetched[d.id] = d.data(); }); setPayrollConfigs(fetched); 
    }, err => {});
    
    const unsubApprovals = onSnapshot(collection(db, 'artifacts', appEnv, 'public', 'data', 'payrollApprovals'), (snap) => { 
      const fetched = {}; snap.docs.forEach(d => { fetched[d.id] = d.data(); }); setPayrollApprovals(fetched); 
    }, err => {});
    
    const unsubStu = onSnapshot(collection(db, 'artifacts', appEnv, 'public', 'data', 'students'), (snap) => { 
      const fetched = snap.docs.map(d => ({ ...d.data(), firebaseId: d.id })); fetched.sort((a, b) => a.name.localeCompare(b.name)); setStudents(fetched); 
    }, err => { if (isPermissionError(err)) setDbError("permission-denied"); });
    
    const unsubEmp = onSnapshot(collection(db, 'artifacts', appEnv, 'public', 'data', 'employees'), (snap) => {
        const fetchedEmp = snap.docs.map(doc => ({ ...doc.data(), firebaseId: doc.id }));
        const mockEmployees = [
          { id: 'EMP001', name: 'Kyaw Zin', email: 'kyawzin@spero.edu', role: 'Senior Teacher', department: 'Academic', experience: '5 Years', certs: 'TESOL, CELTA', firebaseId: 'mock1', createdAt: new Date().toISOString() },
          { id: 'EMP002', name: 'Su Myat', email: 'sumyat@spero.edu', role: 'Admin Officer', department: 'Administration', experience: '2 Years', certs: 'Comm. Skills Training', firebaseId: 'mock2', createdAt: new Date().toISOString() },
          { id: 'EMP003', name: 'Be Lar Har', email: 'manager@spero.edu', role: 'Manager', department: 'Management', experience: '4 Years', certs: 'Business Admin', firebaseId: 'mock3', createdAt: new Date().toISOString() },
          { id: 'EMP000', name: 'Managing Director', email: 'md@spero.edu', role: 'Principal', department: 'Management', experience: '10+ Years', certs: 'MBA', firebaseId: 'mock0', createdAt: new Date().toISOString() }
        ];
        const fetchedEmails = fetchedEmp.map(e => e.email);
        const finalEmployees = [...mockEmployees.filter(m => !fetchedEmails.includes(m.email)), ...fetchedEmp];
        
        setEmployees(finalEmployees); 
        setIsCloudSyncing(false);

        if (user && !hasInitialRoutedRef.current) {
          const dbProfile = finalEmployees.find(emp => emp.email === user.email);
          const activeProfile = MASTER_ROLE_MAP[user.email] || (dbProfile ? { role: dbProfile.role, name: dbProfile.name } : { role: 'Guest', name: 'Unknown' });
          setUserProfile(activeProfile);
          if (activeProfile.role !== 'Guest') {
            const role = activeProfile.role;
            if (!['Principal', 'Manager', 'Admin Officer', 'Recruitment Director', 'Social Media Manager'].includes(role)) {
              setStudentSubTab('roster');
            }
            if (['Principal', 'Manager'].includes(role)) setActiveTab('dashboard');
            else if (['Principal', 'Manager', 'Admin Officer'].includes(role)) setActiveTab('finance');
            else if (['Senior Teacher', 'Junior Teacher', 'Supervisor'].includes(role)) setActiveTab('students');
            else setActiveTab('hr'); 
            hasInitialRoutedRef.current = true;
          }
        }
      }, err => { if (isPermissionError(err)) setDbError("permission-denied"); setIsCloudSyncing(false); }
    );

    return () => { unsubTxns(); unsubTasks(); unsubPayroll(); unsubApprovals(); unsubEmp(); unsubStu(); };
  }, [user, cloudFetchPeriod, appEnv]); 

  useEffect(() => {
    if (!user || activeTab !== 'dashboard') return;
    const unsubChart = onSnapshot(query(collection(db, 'artifacts', appEnv, 'public', 'data', 'transactions'), where('date', '>=', `${dashboardChartYear}-01-01`), where('date', '<=', `${dashboardChartYear}-12-31`)), (snap) => {
      setChartTransactions(snap.docs.map(d => d.data()).filter(t => !t.isDeleted));
    });
    return () => unsubChart();
  }, [user, activeTab, dashboardChartYear, appEnv]);

  // --- 3. HELPER FUNCTIONS & LOGIC ---
  const checkIsPeriodLocked = (txnMonth) => { if (!txnMonth) return false; const d = new Date(); return txnMonth < `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };
  
  const getDynamicFetchPeriods = () => { const dates = []; let d = new Date(); for(let i=0; i<24; i++) { dates.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}`); d.setMonth(d.getMonth() - 1); } dates.push('All'); return dates; };
  const availableFetchPeriods = getDynamicFetchPeriods();
  
  const formatPeriodLabel = (period) => { if (period === 'All') return 'All-Time Database History'; const [y, m] = period.split('-'); return new Date(y, parseInt(m) - 1).toLocaleString('default', { month: 'long', year: 'numeric' }); };

  const handleSelectAll = (e, currentFilteredData) => { if (e.target.checked) { setSelectedTxns(currentFilteredData.filter(t => !(userProfile?.role === 'Admin Officer' && checkIsPeriodLocked(t.month))).map(t => t.firebaseId)); } else { setSelectedTxns([]); } };
  const handleSelectTxn = (id) => { setSelectedTxns(prev => prev.includes(id) ? prev.filter(txId => txId !== id) : [...prev, id]); };

  const confirmBulkDelete = async () => {
    if (selectedTxns.length === 0 || !user) return;
    setIsCloudSyncing(true);
    try {
      const batch = writeBatch(db);
      selectedTxns.forEach(id => { if (id && !id.startsWith('mock')) { batch.update(doc(db, 'artifacts', appEnv, 'public', 'data', 'transactions', id), { isDeleted: true, deletedBy: userProfile.name, deletedAt: new Date().toISOString() }); } });
      await batch.commit();
      showMsg('success', `Successfully moved ${selectedTxns.length} records to Audit Log.`);
      setSelectedTxns([]); setShowBulkDeleteModal(false);
    } catch(err) { showMsg('error', `Error: ${err.message}`); }
    setIsCloudSyncing(false);
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault(); if (!user) return;
    const txnMonth = newTxn.date.substring(0, 7);
    if (userProfile?.role === 'Admin Officer' && editingTxnId && checkIsPeriodLocked(transactions.find(t => t.firebaseId === editingTxnId)?.month)) {
      showMsg('error', 'Period Closed. Adjustments must be logged as new entries.'); setShowFinanceForm(false); return;
    }

    let fStuId = newTxn.studentId; let fDispId = newTxn.studentDisplayId;
    if (newTxn.studentName.trim() !== '' && !fStuId) {
      const ex = students.find(s => s.name.toLowerCase() === newTxn.studentName.trim().toLowerCase());
      if (ex) { fStuId = ex.firebaseId; fDispId = ex.displayId || ex.firebaseId; } else { fStuId = `STU_${newTxn.studentName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}_${Date.now().toString().slice(-5)}`; }
    } else if(newTxn.studentName.trim() === '') { fStuId = null; fDispId = null; }

    const payload = { date: newTxn.date, month: txnMonth, type: newTxn.type, category: newTxn.category, amount: parseFloat(newTxn.amount) || 0, desc: newTxn.desc, studentId: fStuId, studentDisplayId: fDispId, studentName: newTxn.studentName.trim(), batchNumber: newTxn.batchNumber.trim(), inquiredClass: newTxn.inquiredClass.trim(), recordedBy: userProfile.name };
    try {
      if (editingTxnId && !editingTxnId.startsWith('mock')) {
        const oldTxn = transactions.find(t => t.firebaseId === editingTxnId);
        let history = oldTxn.editHistory ? [...oldTxn.editHistory] : [];
        if (oldTxn && oldTxn.amount !== payload.amount) history.push({ editedAt: new Date().toISOString(), editedBy: userProfile.name, oldAmount: oldTxn.amount, newAmount: payload.amount });
        await updateDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'transactions', editingTxnId), { ...payload, editHistory: history });
        showMsg('success', 'Entry updated successfully.');
      } else {
        await addDoc(collection(db, 'artifacts', appEnv, 'public', 'data', 'transactions'), { ...payload, id: `TXN${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, createdAt: new Date().toISOString(), editHistory: [], isDeleted: false });
        showMsg('success', 'New entry added to cloud.');
      }
      setEditingTxnId(null);
      if (payload.studentId) await setDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'students', payload.studentId), { name: payload.studentName, batch: payload.batchNumber || 'Unassigned', inquiredClass: payload.inquiredClass || 'Unassigned', displayId: payload.studentDisplayId, status: 'Enrolled', lastActive: new Date().toISOString() }, { merge: true });
    } catch(err) { showMsg('error', `Error saving: ${err.message}`); }
    setShowFinanceForm(false); setNewTxn({ date: '', type: 'Income', category: 'Student Fees', amount: '', desc: '', studentId: '', studentDisplayId: '', studentName: '', batchNumber: '', inquiredClass: '' });
  };

  const handleEditClick = (txn) => { setNewTxn({ date: txn.date || '', type: txn.type || 'Income', category: txn.category || '', amount: txn.amount || '', desc: txn.desc || '', studentId: txn.studentId || '', studentDisplayId: txn.studentDisplayId || '', studentName: txn.studentName || '', batchNumber: txn.batchNumber || '', inquiredClass: txn.inquiredClass || '' }); setEditingTxnId(txn.firebaseId); setShowFinanceForm(true); setShowSuggestions(false); };
  
  const confirmDelete = async () => { 
    if (!deletingTxn || !user) return; 
    if (userProfile?.role === 'Admin Officer' && checkIsPeriodLocked(deletingTxn.month)) { 
      showMsg('error', 'Period Closed. Cannot delete historical data.'); setDeletingTxn(null); return; 
    } 
    try { 
      if (deletingTxn.firebaseId && !deletingTxn.firebaseId.startsWith('mock')) { 
        await updateDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'transactions', deletingTxn.firebaseId), { isDeleted: true, deletedBy: userProfile.name, deletedAt: new Date().toISOString() }); 
        showMsg('success', 'Record securely moved to Audit Log.');
      } 
    } catch(err) { showMsg('error', `Deletion error: ${err.message}`); } 
    setDeletingTxn(null); 
  };
  
  const handleRestoreTxn = async (id) => { 
    if (!user) return; 
    try { 
      await updateDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'transactions', id), { isDeleted: false, deletedBy: null, deletedAt: null }); 
      showMsg('success', 'Record successfully restored to Active Ledger.'); 
    } catch(err) { showMsg('error', `Restore error: ${err.message}`); } 
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) { showMsg('error', 'Please upload a .csv file.'); return; }
    setIsCloudSyncing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const lines = event.target.result.split('\n').filter(line => line.trim() !== ''); 
      if (lines.length < 2) { showMsg('error', 'File is empty.'); setIsCloudSyncing(false); return; }
      try {
        const batch = writeBatch(db); let validCount = 0; let studentsToUpsert = {};
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(item => item.replace(/(^"|"$)/g, '').trim());
          if (row.length >= 5) {
            const dateStr = row[0]; const txnMonth = dateStr ? dateStr.substring(0, 7) : ''; 
            const studentDisplayId = row[5] || ''; const studentName = row[6] || ''; 
            const batchNumber = row[7] || ''; const inquiredClass = row[8] || '';
            let matchedStuId = null; let finalName = studentName;
            if (studentDisplayId) { 
              const existingStu = students.find(s => s.displayId === studentDisplayId); 
              if (existingStu) { matchedStuId = existingStu.firebaseId; finalName = existingStu.name; } 
            }
            const newDocRef = doc(collection(db, 'artifacts', appEnv, 'public', 'data', 'transactions'));
            batch.set(newDocRef, { id: `TXN${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, date: dateStr, month: txnMonth, type: row[1] || 'Income', category: row[2] || 'Uncategorized', amount: parseFloat(row[3]) || 0, desc: row[4] || 'Bulk Import', studentId: matchedStuId, studentDisplayId: studentDisplayId, studentName: finalName, batchNumber, inquiredClass, recordedBy: `${userProfile.name} (Bulk CSV)`, createdAt: new Date().toISOString(), editHistory: [], isDeleted: false });
            validCount++;
            if (matchedStuId && !studentsToUpsert[matchedStuId]) {
                 batch.set(doc(db, 'artifacts', appEnv, 'public', 'data', 'students', matchedStuId), { name: finalName, batch: batchNumber || 'Unassigned', inquiredClass: inquiredClass || 'Unassigned', status: 'Enrolled', lastActive: new Date().toISOString() }, { merge: true });
                 studentsToUpsert[matchedStuId] = true;
            }
          }
        }
        if (validCount > 0) { await batch.commit(); showMsg('success', `Success! ${validCount} entries added.`); } else { showMsg('error', 'No valid data rows found.'); }
      } catch (err) { showMsg('error', `Error processing file: ${err.message}`); }
      setIsCloudSyncing(false); e.target.value = null;
    };
    reader.readAsText(file);
  };

  const handleToggleDailyTask = async (empId, taskId, targetDate) => {
    if (!user || !empId) return; 
    const todayStr = new Date().toISOString().split('T')[0];
    const canViewAllStaff = ['Principal', 'Manager', 'HR Manager', 'Recruitment Director', 'Supervisor'].includes(userProfile?.role);
    if (!canViewAllStaff && targetDate !== todayStr) return;
    const todayTasks = staffTasks[empId]?.dailyTasks?.[targetDate] || {};
    const updatedTodayTasks = { ...todayTasks, [taskId]: !todayTasks[taskId] };
    setStaffTasks(prev => ({ ...prev, [empId]: { ...prev[empId], dailyTasks: { ...(prev[empId]?.dailyTasks || {}), [targetDate]: updatedTodayTasks } } })); 
    try { await setDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'staffTasks', empId), { dailyTasks: { [targetDate]: updatedTodayTasks } }, { merge: true }); } catch(err) {}
  };

  const openAssignModal = (emp) => {
    const existingAssignments = staffTasks[emp.id]?.assignedSOPs?.[sopDate];
    if (existingAssignments) { setTempAssignedTasks(existingAssignments); } 
    else { setTempAssignedTasks((roleSOPs[emp.role] || []).map(t => t.id)); }
    setTempCustomTasks(staffTasks[emp.id]?.customSOPs?.[sopDate] || []); setNewCustomTaskText(''); setSelectedStaffForAssignment(emp);
  };

  const handleSaveAssignments = async (empId, targetDate, assignedIds, customTasks) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'staffTasks', empId), { assignedSOPs: { [targetDate]: assignedIds }, customSOPs: { [targetDate]: customTasks } }, { merge: true });
      setSelectedStaffForAssignment(null); showMsg('success', 'Workflows successfully assigned.');
    } catch (err) { showMsg('error', `Assignment failed: ${err.message}`); }
  };

  const handleSaveFeedback = async (empId, targetDate) => {
    if (!user) return;
    setStaffTasks(prev => ({ ...prev, [empId]: { ...prev[empId], dailyFeedback: { ...(prev[empId]?.dailyFeedback || {}), [targetDate]: tempFeedbackText } } }));
    try {
      await setDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'staffTasks', empId), { dailyFeedback: { [targetDate]: tempFeedbackText } }, { merge: true });
      showMsg('success', `Feedback saved to ${targetDate}'s record.`); setSelectedStaffSOP(null); 
    } catch (err) { showMsg('error', `Failed to save feedback: ${err.message}`); }
  };

  const handleUpdatePayrollStatus = async (status, totalAmt) => {
    if (!user) return; setIsCloudSyncing(true);
    try {
      await setDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'payrollApprovals', payrollMonth), { status, totalAmount: totalAmt, reviewedBy: userProfile.name, updatedAt: new Date().toISOString() }, { merge: true });
      const txnId = `TXN_PAYROLL_${payrollMonth}`;
      if (status === 'Approved') {
         await setDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'transactions', txnId), { id: txnId, date: new Date().toISOString().split('T')[0], month: payrollMonth, type: 'Expense', category: 'Staff Payroll', amount: totalAmt, desc: `Automated Staff Payroll Distribution for ${payrollMonth}`, recordedBy: `System Auto-Entry (${userProfile.name})`, createdAt: new Date().toISOString(), editHistory: [], isDeleted: false, deletedBy: null, deletedAt: null }, { merge: true });
      } else if (status === 'Redo' || status === 'Disapproved') {
         try { await updateDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'transactions', txnId), { isDeleted: true, deletedBy: 'System Auto-Reversal', deletedAt: new Date().toISOString() }); } catch(e) {}
      }
      showMsg('success', status === 'Redo Requested' ? 'Redo request sent to Management.' : `Payroll marked as ${status}.`);
    } catch(err) { showMsg('error', `Error updating status: ${err.message}`); } setIsCloudSyncing(false);
  };

  const handleUpdatePayrollConfig = async (empId, field, value) => {
    if (!user) return;
    const currentApprovalStatus = payrollApprovals[payrollMonth]?.status || 'Pending Review';
    if (currentApprovalStatus === 'Approved' || currentApprovalStatus === 'Redo Requested') { showMsg('error', 'Security Lock: Cannot alter pay rates while the month is locked.'); return; }
    const numValue = parseFloat(value) || 0;
    setPayrollConfigs(prev => ({ ...prev, [empId]: { ...(prev[empId] || {}), [field]: numValue } }));
    try { await setDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'payrollConfigs', empId), { [field]: numValue }, { merge: true }); } catch(err) {}
  };

  const handleAddStaff = async (e) => {
    e.preventDefault(); if (!user) return;
    try { 
      await addDoc(collection(db, 'artifacts', appEnv, 'public', 'data', 'employees'), { ...newStaff, id: `EMP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, createdAt: new Date().toISOString() }); 
      setShowAddStaffForm(false); setNewStaff({ name: '', email: '', role: 'Junior Teacher', department: 'Academic', experience: '0 Years', certs: '' }); 
      showMsg('success', `Staff successfully added to ${appEnv === 'spero-erp-testing' ? 'Sandbox' : 'Production'} Database.`);
    } catch (err) { showMsg('error', `Error saving to database: ${err.message}`); }
  };

  const confirmDeleteStaff = async () => {
    if (!deletingStaff || !user) return;
    try { 
      if (deletingStaff.firebaseId && !deletingStaff.firebaseId.startsWith('mock')) { await deleteDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'employees', deletingStaff.firebaseId)); } 
      showMsg('success', 'Staff member terminated.');
    } catch(err) { showMsg('error', `Error: ${err.message}`); } 
    setDeletingStaff(null);
  };

  const handleAddLead = async (e) => {
    e.preventDefault(); if (!user) return;
    const studentId = `STU_LEAD_${newLead.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}_${Date.now().toString().slice(-5)}`;
    try { 
      await setDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'students', studentId), { ...newLead, displayId: generateStudentID(), batch: 'Unassigned', createdAt: new Date().toISOString(), lastActive: new Date().toISOString() }); 
      setShowLeadForm(false); setNewLead({ name: '', phone: '', inquiredClass: '', status: 'Lead', lastContactDate: '' }); 
      showStuMsg('success', 'New lead successfully logged.');
    } catch(err) { showStuMsg('error', `Error saving lead: ${err.message}`); }
  };

  const handleUpdateStudentStatus = async (stuId, newStatus) => { if (!user) return; try { await updateDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'students', stuId), { status: newStatus, lastActive: new Date().toISOString() }); } catch(err) {} };
  const handleEditStudentClick = (stu) => { setEditStudentData({ name: stu.name || '', phone: stu.phone || '', inquiredClass: stu.inquiredClass || '', batch: stu.batch || '', status: stu.status || 'Lead' }); setEditingStudentId(stu.firebaseId); };
  
  const handleUpdateStudent = async (e) => { 
    e.preventDefault(); if (!user || !editingStudentId) return; 
    try { 
      await updateDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'students', editingStudentId), { ...editStudentData, lastActive: new Date().toISOString() }); 
      setEditingStudentId(null); showStuMsg('success', 'Student profile updated.');
    } catch(err) { showStuMsg('error', `Update failed: ${err.message}`); } 
  };
  
  const confirmDeleteStudent = async () => { 
    if (!deletingStudent || !user) return; 
    try { 
      await deleteDoc(doc(db, 'artifacts', appEnv, 'public', 'data', 'students', deletingStudent.firebaseId)); 
      showStuMsg('success', 'Student record permanently deleted.');
    } catch(err) { showStuMsg('error', `Delete failed: ${err.message}`); } 
    setDeletingStudent(null);
  };

  const handleStudentFileUpload = (e) => {
    const file = e.target.files[0]; if (!file) return; if (!file.name.endsWith('.csv')) { showStuMsg('error', 'Please upload a .csv file.'); return; }
    setIsCloudSyncing(true); setStudentUploadFeedback(null); const reader = new FileReader();
    reader.onload = async (event) => {
      const lines = event.target.result.split('\n').filter(line => line.trim() !== ''); if (lines.length < 2) { showStuMsg('error', 'File is empty.'); setIsCloudSyncing(false); return; }
      try {
        const batch = writeBatch(db); let validCount = 0;
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(item => item.replace(/(^"|"$)/g, '').trim());
          if (row.length >= 1 && row[0]) {
            let status = row[4] || 'Lead'; if(status !== 'Lead' && status !== 'Prospect' && status !== 'Enrolled') { status = 'Lead'; }
            const studentId = `STU_LEAD_${row[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}_${Date.now().toString().slice(-5)}_${i}`;
            batch.set(doc(db, 'artifacts', appEnv, 'public', 'data', 'students', studentId), { name: row[0], phone: row[1] || '', inquiredClass: row[2] || '', lastContactDate: row[3] || new Date().toISOString().split('T')[0], status, displayId: generateStudentID(), batch: 'Unassigned', createdAt: new Date().toISOString(), lastActive: new Date().toISOString() });
            validCount++;
          }
        }
        if (validCount > 0) { await batch.commit(); showStuMsg('success', `Success! ${validCount} pipeline records added.`); } else { showStuMsg('error', 'No valid data rows found.'); }
      } catch (err) { showStuMsg('error', `Error processing file: ${err.message}`); }
      setIsCloudSyncing(false); e.target.value = null;
    };
    reader.readAsText(file);
  };

  const availableClasses = ['All', ...Array.from(new Set(students.map(s => s.inquiredClass || 'Unassigned'))).filter(c => c !== '')].sort();
  const availableBatches = ['All', ...Array.from(new Set(students.filter(s => s.status === 'Enrolled' || !s.status).map(s => s.batch || 'Unassigned'))).filter(b => b !== '')].sort();

  const currentPeriodStudents = cloudFetchPeriod === 'All' ? students : students.filter(s => (s.lastActive && s.lastActive.startsWith(cloudFetchPeriod)) || (s.createdAt && s.createdAt.startsWith(cloudFetchPeriod)));
  const currentPeriodStaff = cloudFetchPeriod === 'All' ? employees : employees.filter(e => e.createdAt && e.createdAt.startsWith(cloudFetchPeriod));
  const activeTransactions = transactions.filter(t => !t.isDeleted);
  const deletedTransactions = transactions.filter(t => t.isDeleted);
  const allEditEvents = [];
  activeTransactions.forEach(txn => { if (txn.editHistory && txn.editHistory.length > 0) { txn.editHistory.forEach(edit => { allEditEvents.push({ ...txn, ...edit }); }); } });
  allEditEvents.sort((a, b) => new Date(b.editedAt) - new Date(a.editedAt));
  
  const totalIncome = activeTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = activeTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const pipelineStudents = students.filter(s => s.status === 'Lead' || s.status === 'Prospect');
  const filteredEnrolledStudents = students.filter(s => s.status === 'Enrolled' || !s.status).filter(s => (studentBatchFilter === 'All' || (s.batch||'Unassigned') === studentBatchFilter) && (studentClassFilter === 'All' || (s.inquiredClass||'Unassigned') === studentClassFilter));
  const filteredPipelineStudents = pipelineStudents.filter(s => studentClassFilter === 'All' || (s.inquiredClass||'Unassigned') === studentClassFilter);

  const activeStudentCount = currentPeriodStudents.filter(s => s.status === 'Enrolled' || !s.status).length;
  const activeStaffCount = currentPeriodStaff.length;
  const activeLeadCount = currentPeriodStudents.filter(s => s.status === 'Lead').length;
  const activeProspectCount = currentPeriodStudents.filter(s => s.status === 'Prospect').length;

  const monthlyRevenue = Array(12).fill(0);
  chartTransactions.forEach(t => { if (t.type === 'Income' && t.date) { const m = parseInt(t.date.split('-')[1], 10) - 1; if (m >= 0 && m <= 11) monthlyRevenue[m] += t.amount; } });
  const maxChartValue = Math.max(...monthlyRevenue, 1000000); 
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // --- 4. RENDER UI ---
  if (isAuthLoading || (user && !userProfile)) return <div className="h-screen flex flex-col items-center justify-center bg-slate-50"><CloudCog className="h-12 w-12 text-blue-500 animate-spin mb-4" /><p className="font-bold text-slate-500">Connecting to Spero Database...</p></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 p-8 text-center"><GraduationCap className="h-12 w-12 text-blue-400 mx-auto mb-3" /><h1 className="text-2xl font-bold text-white tracking-widest">SPERO</h1><p className="text-blue-200 text-sm mt-1 font-medium">Enterprise Management System</p></div>
          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Staff Secure Login</h2>
            {loginError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 flex items-center gap-2"><AlertTriangle className="h-4 w-4 shrink-0" /> {loginError}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-1">Staff Email</label><input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">Password</label><input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 mt-2 shadow-sm"><Lock className="h-4 w-4" /> Authenticate</button>
            </form>
            <div className="mt-6 pt-5 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Database Environment</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setAppEnv('spero-erp-production')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors border ${appEnv === 'spero-erp-production' ? 'bg-red-50 text-red-700 border-red-200 shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'}`}>🚀 Live Production</button>
                <button type="button" onClick={() => setAppEnv('spero-erp-testing')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors border ${appEnv === 'spero-erp-testing' ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'}`}>🧪 Training Sandbox</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { role, name } = userProfile;
  const canViewDashboard = ['Principal', 'Manager'].includes(role);
  const canViewFinance = ['Principal', 'Admin Officer', 'Manager'].includes(role);
  const canManageStaff = ['Principal', 'Manager', 'HR Manager', 'Recruitment Director'].includes(role); 
  const canDeleteTxn = ['Principal', 'Admin Officer'].includes(role); 
  const canViewStudents = ['Principal', 'Manager', 'Admin Officer', 'Recruitment Director', 'Social Media Manager', 'Senior Teacher', 'Junior Teacher', 'Supervisor'].includes(role);
  const canViewPipeline = ['Principal', 'Manager', 'Admin Officer', 'Recruitment Director', 'Social Media Manager'].includes(role);
  const canViewFranchise = ['Principal', 'Manager'].includes(role);
  const canViewPayroll = ['Principal', 'Manager', 'HR Manager'].includes(role);
  const canApprovePayroll = ['Principal', 'Manager'].includes(role); 
  const canViewAllStaff = ['Principal', 'Manager', 'HR Manager', 'Recruitment Director', 'Supervisor'].includes(role);
  const canAssignWorkflows = ['Principal', 'Manager', 'Supervisor'].includes(role); 
  const visibleStaff = canViewAllStaff ? employees : employees.filter(emp => emp.email === user?.email);
  const visibleRoleDocs = canViewAllStaff ? Object.values(roleDocuments) : (roleDocuments[role] ? [roleDocuments[role]] : []);

  let totalSchoolPayrollExpected = 0;
  const computedPayrollData = employees.map(emp => {
      const config = payrollConfigs[emp.id] || { hourlyRate: 0, totalHours: 0, incentivePercent: 0 };
      const rate = config.hourlyRate || 0; const totalHours = config.totalHours || 0; const incentivePercent = config.incentivePercent || 0;
      const basePay = totalHours * rate; const incentiveAmount = basePay * (incentivePercent / 100); const totalPay = basePay + incentiveAmount;
      if (canViewPayroll) { totalSchoolPayrollExpected += totalPay; }
      return { emp, rate, totalHours, incentivePercent, basePay, incentiveAmount, totalPay };
  });

  const currentPayrollApproval = payrollApprovals[payrollMonth] || { status: 'Pending Review' };
  const isPayrollLocked = currentPayrollApproval.status === 'Approved' || currentPayrollApproval.status === 'Redo Requested';

  return (
    <div className="flex h-screen bg-gray-50 font-sans flex-col">
      {appEnv === 'spero-erp-testing' && (
        <div className="bg-amber-500 text-white text-xs font-bold py-1.5 px-4 text-center tracking-widest flex items-center justify-center gap-2 shadow-sm z-50">
          <AlertTriangle className="h-4 w-4" /> SANDBOX TESTING MODE ACTIVE - Financial & HR Data entered here is completely safe and temporary.
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-blue-400" />
            <div><h1 className="text-xl font-bold tracking-wider text-blue-400">SPERO</h1><p className="text-xs text-slate-400">Management System</p></div>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {canViewDashboard && <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}><LayoutDashboard className="h-5 w-5" /> Dashboard</button>}
            {canViewFinance && <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'finance' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}><CircleDollarSign className="h-5 w-5" /> Finance</button>}
            {canViewStudents && <button onClick={() => setActiveTab('students')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'students' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}><UserCheck className="h-5 w-5" /> Students</button>}
            <button onClick={() => setActiveTab('hr')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'hr' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}><Users className="h-5 w-5" /> HR & Staff</button>
            {canViewFranchise && <button onClick={() => setActiveTab('franchise')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'franchise' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}><Building2 className="h-5 w-5" /> Franchise</button>}
          </nav>
          <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 text-slate-300 hover:text-red-400 rounded-lg text-sm font-bold"><LogOut className="h-4 w-4" /> Secure Logout</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex flex-col relative">
          <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center shrink-0 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-slate-800 capitalize">{activeTab}</h2>
            <div className="flex items-center gap-6">
              {canViewFinance && (
                <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg shadow-sm">
                  <DatabaseZap className="h-4 w-4 text-indigo-500" /><span className="text-xs font-bold text-indigo-800 uppercase tracking-wider hidden md:block">Data Sync:</span>
                  <select value={cloudFetchPeriod} onChange={(e) => setCloudFetchPeriod(e.target.value)} className="bg-transparent text-indigo-900 text-sm font-bold outline-none cursor-pointer">{availableFetchPeriods.map(p => (<option key={p} value={p}>{formatPeriodLabel(p)}</option>))}</select>
                </div>
              )}
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <div className="text-right hidden md:block"><p className="text-sm font-bold text-slate-900">{name}</p><p className="text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded-full mt-0.5">{role}</p></div>
                <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold border-2 border-slate-200 shrink-0">{name.substring(0,2).toUpperCase()}</div>
              </div>
            </div>
          </header>

          {dbError && (
            <div className="bg-orange-50 border-b border-orange-200 p-5 shrink-0">
              <div className="flex items-start gap-4 max-w-6xl mx-auto"><AlertTriangle className="h-6 w-6 text-orange-500 mt-0.5 shrink-0" /><div className="flex-1"><h3 className="text-base font-bold text-orange-800">Database Connection Error</h3><p className="text-sm text-slate-600 mt-1">Please check your Firebase Security Rules or Internet connection.</p></div></div>
            </div>
          )}

          <main className="p-8 flex-1">
            
            {/* ============================== */}
            {/* DASHBOARD TAB */}
            {/* ============================== */}
            {activeTab === 'dashboard' && canViewDashboard && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><p className="text-sm text-gray-500 font-medium mb-1">Total Revenue (MMK)</p><h3 className="text-3xl font-bold text-green-600">{totalIncome.toLocaleString()}</h3></div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><p className="text-sm text-gray-500 font-medium mb-1">Total Expenses (MMK)</p><h3 className="text-3xl font-bold text-red-600">{totalExpense.toLocaleString()}</h3></div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 bg-blue-50/50"><p className="text-sm text-blue-600 font-bold mb-1">Net Profit (MMK)</p><h3 className={`text-3xl font-bold ${netProfit >= 0 ? 'text-blue-700' : 'text-red-600'}`}>{netProfit.toLocaleString()}</h3></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-indigo-500"><p className="text-sm text-gray-500 font-medium mb-1">Enrolled Students</p><h3 className="text-3xl font-bold text-slate-800">{activeStudentCount}</h3></div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-teal-500"><p className="text-sm text-gray-500 font-medium mb-1">Active Staff</p><h3 className="text-3xl font-bold text-slate-800">{activeStaffCount}</h3></div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-orange-400"><p className="text-sm text-gray-500 font-medium mb-1">Pipeline Leads</p><h3 className="text-3xl font-bold text-slate-800">{activeLeadCount}</h3></div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-400"><p className="text-sm text-gray-500 font-medium mb-1">Pipeline Prospects</p><h3 className="text-3xl font-bold text-slate-800">{activeProspectCount}</h3></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div><h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-orange-500" /> Annual Revenue Overview</h3></div>
                    <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg shadow-sm">
                      <DatabaseZap className="h-4 w-4 text-orange-500" /><select value={dashboardChartYear} onChange={e => setDashboardChartYear(e.target.value)} className="bg-transparent text-orange-900 text-sm font-bold outline-none cursor-pointer">{getRecentYears().map(year => <option key={year} value={year}>{year} Financial Year</option>)}</select>
                    </div>
                  </div>
                  <div className="h-72 flex items-end gap-2 md:gap-4 pt-6 border-b border-slate-200 relative">
                    {monthlyRevenue.map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        <div className={`w-full max-w-[40px] rounded-t-sm shadow-sm ${val > 0 ? 'bg-orange-400' : 'bg-slate-100'}`} style={{ height: `${(val / maxChartValue) * 100}%`, minHeight: val > 0 ? '8px' : '0' }}></div>
                        <div className="absolute top-full mt-3 text-xs font-bold text-slate-500 w-full text-center">{monthLabels[i]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================== */}
            {/* FRANCHISE TAB */}
            {/* ============================== */}
            {activeTab === 'franchise' && canViewFranchise && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center max-w-2xl mx-auto mt-10">
                <Building2 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Franchise Module Setup</h2>
                <p className="text-slate-600 mb-6">This operational module is currently locked in Sandbox mode. It will allow you to generate unique Branch IDs, track franchisee royalties, and securely sync regional academic data.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold"><CloudCog className="h-5 w-5" /> Module in Development</div>
              </div>
            )}

            {/* ============================== */}
            {/* STUDENTS TAB */}
            {/* ============================== */}
            {activeTab === 'students' && canViewStudents && (
               <div className="space-y-6">
                 <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 border-b border-gray-200 pb-4">
                   <div className="flex gap-6">
                     {canViewPipeline && <button onClick={() => setStudentSubTab('pipeline')} className={`pb-4 px-2 text-lg font-bold border-b-2 transition-colors ${studentSubTab === 'pipeline' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Admissions Pipeline</button>}
                     <button onClick={() => setStudentSubTab('roster')} className={`pb-4 px-2 text-lg font-bold border-b-2 transition-colors ${studentSubTab === 'roster' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Enrolled Roster</button>
                   </div>
                   {studentSubTab === 'pipeline' && canViewPipeline && (
                     <div className="flex flex-wrap gap-2 md:gap-3 items-center">
                       <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm mr-2"><Filter className="h-4 w-4 text-blue-500" /><select value={studentClassFilter} onChange={(e) => setStudentClassFilter(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-md px-2 py-1 outline-none"><option value="All">All Classes</option>{availableClasses.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                       <button onClick={() => studentFileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 font-medium transition-colors text-sm"><UploadCloud className="h-4 w-4" /> Bulk Upload</button>
                       <button onClick={() => setShowLeadForm(!showLeadForm)} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm shadow-sm"><Plus className="h-4 w-4" /> Add New Lead</button>
                     </div>
                   )}
                 </div>

                 {studentUploadFeedback && <div className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm mb-4 ${studentUploadFeedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>{studentUploadFeedback.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}<p className="text-sm font-bold">{studentUploadFeedback.msg}</p></div>}

                 {studentSubTab === 'pipeline' && canViewPipeline && (
                   <div className="space-y-6">
                     {showLeadForm && (
                       <form onSubmit={handleAddLead} className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 mb-6">
                         <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><UserPlus className="h-5 w-5 text-blue-500" /> Log New Inquiry / Lead</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                           <input type="text" required value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} placeholder="Student Name" className="border p-2 text-sm rounded" />
                           <input type="text" required value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} placeholder="Phone/FB" className="border p-2 text-sm rounded" />
                           <input type="text" required value={newLead.inquiredClass} onChange={e => setNewLead({...newLead, inquiredClass: e.target.value})} placeholder="Class" className="border p-2 text-sm rounded" />
                           <input type="date" required value={newLead.lastContactDate} onChange={e => setNewLead({...newLead, lastContactDate: e.target.value})} className="border p-2 text-sm rounded" />
                           <select value={newLead.status} onChange={e => setNewLead({...newLead, status: e.target.value})} className="border p-2 text-sm rounded bg-white"><option value="Lead">Lead</option><option value="Prospect">Prospect</option></select>
                         </div>
                         <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowLeadForm(false)} className="px-4 py-2 bg-slate-100 rounded text-sm">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Save</button></div>
                       </form>
                     )}
                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                       <table className="w-full text-left border-collapse">
                         <thead><tr className="bg-slate-50 text-slate-600 text-sm border-b border-gray-200"><th className="p-4 font-medium">Student ID</th><th className="p-4 font-medium">Student Name</th><th className="p-4 font-medium">Contact Info</th><th className="p-4 font-medium">Class / Interest</th><th className="p-4 font-medium">Last Contact Date</th><th className="p-4 font-medium">Pipeline Status</th><th className="p-4 font-medium text-center">Actions</th></tr></thead>
                         <tbody>
                           {filteredPipelineStudents.map((stu) => (
                             <tr key={stu.firebaseId} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                               <td className="p-4 text-sm font-mono text-slate-500 font-bold bg-slate-50">{stu.displayId || 'LEGACY'}</td>
                               <td className="p-4 text-sm font-bold text-slate-800">{stu.name}</td>
                               <td className="p-4 text-sm text-slate-600">{stu.phone}</td>
                               <td className="p-4 text-sm text-indigo-600 font-medium">{stu.inquiredClass || 'Unassigned'}</td>
                               <td className="p-4 text-sm text-slate-600">{stu.lastContactDate}</td>
                               <td className="p-4"><select value={stu.status} onChange={(e) => handleUpdateStudentStatus(stu.firebaseId, e.target.value)} className="text-xs font-bold rounded-lg px-3 py-1.5 border border-blue-200"><option value="Lead">Lead</option><option value="Prospect">Prospect</option><option value="Enrolled">Mark as Enrolled</option></select></td>
                               <td className="p-4 text-sm text-center"><button onClick={() => handleEditStudentClick(stu)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="h-4 w-4" /></button><button onClick={() => setDeletingStudent(stu)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button></td>
                             </tr>
                           ))}
                           {filteredPipelineStudents.length === 0 && <tr><td colSpan="7" className="p-8 text-center text-slate-500">No leads currently in pipeline.</td></tr>}
                         </tbody>
                       </table>
                     </div>
                   </div>
                 )}

                 {studentSubTab === 'roster' && (
                   <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                     <table className="w-full text-left border-collapse">
                       <thead><tr className="bg-slate-50 text-slate-600 text-sm border-b border-gray-200"><th className="p-4 font-medium">Student ID</th><th className="p-4 font-medium">Student Name</th><th className="p-4 font-medium">Class Name</th><th className="p-4 font-medium">Batch Number</th>{canViewFinance && <th className="p-4 font-medium text-right">Total Fees Paid</th>}<th className="p-4 font-medium text-center">Status</th><th className="p-4 font-medium text-center">Actions</th></tr></thead>
                       <tbody>
                         {filteredEnrolledStudents.map((stu) => {
                           const totalPaid = canViewFinance ? activeTransactions.filter(t => t.type === 'Income' && (t.studentId === stu.firebaseId || (!t.studentId && t.studentName === stu.name))).reduce((sum, t) => sum + t.amount, 0) : 0;
                           return (
                             <tr key={stu.firebaseId} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                               <td className="p-4 text-sm font-mono text-slate-500 font-bold bg-slate-50">{stu.displayId || 'LEGACY'}</td>
                               <td className="p-4 text-sm font-bold text-slate-800">{stu.name}</td>
                               <td className="p-4 text-sm text-slate-700 font-medium">{stu.inquiredClass || 'Unassigned'}</td>
                               <td className="p-4 text-sm text-indigo-600 font-medium">{stu.batch || 'Unassigned'}</td>
                               {canViewFinance && <td className="p-4 text-sm text-right font-medium text-slate-700">{totalPaid.toLocaleString()}</td>}
                               <td className="p-4 text-center"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Enrolled</span></td>
                               <td className="p-4 text-sm text-center"><button onClick={() => handleEditStudentClick(stu)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="h-4 w-4" /></button><button onClick={() => setDeletingStudent(stu)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button></td>
                             </tr>
                           );
                         })}
                         {filteredEnrolledStudents.length === 0 && <tr><td colSpan={canViewFinance ? 7 : 6} className="p-8 text-center text-slate-500">No active students found matching criteria.</td></tr>}
                       </tbody>
                     </table>
                   </div>
                 )}
             </div>
          )}

          {/* ============================== */}
          {/* FINANCE TAB */}
          {/* ============================== */}
          {activeTab === 'finance' && canViewFinance && (
             <div className="space-y-6">
               <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                 <div className="flex gap-6">
                   <button onClick={() => setFinanceSubTab('ledger')} className={`pb-4 px-2 text-lg font-bold border-b-2 transition-colors ${financeSubTab === 'ledger' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Active Ledger</button>
                   {['Principal', 'Manager'].includes(role) && (
                     <button onClick={() => setFinanceSubTab('audit')} className={`pb-4 px-2 text-lg font-bold border-b-2 transition-colors ${financeSubTab === 'audit' ? 'border-red-600 text-red-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Security Audit Log</button>
                   )}
                 </div>
               </div>

               {financeSubTab === 'ledger' && (
                 <div className="space-y-6">
                   <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4">
                     <h3 className="text-xl font-bold text-slate-800">Financial Statements</h3>
                     <div className="flex flex-wrap gap-2 md:gap-3">
                       {selectedTxns.length > 0 && canDeleteTxn && <button onClick={() => setShowBulkDeleteModal(true)} className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 font-medium transition-colors text-sm shadow-sm animate-pulse"><Trash2 className="h-4 w-4" /> Move to Audit Log ({selectedTxns.length})</button>}
                       <button onClick={() => exportCSV(activeTransactions, ['date', 'type', 'category', 'amount', 'desc', 'studentDisplayId', 'studentName', 'batchNumber', 'inquiredClass'], `Spero_Financials_${cloudFetchPeriod}.csv`)} className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors text-sm"><FileSpreadsheet className="h-4 w-4" /> Export Ledger</button>
                       <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                       <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 font-medium transition-colors text-sm"><UploadCloud className="h-4 w-4" /> Bulk CSV Upload</button>
                       <button onClick={() => { setEditingTxnId(null); setNewTxn({ date: '', type: 'Income', category: 'Student Fees', amount: '', desc: '', studentId: '', studentDisplayId: generateStudentID(), studentName: '', batchNumber: '', inquiredClass: '' }); setShowFinanceForm(!showFinanceForm); setShowSuggestions(false); }} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm shadow-sm"><Plus className="h-4 w-4" /> Add Entry</button>
                     </div>
                   </div>

                   {uploadFeedback && <div className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm ${uploadFeedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>{uploadFeedback.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}<p className="text-sm font-bold">{uploadFeedback.msg}</p></div>}

                   {showFinanceForm && (
                     <form onSubmit={handleAddTransaction} className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 mb-6 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                       <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><CloudCog className="h-5 w-5 text-blue-500" />{editingTxnId ? "Update Entry in Cloud" : "Save New Entry to Cloud"}</h4>
                       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                         <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" required value={newTxn.date} onChange={e => setNewTxn({...newTxn, date: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                         <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={newTxn.type} onChange={e => setNewTxn({...newTxn, type: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"><option>Income</option><option>Expense</option></select></div>
                         <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input type="text" required value={newTxn.category} onChange={e => setNewTxn({...newTxn, category: e.target.value})} placeholder="e.g. Student Fees" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                         <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount (MMK)</label><input type="number" required value={newTxn.amount} onChange={e => setNewTxn({...newTxn, amount: e.target.value})} placeholder="0" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                         <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><input type="text" required value={newTxn.desc} onChange={e => setNewTxn({...newTxn, desc: e.target.value})} placeholder="Details" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                         <div className="flex justify-between items-center mb-3"><p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><IdCard className="h-4 w-4"/> Student Academic Details</p></div>
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                           <div><label className="block text-sm font-medium text-gray-700 mb-1">Student ID (Auto)</label><input type="text" readOnly value={newTxn.studentDisplayId || ''} className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-slate-100 text-slate-500 font-mono" placeholder="Auto-generated" /></div>
                           <div className="relative">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                             <input type="text" value={newTxn.studentName} onChange={e => { const typedName = e.target.value; let nextDisplayId = newTxn.studentDisplayId; if (newTxn.studentId) { nextDisplayId = generateStudentID(); } setNewTxn({ ...newTxn, studentName: typedName, studentId: '', studentDisplayId: nextDisplayId }); if (typedName.trim().length > 0) { const matches = pipelineStudents.filter(s => s.name.toLowerCase().includes(typedName.toLowerCase())); setStudentSuggestions(matches); setShowSuggestions(true); } else { setStudentSuggestions([]); setShowSuggestions(false); } }} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} placeholder="e.g. Aung Aung" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                             {showSuggestions && studentSuggestions.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-xl max-h-48 overflow-y-auto">
                                  {studentSuggestions.map(stu => (
                                    <li key={stu.firebaseId} onMouseDown={() => { setNewTxn({ ...newTxn, studentName: stu.name, studentId: stu.firebaseId, studentDisplayId: stu.displayId || 'LEGACY', inquiredClass: stu.inquiredClass || '', batchNumber: stu.batch || '' }); setShowSuggestions(false); }} className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors">
                                      <div className="text-sm font-bold text-slate-800">{stu.name}</div><div className="text-xs text-indigo-600 font-medium mt-0.5">{stu.displayId || 'LEGACY'} • {stu.inquiredClass || 'No Class'}</div>
                                    </li>
                                  ))}
                                </ul>
                             )}
                           </div>
                           <div><label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label><input type="text" value={newTxn.inquiredClass} onChange={e => setNewTxn({...newTxn, inquiredClass: e.target.value})} placeholder="e.g. B1 Adult" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                           <div><label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label><input type="text" value={newTxn.batchNumber} onChange={e => setNewTxn({...newTxn, batchNumber: e.target.value})} placeholder="e.g. Batch 14" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                         </div>
                       </div>
                       <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowFinanceForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-bold transition-colors">Cancel</button><button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-colors">{editingTxnId ? "Update Data" : "Save Data"}</button></div>
                     </form>
                   )}

                   <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                     <table className="w-full text-left border-collapse">
                       <thead>
                         <tr className="bg-slate-50 text-slate-600 text-sm border-b border-gray-200">
                           {canDeleteTxn && <th className="p-4 w-12 text-center"><input type="checkbox" className="rounded border-gray-300 text-blue-600" checked={activeTransactions.length > 0 && selectedTxns.length === activeTransactions.length} onChange={(e) => handleSelectAll(e, activeTransactions)} /></th>}
                           <th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Description</th><th className="p-4 font-medium">Student / Batch</th><th className="p-4 font-medium">Type</th><th className="p-4 font-medium text-right">Amount (MMK)</th><th className="p-4 font-medium text-center">Actions</th>
                         </tr>
                       </thead>
                       <tbody>
                         {activeTransactions.map((txn) => {
                           const isAdminLocked = checkIsPeriodLocked(txn.month) && role === 'Admin Officer';
                           return (
                             <tr key={txn.firebaseId} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                               {canDeleteTxn && <td className="p-4 text-center">{isAdminLocked ? <Lock className="h-3 w-3 text-slate-300 mx-auto" /> : <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer h-4 w-4" checked={selectedTxns.includes(txn.firebaseId)} onChange={() => handleSelectTxn(txn.firebaseId)} />}</td>}
                               <td className="p-4 text-sm">{txn.date}</td>
                               <td className="p-4 text-sm font-medium text-slate-800">{txn.desc}</td>
                               <td className="p-4">{txn.studentName ? <><p className="text-sm font-bold text-slate-700">{txn.studentName}</p><p className="text-xs text-indigo-500">{txn.inquiredClass} • {txn.batchNumber}</p></> : <span className="text-xs text-slate-400 italic">N/A</span>}</td>
                               <td className="p-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${txn.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{txn.type}</span></td>
                               <td className={`p-4 text-sm text-right font-bold ${txn.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>{txn.type === 'Income' ? '+' : '-'}{txn.amount.toLocaleString()}</td>
                               <td className="p-4 text-sm text-center">
                                 {isAdminLocked ? <Lock className="h-4 w-4 text-slate-400 mx-auto cursor-not-allowed" title="Period locked" /> : <div className="flex items-center justify-center gap-2"><button onClick={() => handleEditClick(txn)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="h-4 w-4" /></button>{canDeleteTxn && <button onClick={() => setDeletingTxn(txn)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>}</div>}
                               </td>
                             </tr>
                           );
                         })}
                         {activeTransactions.length === 0 && <tr><td colSpan={canDeleteTxn ? 7 : 6} className="p-8 text-center text-slate-500">No active transactions found for this period.</td></tr>}
                       </tbody>
                     </table>
                   </div>
                 </div>
               )}

               {/* ============================== */}
               {/* RESTORED: FINANCE AUDIT LOG */}
               {/* ============================== */}
               {financeSubTab === 'audit' && ['Principal', 'Manager'].includes(role) && (
                 <div className="space-y-8">
                   <div>
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                       <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-4 flex-1">
                         <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                         <div>
                           <h4 className="font-bold text-red-900">Soft-Deleted Financial Records</h4>
                           <p className="text-sm text-red-700 mt-1">This log shows financial records that were removed from the Active Ledger. They are permanently stored here.</p>
                         </div>
                       </div>
                       <button onClick={() => exportCSV(deletedTransactions, ['date', 'desc', 'type', 'amount', 'deletedBy', 'deletedAt'], `Spero_Deleted_Records_${cloudFetchPeriod}.csv`)} className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold transition-colors shadow-sm shrink-0"><Download className="h-5 w-5 text-slate-500" /> Download Log</button>
                     </div>
                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                       <table className="w-full text-left border-collapse">
                         <thead>
                           <tr className="bg-slate-50 text-slate-600 text-sm border-b border-gray-200">
                             <th className="p-4 font-medium">Original Date</th><th className="p-4 font-medium">Record Description</th><th className="p-4 font-medium">Deleted By</th><th className="p-4 font-medium text-right">Amount (MMK)</th><th className="p-4 font-medium text-center">Action</th>
                           </tr>
                         </thead>
                         <tbody>
                           {deletedTransactions.map((txn) => (
                             <tr key={txn.firebaseId} className="border-b border-gray-100 bg-slate-50 opacity-80">
                               <td className="p-4 text-sm line-through text-slate-500">{txn.date}</td>
                               <td className="p-4 text-sm font-medium text-slate-600 line-through">{txn.desc}</td>
                               <td className="p-4">
                                 <p className="text-sm font-bold text-red-600">{txn.deletedBy || 'Unknown'}</p>
                                 <p className="text-xs text-slate-500">{new Date(txn.deletedAt).toLocaleString()}</p>
                               </td>
                               <td className={`p-4 text-sm text-right font-bold line-through ${txn.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>{txn.type === 'Income' ? '+' : '-'}{txn.amount.toLocaleString()}</td>
                               <td className="p-4 text-sm text-center">
                                 <button onClick={() => handleRestoreTxn(txn.firebaseId)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-colors shadow-sm"><RotateCcw className="h-3 w-3" /> Restore</button>
                               </td>
                             </tr>
                           ))}
                           {deletedTransactions.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-medium">Security log is clean. No records have been deleted in this period.</td></tr>}
                         </tbody>
                       </table>
                     </div>
                   </div>

                   <div>
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                       <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-4 flex-1">
                         <History className="h-6 w-6 text-orange-600 shrink-0 mt-0.5" />
                         <div>
                           <h4 className="font-bold text-orange-900">Numerical Edit History</h4>
                           <p className="text-sm text-orange-700 mt-1">This log securely tracks any time a staff member alters the financial amount of an active record.</p>
                         </div>
                       </div>
                       <button onClick={() => exportCSV(allEditEvents, ['date', 'desc', 'editedBy', 'editedAt', 'oldAmount', 'newAmount'], `Spero_Edited_Records_${cloudFetchPeriod}.csv`)} className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold transition-colors shadow-sm shrink-0"><Download className="h-5 w-5 text-slate-500" /> Download Log</button>
                     </div>
                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                       <table className="w-full text-left border-collapse">
                         <thead>
                           <tr className="bg-slate-50 text-slate-600 text-sm border-b border-gray-200">
                             <th className="p-4 font-medium">Record Info</th><th className="p-4 font-medium">Edited By & When</th><th className="p-4 font-medium text-right">Original Amount</th><th className="p-4 font-medium text-right">New Altered Amount</th>
                           </tr>
                         </thead>
                         <tbody>
                           {allEditEvents.map((editEvent, index) => (
                             <tr key={index} className="border-b border-gray-100 hover:bg-slate-50">
                               <td className="p-4"><p className="text-sm font-bold text-slate-800">{editEvent.desc}</p><p className="text-xs text-slate-500">Txn Date: {editEvent.date}</p></td>
                               <td className="p-4"><p className="text-sm font-bold text-orange-600">{editEvent.editedBy}</p><p className="text-xs text-slate-500">{new Date(editEvent.editedAt).toLocaleString()}</p></td>
                               <td className="p-4 text-sm text-right text-slate-500 line-through">{editEvent.oldAmount.toLocaleString()} MMK</td>
                               <td className="p-4 text-sm text-right font-bold text-slate-800">{editEvent.newAmount.toLocaleString()} MMK</td>
                             </tr>
                           ))}
                           {allEditEvents.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-500 font-medium">No financial amounts have been altered.</td></tr>}
                         </tbody>
                       </table>
                     </div>
                   </div>
                 </div>
               )}
             </div>
          )}

          {/* ============================== */}
          {/* HR & STAFF TAB */}
          {/* ============================== */}
          {activeTab === 'hr' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                  <button onClick={() => setHrSubTab('daily-sops')} className={`pb-2 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${hrSubTab === 'daily-sops' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Daily SOP Tracking</button>
                  {canViewAllStaff && <button onClick={() => setHrSubTab('kpi-analytics')} className={`pb-2 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${hrSubTab === 'kpi-analytics' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>KPI & Analytics</button>}
                  {canViewPayroll && <button onClick={() => setHrSubTab('payroll')} className={`pb-2 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${hrSubTab === 'payroll' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}><Calculator className="h-4 w-4" /> Payroll</button>}
                  <button onClick={() => setHrSubTab('registry')} className={`pb-2 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${hrSubTab === 'registry' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Staff Registry</button>
                  <button onClick={() => setHrSubTab('library')} className={`pb-2 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${hrSubTab === 'library' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Job Specs</button>
                  <button onClick={() => setHrSubTab('discipline')} className={`pb-2 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${hrSubTab === 'discipline' ? 'border-rose-600 text-rose-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Code of Conduct</button>
                </div>
                {/* RESTORED: ADD STAFF BUTTON */}
                {hrSubTab === 'registry' && canManageStaff && (
                  <button onClick={() => setShowAddStaffForm(!showAddStaffForm)} className="ml-auto flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-bold transition-colors shadow-sm shrink-0">
                    <UserPlus className="h-4 w-4" /> Add Staff
                  </button>
                )}
              </div>

              {uploadFeedback && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm ${uploadFeedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  {uploadFeedback.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}<p className="text-sm font-bold">{uploadFeedback.msg}</p>
                </div>
              )}

              {/* RESTORED: DISCIPLINE */}
              {hrSubTab === 'discipline' && (
                <div className="space-y-6">
                   <div className="bg-slate-900 p-8 rounded-2xl shadow-lg text-white flex items-center gap-6">
                     <ShieldAlert className="h-12 w-12 text-rose-400 shrink-0" />
                     <div><h2 className="text-2xl font-bold tracking-wider">Spero Code of Conduct & Disciplines</h2><p className="text-slate-300 mt-1">Official operational rules and professional expectations for all staff members.</p></div>
                   </div>
                   <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                     {speroDisciplines.map((group, idx) => (
                       <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                         <div className="bg-slate-50 border-b border-gray-200 p-5 flex items-center gap-3">
                           <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">{group.icon}</div><h3 className="font-bold text-slate-800 text-lg">{group.category}</h3>
                         </div>
                         <div className="p-6 flex-1 bg-white">
                           <ul className="space-y-4">
                             {group.rules.map((rule, i) => (
                               <li key={i} className="flex items-start gap-3 text-sm text-slate-700"><span className="flex-shrink-0 h-5 w-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold border border-slate-200 mt-0.5">{i + 1}</span><span className="leading-relaxed font-medium">{rule}</span></li>
                             ))}
                           </ul>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {/* RESTORED: PAYROLL */}
              {hrSubTab === 'payroll' && canViewPayroll && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-emerald-50 p-5 rounded-xl border border-emerald-200 shadow-sm">
                     <div className="flex items-center gap-4">
                       <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0"><Wallet className="h-6 w-6 text-emerald-600" /></div>
                       <div><h3 className="text-xl font-bold text-emerald-900">Spero Payroll Engine</h3><p className="text-sm text-emerald-700 font-medium mt-0.5">Calculations based on total monthly hours, hourly rate, and performance incentive.</p></div>
                     </div>
                     <div className="flex items-center gap-3">
                       <input type="month" value={payrollMonth} onChange={e => setPayrollMonth(e.target.value)} className="bg-white border border-emerald-200 rounded-lg px-3 py-2 text-sm font-bold text-emerald-900 outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex-1">
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Expected HR Expense</p>
                       <h3 className="text-4xl font-black text-emerald-600">{totalSchoolPayrollExpected.toLocaleString()} MMK</h3>
                       <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Executive Sign-off Status</p>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border shadow-sm ${currentPayrollApproval.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-300' : currentPayrollApproval.status === 'Disapproved' ? 'bg-red-100 text-red-800 border-red-300' : currentPayrollApproval.status === 'Redo' ? 'bg-orange-100 text-orange-800 border-orange-300' : currentPayrollApproval.status === 'Redo Requested' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-200 text-slate-700 border-slate-300'}`}>{currentPayrollApproval.status}</span>
                              {currentPayrollApproval.reviewedBy && <span className="text-xs font-medium text-slate-500">by {currentPayrollApproval.reviewedBy} on {new Date(currentPayrollApproval.updatedAt).toLocaleDateString()}</span>}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {role === 'HR Manager' && currentPayrollApproval.status === 'Approved' && <button onClick={() => handleUpdatePayrollStatus('Redo Requested', totalSchoolPayrollExpected)} className="px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white border border-amber-200 rounded-lg text-sm font-bold transition-colors shadow-sm">Request Redo</button>}
                            {canApprovePayroll && currentPayrollApproval.status === 'Redo Requested' && (
                              <><button onClick={() => handleUpdatePayrollStatus('Redo', totalSchoolPayrollExpected)} className="px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-600 hover:text-white border border-orange-200 rounded-lg text-sm font-bold transition-colors shadow-sm">Grant Redo (Unlock)</button><button onClick={() => handleUpdatePayrollStatus('Approved', totalSchoolPayrollExpected)} className="px-4 py-2 bg-slate-50 text-slate-700 hover:bg-slate-600 hover:text-white border border-slate-200 rounded-lg text-sm font-bold transition-colors shadow-sm">Deny Request</button></>
                            )}
                            {canApprovePayroll && currentPayrollApproval.status !== 'Redo Requested' && (
                              <><button onClick={() => handleUpdatePayrollStatus('Approved', totalSchoolPayrollExpected)} className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 rounded-lg text-sm font-bold transition-colors shadow-sm">Approve</button><button onClick={() => handleUpdatePayrollStatus('Redo', totalSchoolPayrollExpected)} className="px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-600 hover:text-white border border-orange-200 rounded-lg text-sm font-bold transition-colors shadow-sm">{currentPayrollApproval.status === 'Approved' ? 'Unlock for Redo' : 'Mark as Redo'}</button><button onClick={() => handleUpdatePayrollStatus('Disapproved', totalSchoolPayrollExpected)} className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg text-sm font-bold transition-colors shadow-sm">Disapprove</button></>
                            )}
                          </div>
                       </div>
                     </div>
                     <div className="shrink-0 flex flex-col items-end gap-3 w-full md:w-auto">
                       <button onClick={() => exportCSV(computedPayrollData, [{ label: 'Staff Name', key: 'name' }, { label: 'Role', key: 'role' }, { label: 'Total Hours', key: 'totalHours' }, { label: 'Hourly Rate (MMK)', key: 'hourlyRate' }, { label: 'Base Pay (MMK)', key: 'basePay' }, { label: 'Incentive (%)', key: 'incentivePercent' }, { label: 'Calculated Gross Pay (MMK)', key: 'totalPay' }], `Spero_Payroll_Report_${payrollMonth}.csv`)} className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-bold transition-colors shadow-sm w-full justify-center"><FileSpreadsheet className="h-5 w-5" /> Export Payroll Sheet</button>
                     </div>
                  </div>
                  {isPayrollLocked && (
                     <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3 shadow-sm"><Lock className="h-5 w-5 text-slate-400 shrink-0" /><p className="text-sm text-slate-600 font-medium">{currentPayrollApproval.status === 'Redo Requested' ? "This payroll month is locked while Management reviews your Redo Request." : "This payroll month has been Approved and securely locked. Manual modifications are disabled."}</p></div>
                  )}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
                     <table className="w-full text-left border-collapse min-w-[800px]">
                       <thead>
                         <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-gray-200">
                           <th className="p-4 font-bold w-1/4">Staff Member</th><th className="p-4 font-bold text-center w-32">Total Hours</th><th className="p-4 font-bold text-center w-40">Hourly Rate</th><th className="p-4 font-bold text-center w-32">Incentive<br/>Bonus (%)</th><th className="p-4 font-bold text-right text-emerald-700">Gross Monthly Pay<br/><span className="text-[10px] font-normal text-emerald-500 capitalize">(Total MMK)</span></th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                         {computedPayrollData.map((data) => (
                           <tr key={data.emp.id} className="hover:bg-slate-50 transition-colors">
                             <td className="p-4"><p className="text-sm font-bold text-slate-800">{data.emp.name}</p><p className="text-xs text-slate-500 mt-0.5 font-medium">{data.emp.role}</p></td>
                             <td className="p-4"><input type="number" min="0" step="0.5" value={data.totalHours || ''} onChange={(e) => handleUpdatePayrollConfig(data.emp.id, 'totalHours', e.target.value)} disabled={isPayrollLocked} className={`w-full text-center border rounded-lg p-2 text-sm font-bold outline-none transition-colors ${isPayrollLocked ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 'border-gray-300 text-slate-700 focus:ring-2 focus:ring-emerald-500'}`} placeholder="0" /></td>
                             <td className="p-4"><div className="relative"><span className={`absolute left-3 top-2 text-sm font-bold ${isPayrollLocked ? 'text-slate-300' : 'text-slate-400'}`}>K</span><input type="number" min="0" step="100" value={data.rate || ''} onChange={(e) => handleUpdatePayrollConfig(data.emp.id, 'hourlyRate', e.target.value)} disabled={isPayrollLocked} className={`w-full pl-8 pr-2 border rounded-lg p-2 text-sm font-bold outline-none transition-colors ${isPayrollLocked ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 'border-gray-300 text-slate-700 focus:ring-2 focus:ring-emerald-500'}`} placeholder="0" /></div></td>
                             <td className="p-4"><div className="relative"><input type="number" min="0" max="100" step="1" value={data.incentivePercent || ''} onChange={(e) => handleUpdatePayrollConfig(data.emp.id, 'incentivePercent', e.target.value)} disabled={isPayrollLocked} className={`w-full text-center pr-6 border rounded-lg p-2 text-sm font-bold outline-none transition-colors ${isPayrollLocked ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 'border-gray-300 text-emerald-700 bg-emerald-50/30 focus:ring-2 focus:ring-emerald-500'}`} placeholder="0" /><span className={`absolute right-3 top-2 text-sm font-bold ${isPayrollLocked ? 'text-slate-300' : 'text-emerald-600'}`}>%</span></div></td>
                             <td className="p-4 text-right"><div className="flex flex-col items-end"><span className="text-lg font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm inline-block min-w-[130px] text-right">{data.totalPay.toLocaleString()}</span>{data.incentiveAmount > 0 && <span className="text-[10px] text-emerald-600 font-bold mt-1.5 uppercase tracking-wider bg-emerald-100/50 px-2 py-0.5 rounded">+{data.incentiveAmount.toLocaleString()} Bonus</span>}</div></td>
                           </tr>
                         ))}
                         {computedPayrollData.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-500">No staff available for payroll calculations.</td></tr>}
                       </tbody>
                     </table>
                  </div>
                </div>
              )}

              {/* RESTORED: KPI ANALYTICS */}
              {hrSubTab === 'kpi-analytics' && canViewAllStaff && (
                 <div className="space-y-6">
                   <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div><h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Target className="h-5 w-5 text-rose-500" /> Executive KPI Overview</h3><p className="text-sm text-slate-500 mt-1">Aggregated task completion scores based on active working days.</p></div>
                     <div className="flex items-center gap-3">
                       <select value={kpiViewMode} onChange={e => setKpiViewMode(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-lg px-3 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-rose-500"><option value="monthly">Monthly Overview</option><option value="yearly">Yearly Overview</option></select>
                       {kpiViewMode === 'monthly' ? (
                         <input type="month" value={kpiMonth} onChange={e => setKpiMonth(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-rose-500" />
                       ) : (
                         <select value={kpiYear} onChange={e => setKpiYear(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-rose-500">{getRecentYears().map(year => <option key={year} value={year}>{year}</option>)}</select>
                       )}
                     </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                     {employees.map(emp => {
                        const sops = roleSOPs[emp.role] || [];
                        const allDailyTasks = staffTasks[emp.id]?.dailyTasks || {};
                        const allAssignedTasks = staffTasks[emp.id]?.assignedSOPs || {}; 
                        const allCustomTasks = staffTasks[emp.id]?.customSOPs || {}; 
                        
                        const periodPrefix = kpiViewMode === 'monthly' ? kpiMonth : kpiYear;
                        const periodDatesLogged = Object.keys(allDailyTasks).filter(d => d.startsWith(periodPrefix));
                        const activeDaysCount = periodDatesLogged.length;
                        if (sops.length === 0 && Object.keys(allCustomTasks).length === 0) return null; 
                        
                        let completedInPeriod = 0; let expectedInPeriod = 0;
                        periodDatesLogged.forEach(date => {
                            const assignedTaskIds = allAssignedTasks[date];
                            const activeSops = assignedTaskIds ? sops.filter(t => assignedTaskIds.includes(t.id)) : sops;
                            const customSops = allCustomTasks[date] || [];
                            expectedInPeriod += (activeSops.length + customSops.length);
                            activeSops.forEach(s => { if (allDailyTasks[date][s.id]) completedInPeriod++; });
                            customSops.forEach(s => { if (allDailyTasks[date][s.id]) completedInPeriod++; });
                        });
                        
                        const kpiPercentage = expectedInPeriod === 0 ? 0 : Math.round((completedInPeriod / expectedInPeriod) * 100);
                        let barColor = 'bg-rose-500'; if (kpiPercentage >= 90) barColor = 'bg-green-500'; else if (kpiPercentage >= 70) barColor = 'bg-amber-400';

                        return (
                          <div key={emp.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-6">
                              <div><h4 className="font-bold text-slate-800 text-lg">{emp.name}</h4><p className="text-xs font-medium text-slate-500 mt-0.5">{emp.role}</p></div>
                              <div className="text-right"><span className={`text-3xl font-black ${kpiPercentage >= 90 ? 'text-green-600' : kpiPercentage >= 70 ? 'text-amber-500' : 'text-rose-600'}`}>{kpiPercentage}%</span><p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">KPI Score</p></div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-xs font-bold mb-2"><span className="text-slate-600">Total Completion Rate</span><span className="text-slate-800">{completedInPeriod} / {expectedInPeriod} Tasks</span></div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50"><div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${kpiPercentage}%` }}></div></div>
                              </div>
                              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <span className="text-xs font-medium text-slate-600">Active Working Days Logged:</span><span className="text-sm font-bold text-slate-800">{activeDaysCount} Days</span>
                              </div>
                            </div>
                          </div>
                        );
                     })}
                   </div>
                 </div>
              )}

              {/* RESTORED: REGISTRY */}
              {hrSubTab === 'registry' && (
                <div className="space-y-6">
                  {showAddStaffForm && canManageStaff && (
                    <form onSubmit={handleAddStaff} className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                      <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2"><CloudCog className="h-5 w-5 text-indigo-500" /> Save New Employee to Cloud</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" required value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} placeholder="e.g. Aung Aung" className="w-full border border-gray-300 rounded-lg p-2 text-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Mail className="h-3 w-3"/> System Login Email</label><input type="email" required value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} placeholder="email@spero.edu" className="w-full border border-gray-300 rounded-lg p-2 text-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label><select value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 text-sm cursor-pointer"><option>Junior Teacher</option><option>Senior Teacher</option><option>Supervisor</option><option>Admin Officer</option><option>Manager</option><option>HR Manager</option><option>Recruitment Director</option><option>Content Editor</option><option>Social Media Manager</option></select></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><input type="text" required value={newStaff.department} onChange={e => setNewStaff({...newStaff, department: e.target.value})} placeholder="e.g. Academic" className="w-full border border-gray-300 rounded-lg p-2 text-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience</label><input type="text" required value={newStaff.experience} onChange={e => setNewStaff({...newStaff, experience: e.target.value})} placeholder="e.g. 1 Year" className="w-full border border-gray-300 rounded-lg p-2 text-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label><input type="text" value={newStaff.certs} onChange={e => setNewStaff({...newStaff, certs: e.target.value})} placeholder="e.g. TEFL (In Progress)" className="w-full border border-gray-300 rounded-lg p-2 text-sm" /></div>
                      </div>
                      <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowAddStaffForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancel</button><button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Add Staff to Database</button></div>
                    </form>
                  )}

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 text-sm border-b border-gray-200">
                          <th className="p-4 font-medium">Emp ID</th><th className="p-4 font-medium">Name & Email</th><th className="p-4 font-medium">Role</th><th className="p-4 font-medium">Experience</th><th className="p-4 font-medium text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleStaff.map((emp) => (
                          <tr key={emp.firebaseId} className="border-b border-gray-100 hover:bg-slate-50">
                            <td className="p-4 text-sm text-gray-500 font-mono">{emp.id}</td>
                            <td className="p-4"><p className="text-sm font-bold text-slate-800">{emp.name}</p><p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Mail className="h-3 w-3"/> {emp.email}</p></td>
                            <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${emp.role.includes('Teacher') ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>{emp.role}</span></td>
                            <td className="p-4 text-sm text-gray-600">{emp.experience}</td>
                            <td className="p-4 text-center">{canManageStaff ? <button onClick={() => setDeletingStaff(emp)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors" title="Remove Staff"><Trash2 className="h-4 w-4" /></button> : <span className="text-xs text-slate-400 italic">No actions available</span>}</td>
                          </tr>
                        ))}
                        {visibleStaff.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-500">No staff members found in the cloud database.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* RESTORED: LIBRARY */}
              {hrSubTab === 'library' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleRoleDocs.map((doc, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">{doc.icon}</div>
                        <div><h3 className="text-xl font-bold text-slate-800">{doc.title}</h3><p className="text-sm text-slate-500">Job Specification</p></div>
                      </div>
                      <button onClick={() => setSelectedRoleDoc(doc)} className="w-full flex items-center justify-center gap-2 py-3 mt-auto bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                        <BookOpen className="h-4 w-4" /> Read Document
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* RESTORED: DAILY SOPS */}
              {hrSubTab === 'daily-sops' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                     <div><h3 className="text-lg font-bold text-slate-800">Daily Compliance Tracker</h3><p className="text-sm text-slate-500">Monitor workflow completion across the school.</p></div>
                     <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-2 rounded-lg">
                       <CalendarDays className="h-5 w-5 text-indigo-600 ml-1" />
                       <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider hidden sm:block">Date:</span>
                       <div className="relative flex flex-col">
                         <input type="date" value={sopDate} onChange={e => setSopDate(e.target.value)} disabled={!canViewAllStaff} className={`border border-indigo-200 rounded-md px-3 py-1.5 text-sm font-bold text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-500 ${!canViewAllStaff ? 'bg-slate-100 opacity-80 cursor-not-allowed' : 'bg-white cursor-pointer'}`} />
                         {!canViewAllStaff && <span className="absolute -bottom-5 right-0 text-[10px] text-indigo-500 font-bold whitespace-nowrap">Locked to Today</span>}
                       </div>
                     </div>
                  </div>

                  {canViewAllStaff ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                       {employees.map(emp => {
                          const baseSops = roleSOPs[emp.role] || [];
                          const customSops = staffTasks[emp.id]?.customSOPs?.[sopDate] || [];
                          if (baseSops.length === 0 && customSops.length === 0) return null; 
                          
                          const assignedIds = staffTasks[emp.id]?.assignedSOPs?.[sopDate];
                          const activeSops = assignedIds ? baseSops.filter(t => assignedIds.includes(t.id)) : baseSops;
                          const dayTasks = staffTasks[emp.id]?.dailyTasks?.[sopDate] || {};
                          let completed = 0; 
                          activeSops.forEach(s => { if (dayTasks[s.id]) completed++; });
                          customSops.forEach(s => { if (dayTasks[s.id]) completed++; });
                          const expected = activeSops.length + customSops.length;
                          const percent = expected === 0 ? 0 : Math.round((completed / expected) * 100);
                          const isComplete = expected > 0 && percent === 100;
                          const isOffDuty = expected === 0 && assignedIds; 
                          
                          return (
                            <div key={emp.id} className={`bg-white rounded-xl border p-5 shadow-sm transition-all flex flex-col ${isComplete ? 'border-green-200 bg-green-50/20' : isOffDuty ? 'border-slate-200 bg-slate-50 opacity-80' : 'border-gray-200'}`}>
                              <div className="flex justify-between items-start mb-4"><div><h4 className="font-bold text-slate-800">{emp.name}</h4><p className="text-xs font-medium text-slate-500 mt-0.5">{emp.role}</p></div>{isComplete && <CheckCircle2 className="h-6 w-6 text-green-500" />}</div>
                              <div className="mb-5 flex-1">
                                {isOffDuty ? ( <div className="text-xs font-bold text-slate-500 bg-slate-100 p-2 rounded text-center">No Tasks Assigned Today</div> ) : ( <><div className="flex justify-between text-xs font-bold mb-1.5"><span className={isComplete ? 'text-green-700' : 'text-slate-600'}>Today's Progress</span><span className={isComplete ? 'text-green-700' : 'text-slate-600'}>{completed}/{expected} ({percent}%)</span></div><div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50"><div className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : percent > 0 ? 'bg-indigo-500' : 'bg-transparent'}`} style={{ width: `${percent}%` }}></div></div>{customSops.length > 0 && <p className="text-[10px] text-indigo-500 font-bold mt-2 uppercase tracking-wider">Includes {customSops.length} Custom Tasks</p>}</> )}
                              </div>
                              <div className="flex gap-2 mt-auto pt-2">
                                <button onClick={() => { const existingFeedback = staffTasks[emp.id]?.dailyFeedback?.[sopDate] || ''; setTempFeedbackText(existingFeedback); setSelectedStaffSOP(emp); }} className="flex-1 py-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"><ClipboardCheck className="h-3.5 w-3.5" /> Review</button>
                                {canAssignWorkflows && <button onClick={() => openAssignModal(emp)} className="flex-1 py-2.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"><Pencil className="h-3.5 w-3.5" /> Assign</button>}
                              </div>
                            </div>
                          );
                       })}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-3xl">
                      <h3 className="text-xl font-bold mb-4">My Daily Workflow ({new Date(sopDate).toLocaleDateString()})</h3>
                      <div className="space-y-3">
                          {(() => {
                              const baseSops = roleSOPs[userProfile?.role] || [];
                              const myId = employees.find(e => e.email === user?.email)?.id;
                              const assigned = staffTasks[myId]?.assignedSOPs?.[sopDate];
                              const customSops = staffTasks[myId]?.customSOPs?.[sopDate] || [];
                              const activeSops = assigned ? baseSops.filter(t => assigned.includes(t.id)) : baseSops;
                              const dailyFeedback = staffTasks[myId]?.dailyFeedback?.[sopDate];
                              
                              if (activeSops.length === 0 && customSops.length === 0) {
                                  return <div className="text-slate-500 text-center py-10 bg-slate-50 rounded-xl border border-slate-200"><CheckCircle2 className="h-8 w-8 text-slate-300 mx-auto mb-3" /><p className="font-bold text-slate-600">No workflows assigned for today.</p><p className="text-sm mt-1">Enjoy your day off or contact your Supervisor!</p></div>;
                              }

                              return (
                                <>
                                  {dailyFeedback && (
                                    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                                      <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1.5"><MessageCircle className="h-4 w-4"/> Supervisor Feedback</h4>
                                      <p className="text-sm text-blue-900 leading-relaxed font-medium whitespace-pre-wrap">{dailyFeedback}</p>
                                    </div>
                                  )}
                                  {activeSops.map(task => {
                                      const isDone = staffTasks[myId]?.dailyTasks?.[sopDate]?.[task.id];
                                      return (
                                        <label key={task.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${isDone ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-indigo-100 hover:border-indigo-300 shadow-sm'}`}>
                                          <input type="checkbox" checked={isDone || false} onChange={() => handleToggleDailyTask(myId, task.id, sopDate)} className="mt-1 h-5 w-5 rounded text-indigo-600 cursor-pointer border-slate-300" />
                                          <span className={`text-sm leading-relaxed ${isDone ? 'line-through text-gray-500' : 'text-slate-800 font-medium'}`}>{task.task}</span>
                                        </label>
                                      );
                                  })}
                                  {customSops.length > 0 && <div className="pt-4 mt-4 border-t border-slate-100"></div>}
                                  {customSops.map(task => {
                                      const isDone = staffTasks[myId]?.dailyTasks?.[sopDate]?.[task.id];
                                      return (
                                        <label key={task.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${isDone ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-amber-50/50 border-amber-200 hover:border-amber-400 shadow-sm'}`}>
                                          <input type="checkbox" checked={isDone || false} onChange={() => handleToggleDailyTask(myId, task.id, sopDate)} className="mt-1 h-5 w-5 rounded text-amber-600 cursor-pointer border-amber-300" />
                                          <div className="flex flex-col">
                                            <span className={`text-sm leading-relaxed ${isDone ? 'line-through text-gray-500' : 'text-slate-800 font-medium'}`}>{task.task}</span>
                                            {!isDone && <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-1">Special Task Assigned by Supervisor</span>}
                                          </div>
                                        </label>
                                      );
                                  })}
                                </>
                              );
                          })()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============================== */}
          {/* ALL GLOBAL MODALS RESTORED */}
          {/* ============================== */}

          {selectedStaffForAssignment && (
            <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                <div className="bg-indigo-600 p-6 flex justify-between items-center text-white shrink-0">
                  <div>
                    <h3 className="font-bold text-xl flex items-center gap-2"><Pencil className="h-5 w-5 text-indigo-200"/> Assign Workflows</h3>
                    <p className="text-sm text-indigo-100 mt-1">Configuring {selectedStaffForAssignment.name} ({selectedStaffForAssignment.role}) • {new Date(sopDate).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setSelectedStaffForAssignment(null)} className="text-indigo-200 hover:text-white bg-indigo-700/50 p-2 rounded-full transition-colors"><X className="h-5 w-5" /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                   <div className="space-y-3">
                      <h4 className="text-sm font-bold text-indigo-900 mb-3 border-b border-indigo-100 pb-2">Standard Role Procedures</h4>
                      {roleSOPs[selectedStaffForAssignment.role] ? roleSOPs[selectedStaffForAssignment.role].map(task => {
                         const isAssigned = tempAssignedTasks.includes(task.id);
                         return (
                          <label key={task.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${isAssigned ? 'bg-white border-indigo-200 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-60'}`}>
                            <input type="checkbox" className="mt-1 h-5 w-5 rounded text-indigo-600 cursor-pointer border-slate-300" checked={isAssigned} onChange={() => {
                                setTempAssignedTasks(prev => isAssigned ? prev.filter(id => id !== task.id) : [...prev, task.id]);
                            }} />
                            <span className={`text-sm leading-relaxed ${isAssigned ? 'text-slate-800 font-bold' : 'text-slate-500'}`}>{task.task}</span>
                          </label>
                         )
                      }) : <p className="text-slate-500 text-center py-4">No standard checklist defined.</p>}
                      
                      <div className="mt-8 pt-6 border-t border-slate-200">
                         <h4 className="text-sm font-bold text-amber-700 mb-3 flex items-center gap-2"><Plus className="h-4 w-4"/> Special Tasks & Assignments for Today</h4>
                         <div className="space-y-2 mb-4">
                            {tempCustomTasks.map(ct => (
                              <div key={ct.id} className="flex justify-between items-center bg-amber-50 p-3 rounded-lg border border-amber-200 shadow-sm">
                                <span className="text-sm text-amber-900 font-medium">{ct.task}</span>
                                <button onClick={() => setTempCustomTasks(prev => prev.filter(t => t.id !== ct.id))} className="text-amber-500 hover:text-red-500 bg-white p-1 rounded-md shadow-sm"><Trash2 className="h-4 w-4"/></button>
                              </div>
                            ))}
                            {tempCustomTasks.length === 0 && <p className="text-xs text-slate-400 italic">No special tasks assigned.</p>}
                         </div>
                         <div className="flex gap-2">
                           <input type="text" value={newCustomTaskText} onChange={e => setNewCustomTaskText(e.target.value)} placeholder="Type a specific task or instruction..." className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if(newCustomTaskText.trim() === '') return; setTempCustomTasks(prev => [...prev, { id: `custom_${Date.now()}`, task: newCustomTaskText.trim() }]); setNewCustomTaskText(''); } }}/>
                           <button onClick={() => { if(newCustomTaskText.trim() === '') return; setTempCustomTasks(prev => [...prev, { id: `custom_${Date.now()}`, task: newCustomTaskText.trim() }]); setNewCustomTaskText(''); }} className="bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-700 shadow-sm transition-colors">Add</button>
                         </div>
                      </div>
                    </div>
                </div>
                <div className="p-5 border-t border-slate-200 bg-white flex justify-between items-center shrink-0">
                  <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Info className="h-4 w-4"/> Changes apply strictly to {new Date(sopDate).toLocaleDateString()}.</div>
                  <div className="flex gap-3">
                    <button onClick={() => setSelectedStaffForAssignment(null)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors">Cancel</button>
                    <button onClick={() => handleSaveAssignments(selectedStaffForAssignment.id, sopDate, tempAssignedTasks, tempCustomTasks)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors">Save Assignments</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedStaffSOP && (
            <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden">
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
                  <div>
                    <h3 className="font-bold text-xl flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-blue-400"/> {selectedStaffSOP.name}'s Checklist</h3>
                    <p className="text-sm text-blue-200 mt-1">{selectedStaffSOP.role} • {new Date(sopDate).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setSelectedStaffSOP(null)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"><X className="h-5 w-5" /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                   <div className="space-y-3">
                    {(() => {
                        const baseSops = roleSOPs[selectedStaffSOP.role] || [];
                        const assignedTaskIds = staffTasks[selectedStaffSOP.id]?.assignedSOPs?.[sopDate];
                        const customSops = staffTasks[selectedStaffSOP.id]?.customSOPs?.[sopDate] || [];
                        const activeSops = assignedTaskIds ? baseSops.filter(t => assignedTaskIds.includes(t.id)) : baseSops;
                        
                        if (activeSops.length === 0 && customSops.length === 0) {
                            return <div className="text-slate-500 text-center py-10 bg-white rounded-xl border border-slate-200"><CheckCircle2 className="h-8 w-8 text-slate-300 mx-auto mb-3" /><p className="font-bold text-slate-600">No workflows assigned for this date.</p></div>;
                        }

                        return (
                          <>
                            {activeSops.map(task => {
                                const isDone = staffTasks[selectedStaffSOP.id]?.dailyTasks?.[sopDate]?.[task.id];
                                return (
                                  <label key={task.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${isDone ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-indigo-100 hover:border-indigo-300 shadow-sm'}`}>
                                    <input type="checkbox" checked={isDone || false} onChange={() => handleToggleDailyTask(selectedStaffSOP.id, task.id, sopDate)} disabled={!canAssignWorkflows} className="mt-1 h-5 w-5 rounded text-indigo-600 cursor-pointer border-slate-300" />
                                    <div className="flex flex-col"><span className={`text-sm leading-relaxed ${isDone ? 'text-gray-500 line-through' : 'text-slate-800 font-medium'}`}>{task.task}</span></div>
                                  </label>
                                );
                            })}
                            {customSops.length > 0 && <div className="pt-4 mt-4 border-t border-slate-200"></div>}
                            {customSops.map(task => {
                                const isDone = staffTasks[selectedStaffSOP.id]?.dailyTasks?.[sopDate]?.[task.id];
                                return (
                                  <label key={task.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${isDone ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-amber-50/50 border-amber-200 hover:border-amber-400 shadow-sm'}`}>
                                    <input type="checkbox" checked={isDone || false} onChange={() => handleToggleDailyTask(selectedStaffSOP.id, task.id, sopDate)} disabled={!canAssignWorkflows} className="mt-1 h-5 w-5 rounded text-amber-600 cursor-pointer border-amber-300" />
                                    <div className="flex flex-col">
                                      <span className={`text-sm leading-relaxed ${isDone ? 'text-gray-500 line-through' : 'text-slate-800 font-medium'}`}>{task.task}</span>
                                      {!isDone && <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-1">Special Task Assigned by Supervisor</span>}
                                    </div>
                                  </label>
                                );
                            })}
                          </>
                        )
                    })()}
                  </div>
                </div>
                {['Principal', 'Manager', 'Supervisor', 'HR Manager'].includes(role) && (
                  <div className="p-5 border-t border-slate-200 bg-white shrink-0">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5"><MessageCircle className="h-4 w-4 text-blue-500"/> Daily Feedback / Notes</label>
                    <div className="flex gap-3">
                      <textarea 
                        value={tempFeedbackText} 
                        onChange={(e) => setTempFeedbackText(e.target.value)} 
                        className="flex-1 border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[60px] resize-none" 
                        placeholder="Type feedback regarding today's performance..."
                      />
                      <button onClick={() => handleSaveFeedback(selectedStaffSOP.id, sopDate)} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors self-end">
                        Save Note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedRoleDoc && (
            <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
                  <div className="flex items-center gap-3"><FileText className="h-6 w-6 text-blue-400" /><div><h3 className="font-bold text-2xl">{selectedRoleDoc.title}</h3><p className="text-sm text-slate-300 mt-1">Job Specification Document</p></div></div>
                  <button onClick={() => setSelectedRoleDoc(null)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"><X className="h-6 w-6" /></button>
                </div>
                <div className="p-8 overflow-y-auto flex-1 bg-slate-50 space-y-8">
                  <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3 border-b pb-2"><Briefcase className="h-5 w-5 text-indigo-500" /> Job Specification</h4>
                    <p className="text-slate-600 leading-relaxed">{selectedRoleDoc.spec}</p>
                  </section>
                  <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3 border-b pb-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Standard Daily Workflow</h4>
                    <ul className="space-y-3">
                      {selectedRoleDoc.workflow.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600"><span className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold border border-slate-200">{i + 1}</span><span className="mt-0.5">{item}</span></li>
                      ))}
                    </ul>
                  </section>
                  {selectedRoleDoc.frameworks && selectedRoleDoc.frameworks.length > 0 && (
                    <section className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                      <h4 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-4 border-b border-indigo-100 pb-2"><GraduationCap className="h-5 w-5 text-indigo-500" /> Required Pedagogical Frameworks</h4>
                      <div className="space-y-6">
                        {selectedRoleDoc.frameworks.map((framework, i) => (
                          <div key={i} className="bg-indigo-50 rounded-lg p-4 border border-indigo-100/50">
                            <h5 className="font-bold text-indigo-800 mb-3">{framework.name}</h5>
                            <div className="flex flex-wrap gap-2">
                              {framework.stages.map((stage, j) => (
                                <React.Fragment key={j}>
                                  <span className="bg-white text-indigo-700 text-sm px-3 py-1.5 rounded-md border border-indigo-200 font-medium shadow-sm">{stage}</span>
                                  {j < framework.stages.length - 1 && <span className="text-indigo-300 flex items-center">➔</span>}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          )}

          {deletingStaff && (
            <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl max-w-md w-full p-6 text-center shadow-2xl border border-red-100">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Terminate Employee Record?</h3>
                <p className="text-sm text-slate-600 mb-6">Are you sure you want to remove <span className="font-bold text-slate-900">{deletingStaff.name} ({deletingStaff.role})</span>?</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setDeletingStaff(null)} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                  <button onClick={confirmDeleteStaff} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold transition-colors">Remove Staff</button>
                </div>
              </div>
            </div>
          )}

          {deletingTxn && (
            <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl max-w-md w-full p-6 text-center shadow-2xl border border-red-100">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Move to Audit Log?</h3>
                <p className="text-sm text-slate-600 mb-6">Are you sure you want to remove the record for <span className="font-bold text-slate-900">{deletingTxn.desc} ({deletingTxn.amount.toLocaleString()} MMK)</span>? It will be securely moved to the Security Audit Log.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setDeletingTxn(null)} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                  <button onClick={confirmDelete} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold transition-colors">Confirm Remove</button>
                </div>
              </div>
            </div>
          )}

          {showBulkDeleteModal && (
            <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl max-w-md w-full p-6 text-center shadow-2xl border border-red-100">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Bulk Move to Audit Log?</h3>
                <p className="text-sm text-slate-600 mb-6">Are you sure you want to remove <span className="font-bold text-slate-900">{selectedTxns.length} records</span>? They will be securely moved to the Security Audit Log.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setShowBulkDeleteModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                  <button onClick={confirmBulkDelete} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold transition-colors">Confirm Bulk Remove</button>
                </div>
              </div>
            </div>
          )}

          {deletingStudent && (
            <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl max-w-md w-full p-6 text-center shadow-2xl border border-red-100">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Student Record?</h3>
                <p className="text-sm text-slate-600 mb-6">Are you sure you want to permanently delete <span className="font-bold text-slate-900">{deletingStudent.name}</span>? This cannot be undone.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setDeletingStudent(null)} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                  <button onClick={confirmDeleteStudent} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold transition-colors">Permanently Delete</button>
                </div>
              </div>
            </div>
          )}

          {editingStudentId && (
            <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
                <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                  <h3 className="font-bold text-lg flex items-center gap-2"><Pencil className="h-5 w-5"/> Edit Student Details</h3>
                  <button onClick={() => setEditingStudentId(null)} className="text-blue-200 hover:text-white"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleUpdateStudent} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                      <input type="text" required value={editStudentData.name} onChange={e => setEditStudentData({...editStudentData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                      <input type="text" value={editStudentData.phone} onChange={e => setEditStudentData({...editStudentData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class / Interest</label>
                      <input type="text" value={editStudentData.inquiredClass} onChange={e => setEditStudentData({...editStudentData, inquiredClass: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                      <input type="text" value={editStudentData.batch} onChange={e => setEditStudentData({...editStudentData, batch: e.target.value})} placeholder="e.g. Batch 1" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select value={editStudentData.status} onChange={e => setEditStudentData({...editStudentData, status: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Lead">Lead (Inquired)</option>
                        <option value="Prospect">Prospect (Testing/High Intent)</option>
                        <option value="Enrolled">Enrolled</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                    <button type="button" onClick={() => setEditingStudentId(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          </main>
        </div>
      </div>
    </div>
  );
}