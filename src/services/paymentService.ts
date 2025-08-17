import { loadStripe, Stripe } from '@stripe/stripe-js';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface TicketPurchase {
  eventId: string;
  quantity: number;
  totalAmount: number;
  buyerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

class PaymentService {
  private stripe: Stripe | null = null;
  private publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  // Initialize Stripe
  async initializeStripe(): Promise<Stripe | null> {
    if (this.stripe) return this.stripe;

    if (!this.publishableKey) {
      console.error('Stripe publishable key not found');
      return null;
    }

    try {
      this.stripe = await loadStripe(this.publishableKey);
      return this.stripe;
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      return null;
    }
  }

  // Create payment intent for ticket purchase
  async createPaymentIntent(purchase: TicketPurchase): Promise<PaymentIntent | null> {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: purchase.totalAmount * 100, // Convert to paise
          currency: 'inr',
          metadata: {
            event_id: purchase.eventId,
            quantity: purchase.quantity.toString(),
            buyer_name: purchase.buyerInfo.name,
            buyer_email: purchase.buyerInfo.email,
            buyer_phone: purchase.buyerInfo.phone,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const paymentIntent = await response.json();
      return paymentIntent;
    } catch (error) {
      console.error('Create payment intent error:', error);
      return null;
    }
  }

  // Confirm payment with card
  async confirmCardPayment(clientSecret: string, paymentMethod: any): Promise<{ success: boolean; error?: string }> {
    if (!this.stripe) {
      await this.initializeStripe();
    }

    if (!this.stripe) {
      return { success: false, error: 'Stripe not initialized' };
    }

    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (paymentIntent?.status === 'succeeded') {
        return { success: true };
      }

      return { success: false, error: 'Payment not completed' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Process UPI payment (India-specific)
  async processUPIPayment(clientSecret: string, upiId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.stripe) {
      await this.initializeStripe();
    }

    if (!this.stripe) {
      return { success: false, error: 'Stripe not initialized' };
    }

    try {
      const { error, paymentIntent } = await this.stripe.confirmUpiPayment(clientSecret, {
        payment_method: {
          upi: {
            vpa: upiId,
          },
        },
        return_url: `${window.location.origin}/payment-success`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Create setup intent for saving payment methods
  async createSetupIntent(customerId: string): Promise<string | null> {
    try {
      const response = await fetch('/api/create-setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create setup intent');
      }

      const { client_secret } = await response.json();
      return client_secret;
    } catch (error) {
      console.error('Create setup intent error:', error);
      return null;
    }
  }

  // Get saved payment methods
  async getPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`/api/payment-methods/${customerId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const { payment_methods } = await response.json();
      return payment_methods || [];
    } catch (error) {
      console.error('Get payment methods error:', error);
      return [];
    }
  }

  // Process refund
  async processRefund(paymentIntentId: string, amount?: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/process-refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
          amount: amount ? amount * 100 : undefined, // Convert to paise if partial refund
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process refund');
      }

      const result = await response.json();
      return { success: true };
    } catch (error: any) {
      console.error('Process refund error:', error);
      return { success: false, error: error.message };
    }
  }

  // Validate Indian payment methods
  validateUPIId(upiId: string): boolean {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return upiRegex.test(upiId);
  }

  validateIndianCard(cardNumber: string): { valid: boolean; type?: string } {
    // Remove spaces and non-digits
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    // Indian card patterns
    const patterns = {
      'RuPay': /^(60|65|81|82)/,
      'Visa': /^4/,
      'Mastercard': /^5[1-5]/,
      'American Express': /^3[47]/,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cleanNumber)) {
        return { valid: this.luhnCheck(cleanNumber), type };
      }
    }

    return { valid: false };
  }

  private luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Format currency for Indian locale
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }
}

export const paymentService = new PaymentService();