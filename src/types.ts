// Type definitions for the application

export interface NurseInfo {
  name: string;
  id: string;
  role: 'nurse' | 'doctor';
  loginTime: string;
}

export interface PatientIntake {
  // Basic Info (from Kobo or quick entry)
  patientInitials: string;
  approximateAge?: string; // "elderly", "middle-aged", "young adult"
  location: 'ward' | 'home';
  homeAddress?: string;
  
  // Medical Basics
  primaryDiagnosis: string; // "cancer - breast", "TB", "HIV/AIDS", "heart disease"
  otherConditions?: string[];
  currentMedications?: string[];
  knownAllergies?: string;
  
  // Current State (first visit)
  initialPainLevel: string;
  mobility: string;
  consciousnessLevel: string;
  
  // Support
  familyContact: string;
  caregiver: string;
  referredFrom?: string; // "hospital", "clinic", "community health worker"
  
  // Documentation
  consentForPhotos: boolean;
  consentGivenBy?: string; // "patient" or "family member name"
  hospitalRecordPhotos?: string[]; // encrypted base64 or file paths
  koboFormId?: string; // link to Kobo submission if applicable
  
  // Admin
  intakeDate: string;
  intakeBy: string;
  intakeById: string;
  notes: string;
}

export interface ClinicalPhoto {
  id: string;
  patientId: string;
  photoType: 'wound' | 'record' | 'lab_result' | 'medication_list' | 'other';
  description: string;
  encryptedData: string; // encrypted base64
  timestamp: string;
  takenBy: string;
  takenById: string;
  consentVerified: boolean;
}

export interface Patient {
  id: string;
  initials: string;
  location: 'ward' | 'home';
  
  // Intake
  hasCompletedIntake: boolean;
  intake?: PatientIntake;
  
  // Ongoing tracking
  lastAssessment?: string;
  recentMedications?: string[];
  notes?: string;
  lastStaffName?: string;
  lastStaffRole?: 'nurse' | 'doctor';
  lastAction?: string;
  lastActionTime?: string;
  scheduledTime?: string;
  currentPainLevel?: number;
  
  // Photos
  clinicalPhotos?: ClinicalPhoto[];
}



export interface VitalSigns {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  respiratoryRate: string;
  oxygenSaturation: string;
}

export interface GeneralAssessment {
  // Patient Status Overview (what nurse needs to know before visit)
  mobility: string; // "bedridden", "needs help", "walking"
  consciousnessLevel: string; // "alert", "confused", "drowsy", "unresponsive"
  nutritionAppetite: string; // "eating well", "eating little", "not eating"
  painLevel: string; // "controlled", "uncontrolled", "needs adjustment"
  breathingStatus: string; // "normal", "short of breath", "difficulty breathing"
  
  // Wound Information
  hasWound: boolean;
  woundLocation?: string; // "back", "heel", "breast", "leg"
  woundStatus?: string; // "getting better", "same", "getting worse", "new wound"
  woundNeedsSupplies?: boolean;
  woundNotes?: string;
  
  // Current Symptoms & Issues
  hasFever: boolean;
  hasInfection: boolean;
  nauseaVomiting: string; // "none", "occasional", "frequent"
  bowelBladderIssues: string; // "normal", "constipation", "incontinence", "catheter"
  skinIssues: string; // "good", "dry", "breakdown", "rash"
  
  // What Patient Needs
  needsMedication: boolean;
  medicationNotes?: string;
  needsSupplies: boolean;
  suppliesNeeded?: string; // "dressings, gloves, catheter bags"
  needsEquipment: string; // "wheelchair", "oxygen", "bed", "none"
  
  // Family & Support
  familyPresent: boolean;
  caregiverCoping: string; // "coping well", "struggling", "overwhelmed"
  familyNeedsHelp: string; // what family needs support with
  
  // Psychosocial
  emotionalState: string; // "calm", "anxious", "depressed", "peaceful"
  spiritualNeeds: string;
  
  // Action Items
  urgentNeeds: string; // anything urgent to address today
  followUpNeeded: string; // what needs to happen next visit
  doctorReviewNeeded: boolean;
  
  notes: string; // anything else nurse should know
}

export interface QuickExam {
  vitalSigns: VitalSigns;
  generalAssessment: GeneralAssessment;
  symptomsToday: string[]; // what patient complained about today
  whatWasDone: string; // what nurse/doctor did during this visit
  notes: string;
  timestamp: string;
}

export interface FullAssessment {
  patientId?: string;
  patientInitials: string;
  patientLocation: 'ward' | 'home';
  quickExam: QuickExam;
  assessedBy: string;
  assessedById: string;
  timestamp: string;
  synced: boolean;
  savedAt?: number;
  key?: string;
}

export interface StorageResult {
  success: boolean;
  key?: string;
  error?: any;
}
