export interface FileDialogResult {
    canceled: boolean;
    filePaths: string[];
}

export const DesktopService = {
    async openFileDialog(): Promise<FileDialogResult | null> {
        if (typeof window !== 'undefined' && window.electron) {
            return await window.electron.ipcRenderer.invoke('dialog:openFile');
        }
        console.warn("DesktopService: Not running in Electron");
        return null;
    },

    async readFile(path: string): Promise<string | null> {
        if (typeof window !== 'undefined' && window.electron) {
            return await window.electron.ipcRenderer.invoke('fs:readFile', path);
        }
        return null;
    },

    async showNotification(title: string, body: string): Promise<boolean> {
        if (typeof window !== 'undefined' && window.electron) {
            return await window.electron.ipcRenderer.invoke('notification:show', { title, body });
        }
        // Fallback to browser notification if generic
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, { body });
            return true;
        }
        return false;
    }
};

// Add types to window
declare global {
    interface Window {
        electron: {
            ipcRenderer: {
                send: (channel: string, data: any) => void;
                on: (channel: string, func: (...args: any[]) => void) => void;
                invoke: (channel: string, data?: any) => Promise<any>;
            };
        };
    }
}
