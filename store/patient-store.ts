import { create } from 'zustand';
import { Patient, PatientService } from '@/services/patient.service';
import { Status, patientStatuses } from '@/mock-data/patient-statuses';

interface PatientsState {
  patients: Patient[];
  patientsByStatus: Record<string, Patient[]>;
  isLoading: boolean;
  fetchPatients: () => Promise<void>;
  updatePatientStatus: (patientId: string, status: string) => Promise<void>;
}

const groupPatientsByStatus = (patients: Patient[]) => {
  return patients.reduce((acc, patient) => {
    const status = patient.status.toLowerCase().replace('_', '-'); // Normalize if needed
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(patient);
    return acc;
  }, {} as Record<string, Patient[]>);
};

export const usePatientsStore = create<PatientsState>((set, get) => ({
  patients: [],
  patientsByStatus: {},
  isLoading: false,
  
  fetchPatients: async () => {
    set({ isLoading: true });
    try {
      const patients = await PatientService.getPatients();
      const normalizedPatients = patients.map(p => ({
          ...p,
          status: p.status.toLowerCase().replace('_', '-') as any 
      }));
      set({ 
        patients: normalizedPatients, 
        patientsByStatus: groupPatientsByStatus(normalizedPatients),
        isLoading: false 
      });
    } catch (error) {
      console.error("Failed to fetch patients", error);
      set({ isLoading: false });
    }
  },

  updatePatientStatus: async (patientId, status) => {
      // Optimistic update
      set(state => {
          const newPatients = state.patients.map(p => 
              p.id === patientId ? { ...p, status: status as any } : p
          );
          return {
              patients: newPatients,
              patientsByStatus: groupPatientsByStatus(newPatients)
          };
      });
      // TODO: Call API to persist
  }
}));
