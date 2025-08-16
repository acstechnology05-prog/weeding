import { supabase } from '../lib/supabase';
import type { WeddingEvent, EventTicket } from '../lib/supabase';

export interface CreateEventData {
  eventType: 'wedding' | 'haldi' | 'sangeet' | 'mehendi' | 'reception' | 'engagement';
  title: string;
  description?: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  city: string;
  state: string;
  ticketPrice: number;
  maxCapacity: number;
  eventImages: string[];
}

class EventService {
  async createEvent(organizerId: string, eventData: CreateEventData): Promise<WeddingEvent> {
    try {
      // Create event in draft status
      const { data: event, error: eventError } = await supabase
        .from('wedding_events')
        .insert({
          organizer_id: organizerId,
          event_type: eventData.eventType,
          title: eventData.title,
          description: eventData.description,
          event_date: eventData.eventDate,
          event_time: eventData.eventTime,
          venue_name: eventData.venueName,
          venue_address: eventData.venueAddress,
          city: eventData.city,
          state: eventData.state,
          ticket_price: eventData.ticketPrice,
          max_capacity: eventData.maxCapacity,
          event_images: eventData.eventImages,
          status: 'draft',
        })
        .select('*')
        .single();

      if (eventError) throw eventError;

      // Create approval request
      await this.createEventRequest(event.id, organizerId, 'create_event', eventData);

      return event;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  }

  async submitEventForApproval(eventId: string, organizerId: string): Promise<void> {
    try {
      // Update event status to pending approval
      const { error: updateError } = await supabase
        .from('wedding_events')
        .update({ status: 'pending_approval' })
        .eq('id', eventId)
        .eq('organizer_id', organizerId);

      if (updateError) throw updateError;

      // Send notification to organizer
      await supabase
        .from('notifications')
        .insert({
          user_id: organizerId,
          type: 'event',
          title: 'Event Submitted for Approval',
          message: 'Your wedding event has been submitted for admin approval. You will receive an email confirmation once approved.',
          data: { event_id: eventId },
        });

    } catch (error) {
      console.error('Submit event for approval error:', error);
      throw error;
    }
  }

  async getApprovedEvents(filters?: {
    eventType?: string;
    city?: string;
    state?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<WeddingEvent[]> {
    try {
      let query = supabase
        .from('wedding_events')
        .select(`
          *,
          organizer:user_profiles!organizer_id(full_name, profile_photos)
        `)
        .eq('status', 'approved')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true });

      if (filters?.eventType) {
        query = query.eq('event_type', filters.eventType);
      }

      if (filters?.city) {
        query = query.eq('city', filters.city);
      }

      if (filters?.state) {
        query = query.eq('state', filters.state);
      }

      if (filters?.dateFrom) {
        query = query.gte('event_date', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('event_date', filters.dateTo);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Get approved events error:', error);
      throw error;
    }
  }

  async getUserEvents(organizerId: string): Promise<WeddingEvent[]> {
    try {
      const { data, error } = await supabase
        .from('wedding_events')
        .select('*')
        .eq('organizer_id', organizerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user events error:', error);
      throw error;
    }
  }

  async bookTicket(eventId: string, buyerId: string, quantity: number): Promise<EventTicket> {
    try {
      // Get event details
      const { data: event, error: eventError } = await supabase
        .from('wedding_events')
        .select('*')
        .eq('id', eventId)
        .eq('status', 'approved')
        .single();

      if (eventError || !event) throw new Error('Event not found or not approved');

      // Check availability
      if (event.current_bookings + quantity > event.max_capacity) {
        throw new Error('Not enough tickets available');
      }

      const totalAmount = event.ticket_price * quantity;

      // Create ticket booking
      const { data: ticket, error: ticketError } = await supabase
        .from('event_tickets')
        .insert({
          event_id: eventId,
          buyer_id: buyerId,
          ticket_quantity: quantity,
          total_amount: totalAmount,
          booking_status: 'pending',
          qr_code: this.generateQRCode(eventId, buyerId),
        })
        .select(`
          *,
          event:wedding_events(*),
          buyer:user_profiles!buyer_id(*)
        `)
        .single();

      if (ticketError) throw ticketError;

      // Send booking confirmation notification
      await supabase
        .from('notifications')
        .insert({
          user_id: buyerId,
          type: 'event',
          title: 'Ticket Booking Confirmed! 🎟️',
          message: `Your tickets for ${event.title} have been booked successfully. Total: ₹${totalAmount}`,
          data: { ticket_id: ticket.id, event_id: eventId },
        });

      return ticket;
    } catch (error) {
      console.error('Book ticket error:', error);
      throw error;
    }
  }

  async getUserTickets(buyerId: string): Promise<EventTicket[]> {
    try {
      const { data, error } = await supabase
        .from('event_tickets')
        .select(`
          *,
          event:wedding_events(*),
          buyer:user_profiles!buyer_id(*)
        `)
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user tickets error:', error);
      throw error;
    }
  }

  private async createEventRequest(eventId: string, requesterId: string, requestType: string, requestData: any) {
    try {
      await supabase
        .from('event_requests')
        .insert({
          event_id: eventId,
          requester_id: requesterId,
          request_type: requestType,
          request_data: requestData,
          status: 'pending',
        });
    } catch (error) {
      console.error('Create event request error:', error);
    }
  }

  private generateQRCode(eventId: string, buyerId: string): string {
    // Generate a unique QR code string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `VB-${eventId.substring(0, 8)}-${buyerId.substring(0, 8)}-${timestamp}-${randomString}`;
  }

  async cancelTicket(ticketId: string, buyerId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('event_tickets')
        .update({ booking_status: 'cancelled' })
        .eq('id', ticketId)
        .eq('buyer_id', buyerId);

      if (error) throw error;

      // Send cancellation notification
      await supabase
        .from('notifications')
        .insert({
          user_id: buyerId,
          type: 'event',
          title: 'Ticket Cancelled',
          message: 'Your ticket has been cancelled successfully. Refund will be processed within 3-5 business days.',
          data: { ticket_id: ticketId },
        });
    } catch (error) {
      console.error('Cancel ticket error:', error);
      throw error;
    }
  }

  async getEventAnalytics(eventId: string, organizerId: string) {
    try {
      const { data: event, error: eventError } = await supabase
        .from('wedding_events')
        .select('*')
        .eq('id', eventId)
        .eq('organizer_id', organizerId)
        .single();

      if (eventError) throw eventError;

      const { data: tickets, error: ticketsError } = await supabase
        .from('event_tickets')
        .select('*')
        .eq('event_id', eventId);

      if (ticketsError) throw ticketsError;

      const totalRevenue = tickets?.reduce((sum, ticket) => 
        ticket.booking_status === 'confirmed' ? sum + ticket.total_amount : sum, 0
      ) || 0;

      const confirmedTickets = tickets?.filter(t => t.booking_status === 'confirmed').length || 0;

      return {
        event,
        totalTickets: tickets?.length || 0,
        confirmedTickets,
        totalRevenue,
        occupancyRate: (confirmedTickets / event.max_capacity) * 100,
      };
    } catch (error) {
      console.error('Get event analytics error:', error);
      throw error;
    }
  }
}

export const eventService = new EventService();