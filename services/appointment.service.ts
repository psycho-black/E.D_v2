export interface Appointment {
  id: string;
  patientId: string;
  date: string; // ISO string
  type: 'Checkup' | 'Surgery' | 'FollowUp';
  notes: string;
}

export const mockAppointments: Appointment[] = [
    {
        id: "101",
        patientId: "1",
        date: "2024-03-10T10:00:00Z",
        type: "Checkup",
        notes: "Routine checkup for blood pressure."
    },
    {
        id: "102",
        patientId: "2",
        date: "2024-03-11T11:00:00Z",
        type: "FollowUp",
        notes: "Follow up on previous fast."
    }
];

export const AppointmentService = {
    getAppointments: async (): Promise<Appointment[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockAppointments), 500));
    },

    createAppointment: async (appointment: Omit<Appointment, "id">): Promise<Appointment> => {
        return new Promise((resolve) => {
            const newAppt = { ...appointment, id: Math.random().toString(20).substr(2, 9) };
            mockAppointments.push(newAppt);
            resolve(newAppt);
        });
    }
};
