"use client";

import {
  Bell,
  LayoutGrid,
  Circle,
  Star,
  FileCheck,
  FileText,
  Calendar,
  Users,
  Building,
  ChevronDown,
  Paperclip,
  Folder,
  Mail,
  HelpCircle,
  ArrowUpRight,
  Layers,
  CreditCard,
  Navigation,
  Search,
  Check,
  Plus,
  MessageCircle, Sparkles, HardDrive, Table, MonitorPlay, CheckSquare, StickyNote, UserSquare, FileQuestion, Image as ImageHash, Languages, Book, PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Kbd } from "@/components/ui/kbd";

import { useViewStore } from "@/store/view-store";
import * as React from "react";
import { useEffect } from "react";
import { DesktopService } from "@/services/desktop.service";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, badge, active, onClick }: SidebarItemProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "w-full justify-start px-2 py-2 h-auto text-sm transition-all",
        active
          ? "bg-muted text-foreground font-medium"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        isCollapsed ? "justify-center px-0" : "justify-between"
      )}
      title={isCollapsed ? label : undefined}
    >
      <div className={cn("flex items-center gap-3", isCollapsed && "gap-0")}>
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </div>
      {!isCollapsed && badge && (
        <div className="bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
          {badge}
        </div>
      )}
      {isCollapsed && badge && (
        <div className="absolute top-1 right-1 size-2 bg-red-500 rounded-full" />
      )}
    </Button>
  );
}

