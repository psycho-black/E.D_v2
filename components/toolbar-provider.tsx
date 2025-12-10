'use client';

import { useToolbarSetup } from '@/lib/toolbar-setup';

/**
 * Toolbar Provider Component
 * Initializes the 21st Extension Toolbar in development mode
 * Must be a client component to use useEffect
 */
export function ToolbarProvider() {
  useToolbarSetup();
  return null; // This component doesn't render anything
}
