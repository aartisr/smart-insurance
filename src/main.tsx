import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { analytics } from './lib/analytics.ts';

// Initialize Microsoft Clarity & PostHog Analytics
analytics.initClarity();
analytics.initPostHog();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

