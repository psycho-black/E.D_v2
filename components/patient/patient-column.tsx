import { Status } from "@/mock-data/patient-statuses";
import { Patient } from "@/services/patient.service";
import { PatientCard } from "./patient-card";
import { Plus, MoreHorizontal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientColumnProps {
  status: Status;
  patients: Patient[];
}

export function PatientColumn({ status, patients }: PatientColumnProps) {
  return (
    <div className="shrink-0 w-[300px] lg:w-[360px] flex flex-col h-full flex-1">
      <div className="rounded-lg border border-border p-3 bg-muted/70 dark:bg-muted/50 flex flex-col max-h-full">
        <div className="flex items-center justify-between mb-2 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="size-4 flex items-center justify-center">
              <Users className="size-4" />
            </div>
            <span className="text-sm font-medium">{status.name}</span>
            <span className="text-xs text-muted-foreground ml-1">({patients.length})</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto h-full scrollbar-thin">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-xs h-auto py-1 px-0 self-start hover:bg-background"
          >
            <Plus className="size-4" />
            <span>Añadir paciente</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
