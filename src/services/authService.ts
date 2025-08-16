import { supabase } from '../lib/supabase';
import type { UserProfile } from '../lib/supabase';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  religion?: string;
  caste?: string;
  education?: string;
  profession?: string;
  locationCity?: string;
  locationState?: string;
  hobbies: string[];
  interests: string[];
  bio?: string;
}

export interface AadhaarVerificationData {
  aadhaarNumber: string;
  otp: string;
}

class AuthService {
  async signUp(data: SignUpData) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          phone_number: data.phoneNumber,
          full_name: data.fullName,
          date_of_birth: data.dateOfBirth,
          gender: data.gender,
          religion: data.religion,
          caste: data.caste,
          education: data.education,
          profession: data.profession,
          location_city: data.locationCity,
          location_state: data.locationState,
          hobbies: data.hobbies,
          interests: data.interests,
          bio: data.bio,
        });

      if (profileError) throw profileError;

      return { user: authData.user, session: authData.session };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async verifyAadhaar(aadhaarNumber: string, phoneNumber: string) {
    try {
      // Simulate Aadhaar API call
      // In production, integrate with UIDAI API
      const response = await fetch('/api/verify-aadhaar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aadhaar_number: aadhaarNumber,
          phone_number: phoneNumber,
        }),
      });

      if (!response.ok) throw new Error('Aadhaar verification failed');
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Aadhaar verification error:', error);
      throw error;
    }
  }

  async confirmAadhaarOTP(aadhaarNumber: string, otp: string, userId: string) {
    try {
      // Simulate OTP verification
      // In production, verify with UIDAI API
      const response = await fetch('/api/confirm-aadhaar-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aadhaar_number: aadhaarNumber,
          otp: otp,
        }),
      });

      if (!response.ok) throw new Error('OTP verification failed');

      // Update user profile with verified Aadhaar
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          aadhaar_number: aadhaarNumber,
          aadhaar_verified: true,
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Aadhaar OTP confirmation error:', error);
      throw error;
    }
  }

  async sendPhoneOTP(phoneNumber: string) {
    try {
      // Simulate SMS OTP
      // In production, integrate with SMS service
      const response = await fetch('/api/send-phone-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
        }),
      });

      if (!response.ok) throw new Error('Failed to send OTP');
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Send phone OTP error:', error);
      throw error;
    }
  }

  async verifyPhoneOTP(phoneNumber: string, otp: string, userId: string) {
    try {
      // Simulate OTP verification
      const response = await fetch('/api/verify-phone-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          otp: otp,
        }),
      });

      if (!response.ok) throw new Error('Phone OTP verification failed');

      // Update user profile
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          phone_verified: true,
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Phone OTP verification error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();