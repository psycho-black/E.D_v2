import { Patient } from "@/services/patient.service";
import {
  Calendar,
  Activity,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  return (
    <div className="bg-background shrink-0 rounded-lg overflow-hidden border border-border">
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-8 shrink-0 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
            <User className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium leading-tight truncate">
              {patient.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {patient.age} años
            </p>
          </div>
        </div>

        <div className="mb-3">
          <Badge variant="outline" className="text-xs font-normal">
            {patient.condition}
          </Badge>
        </div>
      </div>

      <div className="px-3 py-2.5 border-t border-border border-dashed">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
            <Calendar className="size-3 shrink-0" />
            <span className="truncate">Visita: {patient.lastVisit}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            <Activity className="size-3 shrink-0" />
            <span>{patient.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
