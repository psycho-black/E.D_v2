/**
 * Toolbar Setup Module
 * Initializes the 21st Extension Toolbar in development mode
 */

import { initToolbar } from '@21st-extension/toolbar';

// Define toolbar configuration
const stagewiseConfig = {
  plugins: [],
};

/**
 * Initialize the toolbar when your app starts
 * Framework-agnostic approach - call this when your app initializes
 */
export function setupStagewise() {
  // Only initialize once and only in development mode
  if (process.env.NODE_ENV === 'development') {
    try {
      initToolbar(stagewiseConfig);
      console.log('Stagewise toolbar initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize Stagewise toolbar:', error);
    }
  }
}

// Auto-initialize if this module is imported
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setupStagewise();
}
