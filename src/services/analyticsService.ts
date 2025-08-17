declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface UserProperties {
  user_id?: string;
  age_group?: string;
  gender?: string;
  location?: string;
  subscription_type?: string;
}

class AnalyticsService {
  private isInitialized = false;
  private trackingId = import.meta.env.VITE_GA_TRACKING_ID;

  // Initialize Google Analytics
  initializeGA(): void {
    if (this.isInitialized || !this.trackingId) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.trackingId, {
      page_title: 'Vivah Bandhan',
      page_location: window.location.href,
    });

    this.isInitialized = true;
  }

  // Track page views
  trackPageView(pagePath: string, pageTitle?: string): void {
    if (!this.isInitialized) return;

    window.gtag('config', this.trackingId, {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) return;

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters,
    });
  }

  // Track user properties
  setUserProperties(properties: UserProperties): void {
    if (!this.isInitialized) return;

    window.gtag('config', this.trackingId, {
      custom_map: properties,
    });
  }

  // Track matchmaking events
  trackMatchEvent(action: 'view_profile' | 'like_profile' | 'dislike_profile' | 'mutual_match', profileId: string): void {
    this.trackEvent({
      action,
      category: 'Matchmaking',
      label: profileId,
      custom_parameters: {
        profile_id: profileId,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Track wedding event interactions
  trackWeddingEvent(action: 'view_event' | 'book_ticket' | 'create_event', eventId: string, eventType?: string): void {
    this.trackEvent({
      action,
      category: 'Wedding Events',
      label: eventId,
      custom_parameters: {
        event_id: eventId,
        event_type: eventType,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Track chat interactions
  trackChatEvent(action: 'start_chat' | 'send_message' | 'video_call', chatRoomId: string): void {
    this.trackEvent({
      action,
      category: 'Communication',
      label: chatRoomId,
      custom_parameters: {
        chat_room_id: chatRoomId,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Track cultural content engagement
  trackCulturalEvent(action: 'view_ritual' | 'try_virtual_dress' | 'learn_tradition', contentId: string): void {
    this.trackEvent({
      action,
      category: 'Cultural Content',
      label: contentId,
      custom_parameters: {
        content_id: contentId,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Track conversion events
  trackConversion(type: 'signup' | 'profile_complete' | 'first_match' | 'first_message' | 'ticket_purchase', value?: number): void {
    this.trackEvent({
      action: 'conversion',
      category: 'Conversions',
      label: type,
      value,
      custom_parameters: {
        conversion_type: type,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Track user engagement
  trackEngagement(action: 'session_start' | 'session_end' | 'feature_use', duration?: number): void {
    this.trackEvent({
      action,
      category: 'Engagement',
      value: duration,
      custom_parameters: {
        session_duration: duration,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Track errors
  trackError(error: string, location: string): void {
    this.trackEvent({
      action: 'error',
      category: 'Errors',
      label: `${location}: ${error}`,
      custom_parameters: {
        error_message: error,
        error_location: location,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // E-commerce tracking for ticket purchases
  trackPurchase(transactionId: string, items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>, totalValue: number): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: totalValue,
      currency: 'INR',
      items: items.map(item => ({
        item_id: item.item_id,
        item_name: item.item_name,
        item_category: item.category,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }

  // Track form submissions
  trackFormSubmission(formName: string, success: boolean): void {
    this.trackEvent({
      action: success ? 'form_submit_success' : 'form_submit_error',
      category: 'Forms',
      label: formName,
      custom_parameters: {
        form_name: formName,
        success,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

export const analyticsService = new AnalyticsService();