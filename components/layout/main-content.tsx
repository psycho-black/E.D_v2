"use client";

import { useViewStore } from "@/store/view-store";
import { TaskHeader } from "@/components/task/header/task-header";
import { TaskBoard } from "@/components/task/board/task-board";
import { PatientBoard } from "@/components/patient/patient-board";
import { WebviewContainer } from "@/components/integrations/webview-container";
import { DashboardView } from "@/components/dashboard/dashboard-view";

import { MotionWrapper } from "@/components/ui/motion-wrapper";

// Define integrations config
const INTEGRATIONS = [
  { id: 'whatsapp', url: 'https://web.whatsapp.com', title: 'WhatsApp' },
  { id: 'gmail', url: 'https://mail.google.com', title: 'Gmail' },
  { id: 'outlook', url: 'https://outlook.live.com/mail/0/', title: 'Outlook' },
  { id: 'ilovepdf', url: 'https://www.ilovepdf.com/es', title: 'iLovePDF' },
  { id: 'adobe-acrobat', url: 'https://acrobat.adobe.com', title: 'Adobe Acrobat' },
  { id: 'sheets', url: 'https://docs.google.com/spreadsheets', title: 'Google Sheets' },
  { id: 'docs', url: 'https://docs.google.com/document', title: 'Google Docs' },
  { id: 'drive', url: 'https://drive.google.com', title: 'Google Drive' },
  { id: 'gemini', url: 'https://gemini.google.com', title: 'Google Gemini' },
  { id: 'tasks', url: 'https://tasks.google.com', title: 'Google Tasks' },
  { id: 'keep', url: 'https://keep.google.com', title: 'Google Keep' },
  { id: 'teams', url: 'https://teams.microsoft.com', title: 'Microsoft Teams' },
  { id: 'word', url: 'https://www.office.com/launch/word', title: 'Microsoft Word' },
  { id: 'excel', url: 'https://www.office.com/launch/excel', title: 'Microsoft Excel' },
  { id: 'onenote', url: 'https://www.onenote.com', title: 'Microsoft OneNote' },
  { id: 'bookings', url: 'https://outlook.office.com/bookings', title: 'Microsoft Bookings' },
  { id: 'contacts', url: 'https://contacts.google.com', title: 'Google Contacts' },
  { id: 'illustrator', url: 'https://creativecloud.adobe.com/cc/illustrator', title: 'Adobe Illustrator' },
  { id: 'photoshop', url: 'https://creativecloud.adobe.com/cc/photoshop', title: 'Adobe Photoshop' },
  { id: 'translate', url: 'https://translate.google.com', title: 'Google Translate' },
  { id: 'calendar', url: 'https://calendar.google.com', title: 'Google Calendar' },
  { id: 'slides', url: 'https://docs.google.com/presentation', title: 'Google Slides' },
  { id: 'forms', url: 'https://docs.google.com/forms', title: 'Google Forms' },
  { id: 'photos', url: 'https://photos.google.com', title: 'Google Photos' }
];

export function MainContent() {
  const { currentView } = useViewStore();

  const getTitle = () => {
    switch (currentView) {
      case "dashboard": return "Dashboard";
      case "patients": return "Pacientes";
      case "appointments": return "Citas";
      case "documents": return "Expedientes";
      case "messages": return "Avisos";
      default:
        const integration = INTEGRATIONS.find(i => i.id === currentView);
        return integration ? integration.title : "EcoDigital";
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "patients":
        return <PatientBoard />;
      case "dashboard":
        return <DashboardView />;
      case "appointments":
        return <div className="p-10 text-muted-foreground">Módulo de Citas (Próximamente)</div>;
      case "documents":
        return <div className="p-10 text-muted-foreground">Expedientes Digitales (Próximamente)</div>;
      default:
        // Core view default, shouldn't really happen for integrated views due to logic below
        // But for safety:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <TaskHeader title={getTitle()} />
      <main className="flex-1 w-full h-full overflow-hidden bg-transparent relative">
        {/* Standard Views */}
        <div className={`w-full h-full overflow-hidden bg-background/50 backdrop-blur-xl rounded-tl-2xl border-l border-t border-white/5 ${['dashboard', 'patients', 'appointments', 'documents', 'messages'].includes(currentView) ? 'block' : 'hidden'}`}>
          <MotionWrapper>
            {renderContent()}
          </MotionWrapper>
        </div>

        {/* Integration Webviews */}
        {INTEGRATIONS.map((app) => (
          <div key={app.id} className={`w-full h-full bg-white ${currentView === app.id ? 'block' : 'hidden'}`}>
            <WebviewContainer
              id={`${app.id}-view`}
              src={app.url}
              isActive={currentView === app.id} // @ts-ignore
            />
          </div>
        ))}
      </main>
    </div>
  );
}

