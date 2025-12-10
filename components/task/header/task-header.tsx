"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Link as LinkIcon,
  Github,
  Search,
  Bell,
  AlertCircle,
  StickyNote,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { TaskFilters } from "./task-filters";
import { TaskSort } from "./task-sort";
import { TaskAutomate } from "./task-automate";
import { TaskImportExport } from "./task-import-export";

export function TaskHeader({ title = "Tareas" }: { title?: string }) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    new Date("2024-09-07")
  );

  return (
    <div className="border-b border-border/10 bg-transparent drag">
      <div className="flex items-center justify-between px-3 lg:px-6 py-2">
        <div className="flex items-center gap-2 no-drag">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <h1 className="text-base lg:text-lg font-semibold">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4 no-drag">
          <div className="flex items-center gap-2 lg:gap-4">
            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Bell className="size-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
              <AlertCircle className="size-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
              <StickyNote className="size-4" />
            </Button>

            <div className="h-4 w-px bg-border/50 mx-1" />

            <ThemeToggle />

            <div className="h-4 w-px bg-border/50 mx-1" />

            <Button variant="ghost" size="icon" className="rounded-full shrink-0">
              <Image
                src="/ln.png"
                alt="Profile"
                className="size-7 object-cover rounded-full"
                width={28}
                height={28}
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 lg:px-6 py-2 border-t border-border overflow-hidden no-drag">
        <div className="flex items-center gap-2 shrink-0">
          <TaskFilters />
          <TaskSort />
          <TaskAutomate />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hidden lg:flex font-normal"
              >
                <CalendarIcon className="size-4" />
                {date
                  ? date.toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                  : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(selectedDate: Date | undefined) => {
                  setDate(selectedDate);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          <TaskImportExport />
          <Button size="sm" className="sm:gap-2 shrink-0">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Solicitar tarea</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
