import posthog from 'posthog-js';

// Extend window interface for Microsoft Clarity
declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

class AnalyticsManager {
  private isPostHogInitialized = false;
  private isClarityInitialized = false;

  /**
   * Initialize Microsoft Clarity Heatmaps and Session Recording
   */
  public initClarity(projectId?: string) {
    if (this.isClarityInitialized) return;

    const clarityId =
      projectId ||
      (import.meta.env.VITE_CLARITY_PROJECT_ID as string) ||
      ''; // Project ID placeholder or configured value

    if (!clarityId) {
      console.info('[Analytics: Clarity] Project ID not configured; tracking disabled.');
      return;
    }

    try {
      (function (c: Window, l: Document, a: string, r: string, i: string, t?: HTMLScriptElement, y?: HTMLElement) {
        c[a] =
          c[a] ||
          function () {
            ((c[a] as unknown as { q: unknown[] }).q = (c[a] as unknown as { q: unknown[] }).q || []).push(arguments);
          };
        t = l.createElement(r) as HTMLScriptElement;
        t.async = true;
        t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0] as HTMLElement;
        y?.parentNode?.insertBefore(t, y);
      })(window, document, 'clarity', 'script', clarityId);

      this.isClarityInitialized = true;
      console.info(`[Analytics: Clarity] Initialized successfully with project: ${clarityId}`);
    } catch (err) {
      console.warn('[Analytics: Clarity] Failed to initialize:', err);
    }
  }

  /**
   * Initialize PostHog Product & Behavior Analytics
   */
  public initPostHog(apiKey?: string, apiHost?: string) {
    if (this.isPostHogInitialized) return;

    const key = apiKey || (import.meta.env.VITE_POSTHOG_KEY as string);
    const host =
      apiHost ||
      (import.meta.env.VITE_POSTHOG_HOST as string) ||
      'https://us.i.posthog.com';

    if (!key) {
      console.info('[Analytics: PostHog] Key not configured; events will log to console in dev mode.');
      return;
    }

    try {
      posthog.init(key, {
        api_host: host,
        person_profiles: 'identified_only',
        autocapture: true,
        capture_pageview: true,
        capture_pageleave: true,
        loaded: () => {
          this.isPostHogInitialized = true;
          console.info('[Analytics: PostHog] Initialized successfully.');
        },
      });
    } catch (err) {
      console.warn('[Analytics: PostHog] Failed to initialize:', err);
    }
  }

  /**
   * Track high-intent user interactions across discovery, quotes, claims, and payouts
   */
  public trackEvent(eventName: string, properties: Record<string, unknown> = {}) {
    const enrichedProperties = {
      ...properties,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer || 'direct',
    };

    if (this.isPostHogInitialized) {
      posthog.capture(eventName, enrichedProperties);
    } else {
      // Graceful local debug logging
      console.debug(`[Analytics Event] ${eventName}:`, enrichedProperties);
    }

    // Pass custom event to Clarity if available
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', eventName);
    }
  }

  /**
   * Identify current user for retention and cohort analysis
   */
  public identify(userId: string, userProperties: Record<string, unknown> = {}) {
    if (this.isPostHogInitialized) {
      posthog.identify(userId, userProperties);
    }
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('set', 'userId', userId);
    }
  }

  /**
   * Track virtual page views for SPA route transitions
   */
  public trackPageView(path?: string) {
    const pagePath = path || window.location.pathname;
    if (this.isPostHogInitialized) {
      posthog.capture('$pageview', { $current_url: window.location.href, path: pagePath });
    }
  }

  public isConfigured() {
    return {
      clarity: this.isClarityInitialized,
      posthog: this.isPostHogInitialized,
      clarityKeyConfigured: Boolean(import.meta.env.VITE_CLARITY_PROJECT_ID || (typeof window !== 'undefined' && (window as unknown as { __CLARITY_ID?: string }).__CLARITY_ID)),
      posthogKeyConfigured: Boolean(import.meta.env.VITE_POSTHOG_KEY),
    };
  }

  /**
   * Dynamically reconfigure or apply keys from settings
   */
  public configure(config: { clarityId?: string; posthogKey?: string; posthogHost?: string }) {
    if (config.clarityId) {
      if (typeof window !== 'undefined') {
        (window as unknown as { __CLARITY_ID?: string }).__CLARITY_ID = config.clarityId;
      }
      this.initClarity(config.clarityId);
    }
    if (config.posthogKey) {
      this.initPostHog(config.posthogKey, config.posthogHost);
    }
  }
}

export const analytics = new AnalyticsManager();
