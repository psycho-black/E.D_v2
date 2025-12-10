import { TaskSidebar } from '@/components/task/sidebar/task-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MainContent } from '@/components/layout/main-content';

export default function Home() {
  return (
    <div className="h-screen w-full flex overflow-hidden">
      <SidebarProvider className="w-full h-full">
        <TaskSidebar />
        <MainContent />
      </SidebarProvider>
    </div>
  );
}
