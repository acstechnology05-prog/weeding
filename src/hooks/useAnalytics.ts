import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import type { UserProfile } from '../lib/supabase';

export const useAnalytics = (userProfile?: UserProfile | null) => {
  const location = useLocation();

  // Initialize analytics on mount
  useEffect(() => {
    analyticsService.initializeGA();
  }, []);

  // Track page views
  useEffect(() => {
    analyticsService.trackPageView(location.pathname, document.title);
  }, [location]);

  // Set user properties when profile is available
  useEffect(() => {
    if (userProfile) {
      const age = userProfile.date_of_birth 
        ? new Date().getFullYear() - new Date(userProfile.date_of_birth).getFullYear()
        : undefined;

      analyticsService.setUserProperties({
        user_id: userProfile.id,
        age_group: age ? getAgeGroup(age) : undefined,
        gender: userProfile.gender,
        location: `${userProfile.location_city}, ${userProfile.location_state}`,
        subscription_type: 'free', // Update based on actual subscription
      });
    }
  }, [userProfile]);

  const getAgeGroup = (age: number): string => {
    if (age < 25) return '18-24';
    if (age < 30) return '25-29';
    if (age < 35) return '30-34';
    if (age < 40) return '35-39';
    return '40+';
  };

  return {
    trackEvent: analyticsService.trackEvent.bind(analyticsService),
    trackMatchEvent: analyticsService.trackMatchEvent.bind(analyticsService),
    trackWeddingEvent: analyticsService.trackWeddingEvent.bind(analyticsService),
    trackChatEvent: analyticsService.trackChatEvent.bind(analyticsService),
    trackCulturalEvent: analyticsService.trackCulturalEvent.bind(analyticsService),
    trackConversion: analyticsService.trackConversion.bind(analyticsService),
    trackEngagement: analyticsService.trackEngagement.bind(analyticsService),
    trackError: analyticsService.trackError.bind(analyticsService),
    trackPurchase: analyticsService.trackPurchase.bind(analyticsService),
    trackFormSubmission: analyticsService.trackFormSubmission.bind(analyticsService),
  };
};