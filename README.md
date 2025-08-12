# FluffyPet Platform

*A comprehensive pet care ecosystem built with Next.js, Supabase, and modern web technologies*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/prashants-projects-3c026653/v0-mine-and-farha-s-venture)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/fPbKBalcdFq)

## Overview

FluffyPet is a privacy-preserving, multi-stakeholder platform that connects pet owners, veterinarians, service providers, NGOs, and volunteers in a unified ecosystem. Built as a tribute to veterinary practice and designed to address real-world coordination failures in pet care.

## Key Features

### For Pet Owners
- **Unified Pet Profiles**: Secure, longitudinal health records with media and documents
- **Smart Booking System**: Find and book veterinarians, groomers, trainers, and pet sitters
- **Lost & Found Network**: Community-driven pet recovery with geo-alerts
- **Adoption Platform**: Discover adoptable pets from verified NGOs and shelters
- **Emergency SOS**: Quick access to emergency animal care

### For Service Providers
- **Professional Verification**: Trusted provider profiles with reviews and ratings
- **Real-time Bookings**: Manage appointments and communicate with pet owners
- **Secure Data Access**: Role-based access to pet information during appointments
- **Payment Integration**: Seamless payment processing with Razorpay

### For Veterinarians & Clinics
- **Clinical Dashboard**: Comprehensive patient management system
- **Medical Records**: Access to shared pet health histories with owner consent
- **Appointment Management**: Streamlined scheduling and patient flow
- **Emergency Coordination**: Priority access to SOS alerts

### For NGOs & Shelters
- **Adoption Management**: Showcase adoptable animals with detailed profiles
- **Rescue Coordination**: Manage rescue cases and volunteer coordination
- **Community Engagement**: Connect with volunteers and donors
- **Event Management**: Organize adoption drives and awareness campaigns

## Technology Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time, Storage)
- **Media Storage**: Vercel Blob for secure file handling
- **Payments**: Razorpay integration
- **Maps**: Google Maps API for location services
- **Notifications**: Novu for multi-channel notifications
- **Email**: Resend for transactional emails
- **AI**: OpenAI integration for smart insights

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- Vercel account for deployment

### Environment Variables
Copy `.env.example` to `.env.local` and configure:

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token

# Payments
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key

# Notifications
NOVU_API_KEY=your_novu_key
NEXT_PUBLIC_NOVU_APP_ID=your_novu_app_id

# Email
RESEND_API_KEY=your_resend_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
\`\`\`

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd fluffypet-platform
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up the database**
   \`\`\`bash
   # Run database migrations
   npm run db:migrate
   \`\`\`

4. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboards
│   ├── discover/          # Service discovery
│   ├── community/         # Social features
│   ├── lost-found/        # Lost & Found system
│   ├── adopt/             # Adoption platform
│   ├── shop/              # E-commerce
│   └── sos/               # Emergency system
├── components/            # Reusable React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   ├── ui/                # UI components (shadcn/ui)
│   └── ...
├── lib/                   # Utility functions and configurations
│   ├── actions/           # Server actions
│   ├── hooks/             # Custom React hooks
│   └── supabase-*.ts      # Supabase clients
├── scripts/               # Database scripts and utilities
└── docs/                  # Documentation
\`\`\`

## Core Concepts

### Multi-Tenancy & Privacy
- **Role-based Access Control**: Granular permissions for different user types
- **Data Isolation**: Secure tenant separation with Row Level Security (RLS)
- **Consent Management**: Explicit consent for data sharing between parties

### Real-time Features
- **Live Bookings**: Real-time appointment updates
- **Chat System**: Instant messaging between users
- **Notifications**: Multi-channel alerts and reminders
- **Location Tracking**: Live updates for lost pet alerts

### Security & Compliance
- **Authentication**: Supabase Auth with social login support
- **Data Encryption**: End-to-end encryption for sensitive data
- **Audit Logging**: Comprehensive activity tracking
- **GDPR Compliance**: Data export and deletion capabilities

## Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md) - System design and technical architecture
- [Component Documentation](./docs/COMPONENTS.md) - Detailed component reference
- [Database Schema](./docs/DATABASE.md) - Database structure and relationships
- [Developer Guide](./docs/DEVELOPER_GUIDE.md) - Development workflows and best practices

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs and feature requests on GitHub
- **Community**: Join our community discussions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built with care, to care. This platform is dedicated to improving the lives of companion animals and the people who care for them.

---

**FluffyPet** - Where technology meets compassion in pet care.
