import localforage from 'localforage';
import type { FullAssessment, Patient, StorageResult } from '../types';

// Configure localforage for offline storage
localforage.config({
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
  name: 'HospiceTororoEMR',
  version: 1.0,
  storeName: 'patient_data',
  description: 'Offline storage for patient assessments'
});

// Save patient assessment offline
export const saveAssessmentOffline = async (assessmentData: FullAssessment): Promise<StorageResult> => {
  try {
    const timestamp = Date.now();
    const key = `assessment_${timestamp}`;
    await localforage.setItem(key, {
      ...assessmentData,
      savedAt: timestamp,
      synced: false
    });
    return { success: true, key };
  } catch (error) {
    console.error('Error saving offline:', error);
    return { success: false, error };
  }
};

// Get all pending assessments (not synced)
export const getPendingAssessments = async (): Promise<FullAssessment[]> => {
  try {
    const keys = await localforage.keys();
    const pendingAssessments: FullAssessment[] = [];
    
    for (const key of keys) {
      if (key.startsWith('assessment_')) {
        const data = await localforage.getItem<FullAssessment>(key);
        if (data && !data.synced) {
          pendingAssessments.push({ ...data, key });
        }
      }
    }
    
    return pendingAssessments;
  } catch (error) {
    console.error('Error getting pending assessments:', error);
    return [];
  }
};

// Mark assessment as synced
export const markAsSynced = async (key: string): Promise<void> => {
  try {
    const data = await localforage.getItem<FullAssessment>(key);
    if (data) {
      await localforage.setItem(key, { ...data, synced: true });
    }
  } catch (error) {
    console.error('Error marking as synced:', error);
  }
};

// Clear old synced assessments (older than 30 days)
export const clearOldAssessments = async (): Promise<void> => {
  try {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const keys = await localforage.keys();
    
    for (const key of keys) {
      if (key.startsWith('assessment_')) {
        const data = await localforage.getItem<FullAssessment>(key);
        if (data && data.synced && data.savedAt && data.savedAt < thirtyDaysAgo) {
          await localforage.removeItem(key);
        }
      }
    }
  } catch (error) {
    console.error('Error clearing old assessments:', error);
  }
};

// Save patient list
export const savePatientList = async (patients: Patient[]): Promise<void> => {
  try {
    await localforage.setItem('patient_list', patients);
  } catch (error) {
    console.error('Error saving patient list:', error);
  }
};

// Get patient list
export const getPatientList = async (): Promise<Patient[]> => {
  try {
    const patients = await localforage.getItem<Patient[]>('patient_list');
    return patients || [];
  } catch (error) {
    console.error('Error getting patient list:', error);
    return [];
  }
};

// Add or update a patient
export const savePatient = async (patient: Patient): Promise<void> => {
  try {
    const patients = await getPatientList();
    const existingIndex = patients.findIndex(p => p.id === patient.id);
    
    if (existingIndex >= 0) {
      patients[existingIndex] = patient;
    } else {
      patients.push(patient);
    }
    
    await savePatientList(patients);
  } catch (error) {
    console.error('Error saving patient:', error);
  }
};
