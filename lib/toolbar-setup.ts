'use client';

/**
 * Toolbar Setup Module
 * Initializes the 21st Extension Toolbar in development mode
 * For Next.js with React
 */

import { useEffect } from 'react';
import { initToolbar } from '@21st-extension/toolbar';

// Define toolbar configuration
const stagewiseConfig = {
  plugins: [],
};

/**
 * Initialize the toolbar when your app starts
 * React Hook approach for Next.js client components
 */
export function useToolbarSetup() {
  useEffect(() => {
    // Only initialize once and only in development mode
    if (process.env.NODE_ENV === 'development') {
      try {
        initToolbar(stagewiseConfig);
        if (typeof window !== 'undefined') {
          console.log('✓ Stagewise toolbar initialized successfully');
        }
      } catch (error) {
        console.warn('⚠ Failed to initialize Stagewise toolbar:', error);
      }
    }
  }, []);
}

/**
 * Alternative: Framework-agnostic function for server-side initialization
 */
export function setupStagewise() {
  if (process.env.NODE_ENV === 'development') {
    try {
      initToolbar(stagewiseConfig);
      console.log('✓ Stagewise toolbar initialized successfully');
    } catch (error) {
      console.warn('⚠ Failed to initialize Stagewise toolbar:', error);
    }
  }
}
