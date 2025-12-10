import React, { useEffect, useRef, useState } from "react";
import { useViewStore } from "@/store/view-store";
import { Plus, Minus } from "lucide-react";

interface WebviewContainerProps {
    id: string;
    src: string;
    userAgent?: string;
    isActive: boolean;
}

export function WebviewContainer({ id, src, userAgent, isActive }: WebviewContainerProps) {
    const webviewRef = useRef<any>(null); // Webview element is dynamic
    const [zoom, setZoom] = useState(0.9);

    const handleZoom = (delta: number) => {
        const newZoom = Math.min(Math.max(zoom + delta, 0.5), 2.0); // Limit 50% to 200%
        setZoom(newZoom);
        if (webviewRef.current) {
            // Electron webview method
            try {
                webviewRef.current.setZoomFactor(newZoom);
            } catch (e) {
                console.error("Zoom error:", e);
            }
        }
    };

    // Sync initial zoom
    useEffect(() => {
        if (isActive && webviewRef.current) {
            try {
                webviewRef.current.setZoomFactor(zoom);
            } catch (e) { }
        }
    }, [isActive, zoom]);

    return (
        <div
            className={`w-full h-full flex flex-col relative ${isActive ? "flex" : "hidden"}`}
            style={{ display: isActive ? "flex" : "none" }}
        >
            {/* 
          @ts-ignore: <webview> is an Electron-specific tag. 
      */}
            <webview
                ref={webviewRef}
                id={id}
                src={src}
                useragent={userAgent || "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"}
                style={{ width: "100%", height: "100%", border: "none" }}
                webpreferences="contextIsolation=true, plugins=true, nodeIntegration=false, spellcheck=true"
                partition="persist:main"
                {...({ allowpopups: "true" } as any)}
            ></webview>

            {/* Floating Glass Zoom Control */}
            <div className="absolute bottom-6 right-6 z-50 flex items-center bg-white/80 dark:bg-black/50 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-full shadow-2xl overflow-hidden transition-all hover:bg-white dark:hover:bg-black/60">
                <button
                    onClick={() => handleZoom(-0.1)}
                    className="p-3 hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/20 transition-colors border-r border-black/10 dark:border-white/10 text-black dark:text-white"
                    title="Reducir Zoom"
                >
                    <Minus size={18} />
                </button>
                <button
                    onClick={() => handleZoom(0.1)}
                    className="p-3 hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/20 transition-colors text-black dark:text-white"
                    title="Aumentar Zoom"
                >
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );
}
