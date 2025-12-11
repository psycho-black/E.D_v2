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
  MessageCircle, Sparkles, HardDrive, Table, MonitorPlay, CheckSquare, StickyNote, UserSquare, FileQuestion, Image as ImageHash, Languages, Book, PenTool, Pin, Settings, HelpCircle as HelpCircleIcon, Cloud, Zap, Heart
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
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  showPin?: boolean;
}

function SidebarItem({ icon, label, badge, active, onClick, isFavorite, onToggleFavorite, showPin }: SidebarItemProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "w-full justify-start px-2 py-2 h-auto text-sm transition-all group relative",
        active
          ? "bg-white/10 text-white font-medium"
          : "text-white/70 hover:bg-white/5 hover:text-white",
        isCollapsed ? "justify-center px-0" : "justify-between"
      )}
      title={isCollapsed ? label : undefined}
    >
      <div className={cn("flex items-center gap-3", isCollapsed && "justify-center gap-0")}>
        <div className="h-5 w-5 flex items-center justify-center shrink-0">
          {icon}
        </div>
        {!isCollapsed && <span>{label}</span>}
      </div>
      {!isCollapsed && (
        <div className="flex items-center gap-1">
          {badge && (
            <div className="bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
              {badge}
            </div>
          )}
          {showPin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.();
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pin className={cn(
                "size-3 transition-colors",
                isFavorite ? "text-white/70 fill-white/70" : "text-white/40 hover:text-white/70"
              )} />
            </button>
          )}
        </div>
      )}
      {isCollapsed && badge && (
        <div className="absolute top-1 right-1 size-2 bg-red-500 rounded-full" />
      )}
      {isCollapsed && isFavorite && (
        <div className="absolute top-1 right-1 size-2 bg-white/50 rounded-full" />
      )}
    </Button>
  );
}

function SidebarSeparator() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className={cn(
      "my-3 border-t border-white/10",
      isCollapsed && "my-2"
    )} />
  );
}

