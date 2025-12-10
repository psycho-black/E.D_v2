export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: 'Waiting' | 'In_Consultation' | 'Finished';
  lastVisit: string;
}

export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Juan Pérez",
    age: 45,
    condition: "Hipertensión",
    status: "Waiting",
    lastVisit: "2024-01-15",
  },
  {
    id: "2",
    name: "María Garcia",
    age: 32,
    condition: "Control Prenatal",
    status: "In_Consultation",
    lastVisit: "2024-02-01",
  },
  {
    id: "3",
    name: "Carlos López",
    age: 60,
    condition: "Diabetes Tipo 2",
    status: "Finished",
    lastVisit: "2023-12-10",
  },
];

export const PatientService = {
  getPatients: async (): Promise<Patient[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPatients), 500);
    });
  },
  
  getPatientById: async (id: string): Promise<Patient | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPatients.find(p => p.id === id)), 500);
    });
  },

  createPatient: async (patient: Omit<Patient, "id">): Promise<Patient> => {
      return new Promise((resolve) => {
          const newPatient = { ...patient, id: Math.random().toString(36).substr(2, 9) };
          mockPatients.push(newPatient);
          setTimeout(() => resolve(newPatient), 500);
      });
  }
};
