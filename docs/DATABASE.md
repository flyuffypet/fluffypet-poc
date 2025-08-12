# FluffyPet Database Documentation

## Overview

The FluffyPet platform uses a comprehensive PostgreSQL database hosted on Supabase with 141+ tables supporting multi-tenant pet care management. The database implements Row Level Security (RLS) for data isolation and includes extensive audit logging for compliance.

## Database Schema

### Core Entity Relationships

\`\`\`
Users (auth.users)
├── Profiles (profiles) - Extended user information
├── Organization Memberships (organization_users) - Multi-tenant access
├── Pet Ownership (pets) - Pet profiles and data
└── Audit Trail (audit_logs) - Activity tracking

Organizations (organizations)
├── Services (services) - Offered services
├── Staff (organization_users) - Team members
├── Bookings (bookings) - Service bookings
├── Appointments (appointments) - Scheduled visits
└── Analytics (analytics_org_summary) - Performance metrics

Pets (pets)
├── Medical Records (medical_records) - Health history
├── Media Files (pet_media) - Photos and documents
├── Collaborators (pet_collaborators) - Shared access
├── Shares (pet_shares) - Temporary access tokens
└── Reminders (reminders) - Health and care reminders
\`\`\`

## Table Categories

### 1. User Management
- **profiles** - Extended user profile information
- **organization_users** - User-organization relationships with roles
- **invites** - Organization invitation system
- **invite_codes** - Invitation code management
- **user_consents** - GDPR/privacy consent tracking

### 2. Pet Management
- **pets** - Core pet profiles and information
- **pet_collaborators** - Shared pet access management
- **pet_shares** - Temporary sharing tokens
- **pet_media** - Pet photos and documents
- **pet_transfer_logs** - Ownership transfer history
- **emergency_contacts** - Pet emergency contact information

### 3. Medical & Health
- **medical_records** - Veterinary records and treatments
- **reminders** - Health and care reminders
- **ai_insights** - AI-generated health insights
- **vaccine_logs** - Vaccination tracking (livestock)
- **health_treatments** - Treatment records (livestock)

### 4. Booking & Appointments
- **bookings** - Service bookings (boarding, grooming, etc.)
- **appointments** - Veterinary appointments
- **booking_items** - Individual booking line items
- **services** - Available services catalog
- **rooms** - Accommodation room management
- **room_availability** - Room booking calendar

### 5. Communication
- **conversations** - Chat conversations
- **messages** - Individual messages
- **notifications** - System notifications
- **notification_preferences** - User notification settings

### 6. Organizations
- **organizations** - Multi-tenant organization profiles
- **organization_services** - Organization-specific services
- **organization_integrations** - Third-party integrations
- **provider_profiles** - Service provider profiles
- **staff_shifts** - Staff scheduling

### 7. E-commerce
- **products** - Product catalog
- **product_variants** - Product variations (size, color, etc.)
- **product_categories** - Product categorization
- **product_images** - Product photo gallery
- **orders** - Customer orders
- **order_items** - Order line items
- **order_status_history** - Order tracking
- **carts** - Shopping carts
- **cart_items** - Cart contents
- **coupons** - Discount codes
- **wishlists** - User wishlists
- **shipping_methods** - Delivery options

### 8. Payments & Finance
- **payments** - Payment transactions
- **invoices** - Service invoices
- **invoice_items** - Invoice line items
- **donations** - NGO donations
- **referrals** - Referral program tracking

### 9. Community Features
- **community_posts** - Social media posts
- **community_groups** - User groups
- **group_members** - Group membership
- **forum_posts** - Discussion forum
- **forum_comments** - Forum replies
- **comments** - Post comments
- **reactions** - Likes and reactions
- **bookmarks** - Saved posts
- **tags** - Content tagging system
- **post_tags** - Post-tag relationships
- **post_media** - Post attachments

### 10. Lost & Found
- **lf_reports** - Lost/found pet reports
- **lf_matches** - Potential matches between reports
- **lf_media** - Report photos and media
- **lf_messages** - Communication between reporters
- **lf_actions** - Actions taken on reports
- **lf_subscriptions** - Alert subscriptions

### 11. Breeding Network
- **breeding_profiles** - Pet breeding profiles
- **breeding_matches** - Breeding compatibility matches
- **breeding_requests** - Breeding requests
- **breeding_swipes** - Tinder-like matching
- **breeding_photos** - Breeding profile photos
- **breeding_prefs** - User breeding preferences
- **breeding_verifications** - Health verifications
- **breeding_reports** - Abuse reports
- **breeding_blocklist** - Blocked users
- **breeding_records** - Breeding event logs

### 12. Livestock Management
- **livestock** - Individual animal records
- **livestock_batches** - Animal groupings
- **livestock_breeds** - Breed reference data
- **livestock_species** - Species reference data
- **flocks** - Poultry flock management
- **poultry_batches** - Poultry batch tracking
- **herd_batches** - Livestock herd management
- **dairy_batches** - Dairy production batches

### 13. Farm Operations
- **feed_logs** - Animal feeding records
- **poultry_feed_logs** - Poultry-specific feeding
- **milk_production_logs** - Dairy production tracking
- **milk_storage** - Milk storage management
- **milk_storage_logs** - Storage transaction logs
- **egg_production_logs** - Egg production tracking
- **egg_storage** - Egg storage management
- **wool_milk_production_logs** - Wool/milk production
- **wool_storage** - Wool storage tracking
- **mortality_logs** - Animal mortality tracking
- **lambing_records** - Sheep birthing records
- **hatchery_records** - Poultry hatching logs

### 14. Farm Resources
- **farm_inventory** - Farm supply inventory
- **inventory_transactions** - Inventory movements
- **farm_expenses** - Farm expense tracking
- **farm_revenues** - Farm income tracking
- **farm_product_sales** - Product sales records
- **resources** - General resource management
- **resource_transactions** - Resource usage logs

### 15. Analytics & Reporting
- **analytics_platform_summary** - Platform-wide metrics
- **analytics_org_summary** - Organization metrics
- **analytics_owner_summary** - Pet owner metrics
- **analytics_provider_summary** - Provider metrics

### 16. System Management
- **audit_logs** - Comprehensive audit trail
- **security_events** - Security event logging
- **moderation_logs** - Content moderation
- **reports** - User reports and complaints
- **platform_settings** - System configuration
- **api_keys** - API access management
- **integrations** - Available integrations
- **async_jobs** - Background job tracking
- **data_requests** - GDPR data requests
- **signed_documents** - Legal document tracking

### 17. Events & Scheduling
- **events** - Organization events
- **event_participants** - Event attendees
- **event_attendees** - Event registration
- **event_checkins** - Event check-in tracking
- **shifts** - Staff work shifts
- **tasks** - Task management
- **volunteer_hours** - Volunteer time tracking
- **volunteer_availability** - Volunteer scheduling
- **volunteer_skills** - Volunteer skill tracking

### 18. Reviews & Ratings
- **reviews** - Service and product reviews
- **addresses** - User address management
- **custom_fields** - Flexible data storage
- **media_files** - General media management

### 19. Reference Data
- **species_reference** - Animal species catalog
- **breed_reference** - Animal breed catalog
- **companion_species** - Pet species reference
- **companion_breeds** - Pet breed reference
- **automation_rules** - Business rule automation
- **compliance_records** - Regulatory compliance

### 20. IoT & Monitoring
- **iot_device_logs** - IoT device data
- **geo_events** - Location-based events

## Enumerated Types

The database uses custom enumerated types for consistent data validation:

### User Roles
\`\`\`sql
CREATE TYPE user_role AS ENUM (
  'pet_owner',
  'veterinarian',
  'service_provider', 
  'clinic_admin',
  'ngo_admin',
  'platform_admin',
  'volunteer',
  'breeder',
  'seller'
);
\`\`\`

### Organization Types
\`\`\`sql
CREATE TYPE org_type AS ENUM (
  'veterinary_clinic',
  'pet_service_provider',
  'ngo',
  'breeding_facility',
  'pet_store',
  'farm',
  'research_facility'
);
\`\`\`

### Status Types
\`\`\`sql
CREATE TYPE status AS ENUM (
  'active',
  'inactive', 
  'pending',
  'suspended',
  'archived'
);
\`\`\`

### Payment Status
\`\`\`sql
CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
  'disputed'
);
\`\`\`

### Appointment Status
\`\`\`sql
CREATE TYPE appointment_status AS ENUM (
  'scheduled',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);
\`\`\`

## Database Functions

### User Management Functions

#### handle_new_user()
Automatically creates user profile when new user signs up:
\`\`\`sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
\`\`\`

#### update_user_role(user_id, new_role)
Updates user role with audit logging:
\`\`\`sql
CREATE OR REPLACE FUNCTION update_user_role(
  p_user_id UUID,
  p_new_role user_role
) RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET role = p_new_role, updated_at = NOW()
  WHERE id = p_user_id;
  
  INSERT INTO audit_logs (
    actor_id, action, entity_type, entity_id, details
  ) VALUES (
    auth.uid(), 'role_update', 'profile', p_user_id,
    jsonb_build_object('new_role', p_new_role)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
\`\`\`

### Analytics Functions

#### refresh_all_org_summaries()
Updates organization analytics:
\`\`\`sql
CREATE OR REPLACE FUNCTION refresh_all_org_summaries()
RETURNS VOID AS $$
BEGIN
  UPDATE analytics_org_summary 
  SET 
    total_bookings = (
      SELECT COUNT(*) FROM bookings b 
      WHERE b.organization_id = analytics_org_summary.organization_id
    ),
    total_revenue = (
      SELECT COALESCE(SUM(amount), 0) FROM payments 
      WHERE organization_id = analytics_org_summary.organization_id
    ),
    last_updated = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
\`\`\`

## Row Level Security (RLS)

All tables implement comprehensive RLS policies for data security:

### User Data Protection
\`\`\`sql
-- Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Users can update their own profile  
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());
\`\`\`

### Organization Data Isolation
\`\`\`sql
-- Organization members can view organization data
CREATE POLICY "Organization members can view org data" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_users ou
      WHERE ou.organization_id = id
      AND ou.user_id = auth.uid()
      AND ou.status = 'active'
    )
  );
\`\`\`

### Pet Data Access Control
\`\`\`sql
-- Pet owners can access their pets
CREATE POLICY "Owners can access own pets" ON pets
  FOR ALL USING (owner_id = auth.uid());

-- Collaborators can access shared pets
CREATE POLICY "Collaborators can access shared pets" ON pets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pet_collaborators pc
      WHERE pc.pet_id = id
      AND pc.user_id = auth.uid()
    )
  );
\`\`\`

## Database Triggers

### Audit Logging Triggers
\`\`\`sql
-- Audit trigger for sensitive table changes
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    actor_id, action, entity_type, entity_id, 
    details, created_at
  ) VALUES (
    auth.uid(), 
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      ELSE to_jsonb(NEW)
    END,
    NOW()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to sensitive tables
CREATE TRIGGER audit_pets_trigger
  AFTER INSERT OR UPDATE OR DELETE ON pets
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
\`\`\`

### Automatic Timestamp Updates
\`\`\`sql
-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at column
CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
\`\`\`

## Indexes and Performance

### Key Indexes
\`\`\`sql
-- User lookup indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_organization_users_user_id ON organization_users(user_id);
CREATE INDEX idx_organization_users_org_id ON organization_users(organization_id);

-- Pet data indexes  
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_medical_records_pet_id ON medical_records(pet_id);

-- Booking indexes
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_start_date ON bookings(start_date);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);

-- Communication indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Audit and security indexes
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
\`\`\`

## Data Migration Scripts

Migration scripts are located in `/scripts/sql/` and should be executed in numerical order:

1. **001_create_media_type.sql** - Initial media type setup
2. **002_create_pets.sql** - Pet table creation
3. **003_create_media_files.sql** - Media file management
4. **004_enable_rls_and_policies.sql** - Security policies
5. **010_enums.sql** - Enumerated types
6. **011_tables.sql** - Core table creation
7. **012_triggers_functions.sql** - Database functions
8. **013_rls.sql** - Row level security
9. **014_storage_buckets.sql** - File storage setup
10. **015+** - Feature-specific migrations

## Backup and Maintenance

### Backup Strategy
- Automated daily backups via Supabase
- Point-in-time recovery available
- Cross-region backup replication
- Regular backup restoration testing

### Maintenance Tasks
- Weekly statistics updates
- Monthly index optimization
- Quarterly audit log archival
- Annual data retention cleanup

This database documentation provides comprehensive information about the FluffyPet platform's data architecture, security model, and operational procedures.
