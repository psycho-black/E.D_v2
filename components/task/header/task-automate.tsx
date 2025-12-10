"use client";

import * as React from "react";
import { Sparkle, Zap, Clock, Mail, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const automationOptions = [
  {
    id: "auto-assign",
    name: "Auto-asignar tareas",
    description: "Asignar automáticamente nuevas tareas a los miembros del equipo",
    icon: Zap,
  },
  {
    id: "due-date",
    name: "Recordatorios de fecha de vencimiento",
    description: "Recibir notificaciones antes de que venzan las tareas",
    icon: Clock,
  },
  {
    id: "email-summary",
    name: "Resumen diario por correo",
    description: "Recibe un resumen de tus tareas cada mañana",
    icon: Mail,
  },
  {
    id: "slack-notify",
    name: "Notificaciones de Slack",
    description: "Enviar actualizaciones a Slack cuando las tareas cambien",
    icon: Bell,
  },
];

export function TaskAutomate() {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm" className="sm:gap-2">
          <Sparkle className="size-4" />
          <span className="hidden sm:inline">Automatizar</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Reglas de automatización</h3>
            <p className="text-xs text-muted-foreground">
              Configura acciones automáticas para tus tareas.
            </p>
          </div>

          <div className="space-y-2">
            {automationOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div
                  key={option.id}
                  className="flex gap-3 p-2.5 rounded-md bg-muted/50"
                >
                  <Icon className="size-4 shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{option.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

