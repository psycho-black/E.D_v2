import { create } from 'zustand';

type View = 'dashboard' | 'patients' | 'appointments' | 'documents' | 'messages'
  | 'whatsapp' | 'gmail' | 'ilovepdf' | 'adobe-acrobat' | 'sheets' | 'docs' | 'drive' | 'outlook' | 'gemini' | 'tasks' | 'keep'
  | 'teams' | 'word' | 'excel' | 'onenote' | 'bookings' | 'contacts' | 'illustrator' | 'photoshop' | 'translate' | 'calendar' | 'slides' | 'forms' | 'photos';

interface ViewState {
  currentView: View;
  setView: (view: View) => void;
  notifications: number;
  setNotifications: (count: number) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: 'dashboard',
  setView: (view) => set({ currentView: view }),
  notifications: 3,
  setNotifications: (count) => set({ notifications: count }),
}));
