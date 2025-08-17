# Vivah Bandhan - Indian Wedding Matchmaking Platform

A comprehensive platform for Indian wedding matchmaking, cultural experiences, and event management.

## Features

### 🎯 Matchmaking
- AI-powered compatibility matching
- Detailed user profiles with verification
- Real-time chat and video calls
- Advanced filtering and search

### 💒 Wedding Events
- Browse and book wedding experiences
- Create and manage your own events
- Interactive venue maps
- Secure payment processing

### 🎨 Cultural Immersion
- Learn about Indian wedding rituals
- Virtual dress-up experiences
- Regional tradition guides
- Interactive ceremony timelines

### 🔔 Smart Notifications
- Push notifications for matches and messages
- Real-time updates
- Email notifications

### 📊 Analytics & Insights
- User behavior tracking
- Engagement analytics
- Conversion tracking

## API Integrations

### Maps & Location
- **OpenStreetMap**: Free base maps for venue locations
- **Nominatim**: Geocoding and venue search

### Cultural Information
- **Wikipedia API**: Dynamic ritual and tradition information
- **Custom Cultural Database**: Curated Indian wedding content

### Notifications
- **Firebase Cloud Messaging**: Push notifications
- **Real-time Updates**: Supabase real-time subscriptions

### Analytics
- **Google Analytics**: User behavior and conversion tracking
- **Custom Events**: Matchmaking and engagement metrics

### Payments
- **Stripe API**: Secure payment processing
- **UPI Support**: Indian payment methods
- **Multi-currency**: INR support with proper formatting

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Maps**: Leaflet with OpenStreetMap
- **Payments**: Stripe
- **Notifications**: Firebase Cloud Messaging
- **Analytics**: Google Analytics
- **Deployment**: Vite build system

## Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase (Push Notifications)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key

# Google Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Fill in your API keys
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## API Setup Instructions

### 1. OpenStreetMap (Free)
- No API key required
- Uses Nominatim for geocoding
- Rate limited to 1 request per second

### 2. Firebase Cloud Messaging
1. Create a Firebase project
2. Enable Cloud Messaging
3. Generate VAPID keys
4. Add service worker for background notifications

### 3. Google Analytics
1. Create GA4 property
2. Get tracking ID
3. Configure custom events for matchmaking metrics

### 4. Stripe Payments
1. Create Stripe account
2. Get publishable and secret keys
3. Enable UPI payments for India
4. Set up webhooks for payment confirmations

## Key Features Implementation

### Matchmaking Algorithm
- Compatibility scoring based on multiple factors
- Age, religion, location, education, interests
- Machine learning for improved suggestions

### Real-time Chat
- Supabase real-time subscriptions
- Message encryption
- File sharing and voice messages

### Payment Processing
- Stripe integration with Indian payment methods
- UPI, cards, and digital wallets
- Secure tokenization and PCI compliance

### Cultural Content
- Wikipedia API integration
- Curated ritual information
- Regional tradition guides
- Interactive learning experiences

### Analytics Tracking
- User journey mapping
- Conversion funnel analysis
- A/B testing capabilities
- Custom event tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email hello@vivahbandhan.com or join our community Discord.
