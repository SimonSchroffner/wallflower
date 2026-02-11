/**
 * Display app entry point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

// Note: StrictMode is disabled for PixiJS WebGL apps to prevent
// double-mount issues during development. PixiJS requires careful
// initialization/cleanup that doesn't work well with React's
// intentional double-mounting in development.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);
