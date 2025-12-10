"use client";

import * as React from "react";
import {
  ChevronDown,
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DesktopService } from "@/services/desktop.service";

export function TaskImportExport() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 hidden lg:flex">
          Archivos
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Upload className="size-4" />
          Gestión de Archivos
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={async () => {
          const result = await DesktopService.openFileDialog();
          if (result && !result.canceled && result.filePaths.length > 0) {
            // Logic to attach to patient record
            await DesktopService.showNotification("Archivo Seleccionado", `Listo para adjuntar: ${result.filePaths[0]}`);
          }
        }}>
          <FileText className="size-4" />
          Cargar Documento / Estudio
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="flex items-center gap-2">
          <Download className="size-4" />
          Reportes
        </DropdownMenuLabel>
        <DropdownMenuItem>
          <FileSpreadsheet className="size-4" />
          Exportar Lista de Pacientes
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