function SidebarSection({
  title,
  children,
  scrollable = true,
}: {
  title: string;
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  if (isCollapsed) {
    return (
      <div className="mb-2 space-y-1">
        {/* Show separator or mini-header? specific request: "iconos" only */}
        <div className="h-px bg-border my-2 mx-2" />
        {children}
      </div>
    )
  }

  return (
    <div className="mb-2">
      <Button
        variant="ghost"
        className="w-full justify-between gap-2 px-1 mb-2 text-xs h-auto py-1.5 text-muted-foreground hover:text-foreground hover:bg-transparent transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">{title}</span>
        <ChevronDown className={cn("size-3 transition-transform duration-200", isOpen ? "" : "-rotate-90")} />
      </Button>
      {isOpen && (
        <div className={cn("space-y-0.5 px-1", scrollable && "max-h-[300px] overflow-y-auto scrollbar-thin")}>
          {children}
        </div>
      )}
    </div>
  );
}

function IntegrationGroup({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  if (isCollapsed) {
    return <div className="space-y-1">{children}</div>;
  }

  return (
    <div className="mb-1">
      <Button
        variant="ghost"
        className="w-full justify-between gap-2 px-2 text-xs h-auto py-1.5 font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <ChevronDown className={cn("size-3 transition-transform duration-200", isOpen ? "" : "-rotate-90")} />
      </Button>
      {isOpen && (
        <div className="space-y-0.5 mt-0.5 max-h-[200px] overflow-y-auto scrollbar-thin pr-1 pl-1">
          {children}
        </div>
      )}
    </div>
  )
}

export function TaskSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { currentView, setView, notifications, setNotifications } = useViewStore();
  const { state } = useSidebar(); // Consume direct state if needed in parent
  const isCollapsed = state === "collapsed";

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+N: New Patient
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        DesktopService.showNotification("Atajo", "Crear nuevo paciente (Cmd+N)");
      }
      // Cmd+O: Open File
      if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault();
        DesktopService.openFileDialog();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pb-0">
        <div className="px-4 pt-4 pb-0">
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 h-auto p-0! hover:bg-transparent"
                >
                  <div
                    className="size-6 bg-linear-to-br from-purple-500 to-pink-600 rounded-sm shadow flex items-center justify-center text-white text-xs font-semibold shrink-0"
                    translate="no"
                  >
                    Eco
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="font-semibold truncate">Proyecto Eco</span>
                      <ChevronDown className="size-3 text-muted-foreground ml-auto" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuItem>
                  <div className="flex items-center gap-3 w-full">
                    <div className="size-6 bg-linear-to-br from-purple-500 to-pink-600 rounded-sm shadow flex items-center justify-center text-white text-xs font-semibold">
                      SU
                    </div>
                    <span className="font-semibold">Square UI</span>
                    <Check className="size-4 ml-auto" />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center gap-3 w-full">
                    <div className="size-6 bg-linear-to-br from-blue-500 to-cyan-600 rounded-sm shadow flex items-center justify-center text-white text-xs font-semibold">
                      CI
                    </div>
                    <span>Circle</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className="size-6 bg-linear-to-br from-orange-500 to-red-600 rounded-sm shadow flex items-center justify-center text-white text-xs font-semibold"
                      translate="no"
                    >
                      ED
                    </div>
                    <span>EcoDigital</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Plus className="size-4" />
                  <span>Añadir nuevo equipo</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>


        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <div className="space-y-0.5 mb-6">
          <SidebarItem
            icon={<LayoutGrid className="size-4" />}
            label="Dashboard"
            active={currentView === 'dashboard'}
            onClick={() => setView('dashboard')}
          />
          <SidebarItem
            icon={<Bell className="size-4" />}
            label="Avisos"
            badge={notifications > 0 ? notifications.toString() : undefined}
            active={currentView === 'messages'}
            onClick={() => {
              setView('messages');
              setNotifications(0);
            }}
          />
          <SidebarItem
            icon={<Users className="size-4" />}
            label="Pacientes"
            active={currentView === 'patients'}
            onClick={() => setView('patients')}
          />
          <SidebarItem
            icon={<Calendar className="size-4" />}
            label="Citas"
            active={currentView === 'appointments'}
            onClick={() => setView('appointments')}
          />
        </div>

        <SidebarSection title="Gestión Médica">
          <SidebarItem
            icon={<Folder className="size-4" />}
            label="Expedientes"
            active={currentView === 'documents'}
            onClick={() => setView('documents')}
          />
          <SidebarItem icon={<Mail className="size-4" />} label="Mensajes" />
        </SidebarSection>

        <SidebarSection title="Integraciones" scrollable={false}>
          <IntegrationGroup title="Comunicación & IA">
            <SidebarItem icon={<MessageCircle className="size-4" />} label="WhatsApp" active={currentView === 'whatsapp'} onClick={() => setView('whatsapp')} />
            <SidebarItem icon={<Mail className="size-4" />} label="Gmail" active={currentView === 'gmail'} onClick={() => setView('gmail')} />
            <SidebarItem icon={<Mail className="size-4" />} label="Outlook" active={currentView === 'outlook'} onClick={() => setView('outlook')} />
            <SidebarItem icon={<Sparkles className="size-4" />} label="Google Gemini" active={currentView === 'gemini'} onClick={() => setView('gemini')} />
          </IntegrationGroup>

          <IntegrationGroup title="Google Workspace">
            <SidebarItem icon={<HardDrive className="size-4" />} label="Drive" active={currentView === 'drive'} onClick={() => setView('drive')} />
            <SidebarItem icon={<FileText className="size-4" />} label="Docs" active={currentView === 'docs'} onClick={() => setView('docs')} />
            <SidebarItem icon={<Table className="size-4" />} label="Sheets" active={currentView === 'sheets'} onClick={() => setView('sheets')} />
            <SidebarItem icon={<MonitorPlay className="size-4" />} label="Slides" active={currentView === 'slides'} onClick={() => setView('slides')} />
            <SidebarItem icon={<Calendar className="size-4" />} label="Calendar" active={currentView === 'calendar'} onClick={() => setView('calendar')} />
            <SidebarItem icon={<CheckSquare className="size-4" />} label="Tasks" active={currentView === 'tasks'} onClick={() => setView('tasks')} />
            <SidebarItem icon={<StickyNote className="size-4" />} label="Keep" active={currentView === 'keep'} onClick={() => setView('keep')} />
            <SidebarItem icon={<UserSquare className="size-4" />} label="Contacts" active={currentView === 'contacts'} onClick={() => setView('contacts')} />
            <SidebarItem icon={<FileQuestion className="size-4" />} label="Forms" active={currentView === 'forms'} onClick={() => setView('forms')} />
            <SidebarItem icon={<ImageHash className="size-4" />} label="Photos" active={currentView === 'photos'} onClick={() => setView('photos')} />
            <SidebarItem icon={<Languages className="size-4" />} label="Traductor" active={currentView === 'translate'} onClick={() => setView('translate')} />
          </IntegrationGroup>

          <IntegrationGroup title="Microsoft 365">
            <SidebarItem icon={<Users className="size-4" />} label="Teams" active={currentView === 'teams'} onClick={() => setView('teams')} />
            <SidebarItem icon={<FileText className="size-4" />} label="Word" active={currentView === 'word'} onClick={() => setView('word')} />
            <SidebarItem icon={<Table className="size-4" />} label="Excel" active={currentView === 'excel'} onClick={() => setView('excel')} />
            <SidebarItem icon={<Book className="size-4" />} label="OneNote" active={currentView === 'onenote'} onClick={() => setView('onenote')} />
            <SidebarItem icon={<Calendar className="size-4" />} label="Bookings" active={currentView === 'bookings'} onClick={() => setView('bookings')} />
          </IntegrationGroup>

          <IntegrationGroup title="Herramientas">
            <SidebarItem icon={<FileText className="size-4" />} label="iLovePDF" active={currentView === 'ilovepdf'} onClick={() => setView('ilovepdf')} />
            <SidebarItem icon={<FileText className="size-4" />} label="Adobe Acrobat" active={currentView === 'adobe-acrobat'} onClick={() => setView('adobe-acrobat')} />
            <SidebarItem icon={<PenTool className="size-4" />} label="Illustrator" active={currentView === 'illustrator'} onClick={() => setView('illustrator')} />
            <SidebarItem icon={<ImageHash className="size-4" />} label="Photoshop" active={currentView === 'photoshop'} onClick={() => setView('photoshop')} />
          </IntegrationGroup>
        </SidebarSection>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-0.5">

        <SidebarItem
          icon={<Layers className="size-4" />}
          label="Subcuentas"
        />
        <SidebarItem icon={<CreditCard className="size-4" />} label="Facturación" />
        <SidebarItem
          icon={<Navigation className="size-4" />}
          label="Disponibilidad"
        />
      </SidebarFooter>
    </Sidebar>
  );
}
