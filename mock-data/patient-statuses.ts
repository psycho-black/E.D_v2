export type PatientStatus = 'waiting' | 'in-consultation' | 'finished';

export interface Status {
    id: PatientStatus;
    name: string;
    color: string;
}

export const patientStatuses: Status[] = [
    { id: 'waiting', name: 'Sala de Espera', color: '#6b7280' },
    { id: 'in-consultation', name: 'En Consulta', color: '#eab308' },
    { id: 'finished', name: 'Finalizado', color: '#22c55e' },
];
