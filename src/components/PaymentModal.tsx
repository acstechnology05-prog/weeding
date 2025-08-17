import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Shield, CheckCircle } from 'lucide-react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { paymentService } from '../services/paymentService';
import type { TicketPurchase } from '../services/paymentService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentIntentId: string) => void;
  purchase: TicketPurchase;
}

const PaymentForm: React.FC<{
  purchase: TicketPurchase;
  onSuccess: (paymentIntentId: string) => void;
  onClose: () => void;
}> = ({ purchase, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const paymentIntent = await paymentService.createPaymentIntent(purchase);
      if (paymentIntent) {
        setClientSecret(paymentIntent.client_secret);
      } else {
        setError('Failed to initialize payment');
      }
    } catch (err: any) {
      setError(err.message || 'Payment initialization failed');
    }
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      setError('Payment system not ready');
      return;
    }

    setIsProcessing(true);
    setError('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card information not found');
      setIsProcessing(false);
      return;
    }

    try {
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: purchase.buyerInfo.name,
            email: purchase.buyerInfo.email,
            phone: purchase.buyerInfo.phone,
          },
        },
      });

      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUPIPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentService.validateUPIId(upiId)) {
      setError('Please enter a valid UPI ID');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const result = await paymentService.processUPIPayment(clientSecret, upiId);
      
      if (result.success) {
        // UPI payments typically redirect, so we'll handle success in the return URL
        window.location.href = `/payment-processing?payment_intent=${clientSecret}`;
      } else {
        setError(result.error || 'UPI payment failed');
      }
    } catch (err: any) {
      setError(err.message || 'UPI payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="font-playfair text-lg font-bold text-gray-800 mb-4">
          Choose Payment Method
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPaymentMethod('card')}
            className={`flex items-center space-x-3 p-4 border rounded-lg transition-all ${
              paymentMethod === 'card'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <CreditCard className="w-5 h-5 text-primary" />
            <div className="text-left">
              <div className="font-poppins font-medium text-gray-800">
                Card Payment
              </div>
              <div className="font-poppins text-xs text-gray-600">
                Visa, Mastercard, RuPay
              </div>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPaymentMethod('upi')}
            className={`flex items-center space-x-3 p-4 border rounded-lg transition-all ${
              paymentMethod === 'upi'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Smartphone className="w-5 h-5 text-primary" />
            <div className="text-left">
              <div className="font-poppins font-medium text-gray-800">
                UPI Payment
              </div>
              <div className="font-poppins text-xs text-gray-600">
                PhonePe, GPay, Paytm
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-poppins text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Payment Forms */}
      {paymentMethod === 'card' && (
        <form onSubmit={handleCardPayment} className="space-y-4">
          <div>
            <label className="block font-poppins font-medium text-gray-700 mb-2">
              Card Information
            </label>
            <div className="p-3 border border-gray-200 rounded-lg">
              <CardElement options={cardElementOptions} />
            </div>
          </div>
          
          <motion.button
            type="submit"
            disabled={!stripe || isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-poppins font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </div>
            ) : (
              `Pay ${paymentService.formatCurrency(purchase.totalAmount)}`
            )}
          </motion.button>
        </form>
      )}

      {paymentMethod === 'upi' && (
        <form onSubmit={handleUPIPayment} className="space-y-4">
          <div>
            <label className="block font-poppins font-medium text-gray-700 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@paytm"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
              required
            />
            <p className="font-poppins text-xs text-gray-500 mt-1">
              Enter your UPI ID (e.g., 9876543210@paytm)
            </p>
          </div>
          
          <motion.button
            type="submit"
            disabled={isProcessing || !upiId}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-poppins font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </div>
            ) : (
              `Pay ${paymentService.formatCurrency(purchase.totalAmount)} via UPI`
            )}
          </motion.button>
        </form>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-poppins font-semibold text-blue-800 mb-1">
              Secure Payment
            </h4>
            <p className="font-poppins text-sm text-blue-700">
              Your payment information is encrypted and secure. We use Stripe's industry-leading security standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, purchase }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div>
              <h2 className="font-playfair text-2xl font-bold text-gray-800">
                Complete Payment
              </h2>
              <p className="font-poppins text-gray-600">
                {purchase.quantity} ticket(s) • {paymentService.formatCurrency(purchase.totalAmount)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Payment Form */}
          <div className="p-6">
            <Elements stripe={stripePromise}>
              <PaymentForm
                purchase={purchase}
                onSuccess={onSuccess}
                onClose={onClose}
              />
            </Elements>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;