export function TaskSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { currentView, setView, notifications, setNotifications } = useViewStore();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  // State for favorites
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());

  // Toggle favorite
  const toggleFavorite = (itemLabel: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemLabel)) {
        newFavorites.delete(itemLabel);
      } else {
        newFavorites.add(itemLabel);
      }
      return newFavorites;
    });
  };

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
    <Sidebar 
      collapsible="icon" 
      {...props}
      onMouseEnter={() => isCollapsed && toggleSidebar()}
      onMouseLeave={() => !isCollapsed && toggleSidebar()}
    >
      <SidebarHeader className="pb-0">
        <div className="px-4 pt-4 pb-0 h-10" />
      </SidebarHeader>

      <SidebarContent className="p-4">
        {/* Sección principal: Dashboard */}
        <div className="space-y-0.5">
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=S5D5w5vFLhYp&format=png&size=32" // Dashboard Layout
                alt="Dashboard"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Dashboard"
            active={currentView === 'dashboard'}
            onClick={() => setView('dashboard')}
          />
        </div>

        <SidebarSeparator />

        {/* Navegación principal de la app, también con Icons8 Fluency */}
        <div className="space-y-0.5">
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=r8kHwiV6nVEd&format=png&size=32" // Cloud Storage
                alt="Cloud"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Cloud"
            active={currentView === 'cloud'}
            onClick={() => setView('cloud')}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=trsCZxEJArXb&format=png&size=32" // Doctors Bag
                alt="Pacientes"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Pacientes"
            active={currentView === 'patients'}
            onClick={() => setView('patients')}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=WpQIVxfhhzqt&format=png&size=32" // Calendar
                alt="Calendario"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Calendario"
            active={currentView === 'calendar'}
            onClick={() => setView('calendar')}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=Us0gLlbSYM9k&format=png&size=32" // Documents Folder
                alt="Expedientes"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Expedientes"
            active={currentView === 'documents'}
            onClick={() => setView('documents')}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=zFFyM4njOMSz&format=png&size=32" // Hospital Folder
                alt="Gestión Médica"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Gestión Médica"
            active={currentView === 'medical-management'}
            onClick={() => setView('medical-management')}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=269UT6k4i79F&format=png&size=32" // Automation
                alt="Automatizaciones"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Automatizaciones"
            active={currentView === 'automations'}
            onClick={() => setView('automations')}
          />
        </div>

        <SidebarSeparator />

        {/* Favoritos */}
        {favorites.size > 0 && (
          <>
            <div className="space-y-0.5">
              {Array.from(favorites).map(fav => {
                // Map favorite labels back to their components
                const favMap: Record<string, { icon: React.ReactNode; view: string }> = {
                  'Cloud': { icon: <Cloud className="size-4" />, view: 'cloud' },
                  'Pacientes': { icon: <Users className="size-4" />, view: 'patients' },
                  'Calendario': { icon: <Calendar className="size-4" />, view: 'calendar' },
                  'Expedientes': { icon: <Folder className="size-4" />, view: 'documents' },
                  'Gestión Médica': { icon: <Heart className="size-4" />, view: 'medical-management' },
                  'Automatizaciones': { icon: <Zap className="size-4" />, view: 'automations' }
                };
                
                const item = favMap[fav];
                if (!item) return null;
                
                return (
                  <SidebarItem
                    key={fav}
                    icon={item.icon}
                    label={fav}
                    active={currentView === item.view}
                    onClick={() => setView(item.view as any)}
                    isFavorite={true}
                    onToggleFavorite={() => toggleFavorite(fav)}
                    showPin={true}
                  />
                );
              })}
            </div>
            <SidebarSeparator />
          </>
        )}

        {/* Integraciones de terceros con iconos de marca (Icons8 Fluency via MCP) */}
        <div className="space-y-0.5">
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=AltfLkFSP7XN&format=png&size=32"
                alt="WhatsApp"
                className="h-5 w-5 object-contain"
              />
            )}
            label="WhatsApp"
            active={currentView === 'whatsapp'}
            onClick={() => setView('whatsapp')}
            isFavorite={favorites.has('WhatsApp')}
            onToggleFavorite={() => toggleFavorite('WhatsApp')}
            showPin={true}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=ho8QlOYvMuG3&format=png&size=32"
                alt="Gmail"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Gmail"
            active={currentView === 'gmail'}
            onClick={() => setView('gmail')}
            isFavorite={favorites.has('Gmail')}
            onToggleFavorite={() => toggleFavorite('Gmail')}
            showPin={true}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=ut6gQeo5pNqf&format=png&size=32"
                alt="Outlook"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Outlook"
            active={currentView === 'outlook'}
            onClick={() => setView('outlook')}
            isFavorite={favorites.has('Outlook')}
            onToggleFavorite={() => toggleFavorite('Outlook')}
            showPin={true}
          />
          {/* Google Gemini: si definimos una integración específica más adelante, aquí podemos
              usar también su icono de Icons8. De momento mantenemos la entrada reservada. */}
        </div>

        <SidebarSeparator />

        <div className="space-y-0.5">
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=eKDChMKt75eu&format=png&size=32"
                alt="Google Drive"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Drive"
            active={currentView === 'drive'}
            onClick={() => setView('drive')}
            isFavorite={favorites.has('Drive')}
            onToggleFavorite={() => toggleFavorite('Drive')}
            showPin={true}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=hHRwFYjODaR4&format=png&size=32"
                alt="Google Docs"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Docs"
            active={currentView === 'docs'}
            onClick={() => setView('docs')}
            isFavorite={favorites.has('Docs')}
            onToggleFavorite={() => toggleFavorite('Docs')}
            showPin={true}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=qrAVeBIrsjod&format=png&size=32"
                alt="Google Sheets"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Sheets"
            active={currentView === 'sheets'}
            onClick={() => setView('sheets')}
            isFavorite={favorites.has('Sheets')}
            onToggleFavorite={() => toggleFavorite('Sheets')}
            showPin={true}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=joSAjc9l7dOp&format=png&size=32"
                alt="Google Slides"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Slides"
            active={currentView === 'slides'}
            onClick={() => setView('slides')}
            isFavorite={favorites.has('Slides')}
            onToggleFavorite={() => toggleFavorite('Slides')}
            showPin={true}
          />
        </div>

        <SidebarSeparator />

        <div className="space-y-0.5">
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=zQ92KI7XjZgR&format=png&size=32"
                alt="Microsoft Teams"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Teams"
            active={currentView === 'teams'}
            onClick={() => setView('teams')}
            isFavorite={favorites.has('Teams')}
            onToggleFavorite={() => toggleFavorite('Teams')}
            showPin={true}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=vCmmOWVBAcll&format=png&size=32"
                alt="Microsoft Word"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Word"
            active={currentView === 'word'}
            onClick={() => setView('word')}
            isFavorite={favorites.has('Word')}
            onToggleFavorite={() => toggleFavorite('Word')}
            showPin={true}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=BEMhRoRy403e&format=png&size=32"
                alt="Microsoft Excel"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Excel"
            active={currentView === 'excel'}
            onClick={() => setView('excel')}
            isFavorite={favorites.has('Excel')}
            onToggleFavorite={() => toggleFavorite('Excel')}
            showPin={true}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=yTtdbCPCXVuI&format=png&size=32"
                alt="Microsoft OneNote"
                className="h-5 w-5 object-contain"
              />
            )}
            label="OneNote"
            active={currentView === 'onenote'}
            onClick={() => setView('onenote')}
            isFavorite={favorites.has('OneNote')}
            onToggleFavorite={() => toggleFavorite('OneNote')}
            showPin={true}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=GwnRIvJgc3I6&format=png&size=32"
                alt="Microsoft Bookings"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Bookings"
            active={currentView === 'bookings'}
            onClick={() => setView('bookings')}
            isFavorite={favorites.has('Bookings')}
            onToggleFavorite={() => toggleFavorite('Bookings')}
            showPin={true}
          />
        </div>

        <SidebarSeparator />

        <div className="space-y-0.5">
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=nDjYPbVE29Us&format=png&size=32"
                alt="PDF"
                className="h-5 w-5 object-contain"
              />
            )}
            label="iLovePDF"
            active={currentView === 'ilovepdf'}
            onClick={() => setView('ilovepdf')}
            isFavorite={favorites.has('iLovePDF')}
            onToggleFavorite={() => toggleFavorite('iLovePDF')}
            showPin={true}
          />
          {/* Para Adobe Acrobat podemos usar también un icono de PDF genérico
              o buscar uno específico de Acrobat en tu colección Icons8 si lo prefieres. */}
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=nDjYPbVE29Us&format=png&size=32"
                alt="Adobe Acrobat"
                className="size-4"
              />
            )}
            label="Adobe Acrobat"
            active={currentView === 'adobe-acrobat'}
            onClick={() => setView('adobe-acrobat')}
            isFavorite={favorites.has('Adobe Acrobat')}
            onToggleFavorite={() => toggleFavorite('Adobe Acrobat')}
            showPin={true}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=QaT9iepDXQab&format=png&size=32"
                alt="Adobe Illustrator"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Illustrator"
            active={currentView === 'illustrator'}
            onClick={() => setView('illustrator')}
            isFavorite={favorites.has('Illustrator')}
            onToggleFavorite={() => toggleFavorite('Illustrator')}
            showPin={true}
          />
          <SidebarItem
            icon={(
              <img
                src="https://img.icons8.com/?id=NeNPFdj7MzXi&format=png&size=32"
                alt="Adobe Photoshop"
                className="h-5 w-5 object-contain"
              />
            )}
            label="Photoshop"
            active={currentView === 'photoshop'}
            onClick={() => setView('photoshop')}
            isFavorite={favorites.has('Photoshop')}
            onToggleFavorite={() => toggleFavorite('Photoshop')}
            showPin={true}
          />
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-0.5">
        <SidebarItem
          icon={<HelpCircleIcon className="size-4" />}
          label="Soporte"
          active={currentView === 'support'}
          onClick={() => setView('support')}
        />
        <SidebarItem 
          icon={<Settings className="size-4" />} 
          label="Ajustes"
          active={currentView === 'settings'}
          onClick={() => setView('settings')}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

// Helpers SidebarButton, SidebarSectionHover, SidebarSubGroup ya no son necesarios en esta versión revertida
