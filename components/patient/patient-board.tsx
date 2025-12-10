'use client';

import { useEffect } from 'react';
import { usePatientsStore } from '@/store/patient-store';
import { patientStatuses } from '@/mock-data/patient-statuses';
import { PatientColumn } from './patient-column';

export function PatientBoard() {
  const { patientsByStatus, fetchPatients, isLoading } = usePatientsStore();

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Cargando pacientes...</div>;
  }

  return (
    <div className="flex h-full w-full gap-3 px-3 pt-4 pb-2 overflow-hidden">
      {patientStatuses.map((status) => (
        <PatientColumn
          key={status.id}
          status={status}
          patients={patientsByStatus[status.id] || []}
        />
      ))}
    </div>
  );
}
