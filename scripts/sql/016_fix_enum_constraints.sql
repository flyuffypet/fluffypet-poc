-- Database schema consistency fixes and enum constraint enforcement

-- Fix missing enum constraints and add proper validation
DO $$
BEGIN
  -- Ensure all enum types exist with proper values
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM (
      'admin', 'e-commerce_vendor', 'pet_owner', 'service_provider', 
      'superadmin', 'veterinarian', 'volunteer'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'platform_role_enum') THEN
    CREATE TYPE platform_role_enum AS ENUM (
      'admin', 'compliance_officer', 'moderator', 'superadmin'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_type') THEN
    CREATE TYPE status_type AS ENUM (
      'active', 'deleted', 'inactive', 'pending', 'pending_review', 'rejected', 'suspended'
    );
  END IF;

  -- Add missing constraints to ensure data integrity
  
  -- Profiles table constraints
  ALTER TABLE profiles 
  ADD CONSTRAINT check_profiles_role_valid 
  CHECK (role IS NULL OR role IN ('admin', 'e-commerce_vendor', 'pet_owner', 'service_provider', 'superadmin', 'veterinarian', 'volunteer'));

  ALTER TABLE profiles 
  ADD CONSTRAINT check_profiles_platform_role_valid 
  CHECK (platform_role IS NULL OR platform_role IN ('admin', 'compliance_officer', 'moderator', 'superadmin'));

  ALTER TABLE profiles 
  ADD CONSTRAINT check_profiles_status_valid 
  CHECK (status IS NULL OR status IN ('active', 'deleted', 'inactive', 'pending', 'pending_review', 'rejected', 'suspended'));

  -- Organization users constraints
  ALTER TABLE organization_users 
  ADD CONSTRAINT check_org_users_role_valid 
  CHECK (role IN ('admin', 'coordinator', 'manager', 'owner', 'receptionist', 'staff', 'veterinarian', 'volunteer'));

  ALTER TABLE organization_users 
  ADD CONSTRAINT check_org_users_status_valid 
  CHECK (status IN ('active', 'deleted', 'inactive', 'pending', 'pending_review', 'rejected', 'suspended'));

  -- Pets table constraints
  ALTER TABLE pets 
  ADD CONSTRAINT check_pets_gender_valid 
  CHECK (gender IS NULL OR gender IN ('female', 'male', 'unknown'));

  ALTER TABLE pets 
  ADD CONSTRAINT check_pets_size_valid 
  CHECK (size IS NULL OR size IN ('extra_large', 'extra_small', 'large', 'medium', 'small'));

  ALTER TABLE pets 
  ADD CONSTRAINT check_pets_status_valid 
  CHECK (status IS NULL OR status IN ('active', 'deleted', 'inactive', 'pending', 'pending_review', 'rejected', 'suspended'));

  -- Appointments table constraints
  ALTER TABLE appointments 
  ADD CONSTRAINT check_appointments_status_valid 
  CHECK (status IN ('cancelled', 'completed', 'confirmed', 'in_progress', 'no_show', 'rescheduled', 'scheduled'));

  ALTER TABLE appointments 
  ADD CONSTRAINT check_appointments_payment_status_valid 
  CHECK (payment_status IN ('cancelled', 'completed', 'disputed', 'failed', 'in_escrow', 'paid', 'pending', 'processing', 'refunded', 'released'));

  -- Bookings table constraints
  ALTER TABLE bookings 
  ADD CONSTRAINT check_bookings_status_valid 
  CHECK (status IN ('cancelled', 'completed', 'confirmed', 'in_progress', 'pending', 'refunded'));

  ALTER TABLE bookings 
  ADD CONSTRAINT check_bookings_payment_status_valid 
  CHECK (payment_status IN ('cancelled', 'completed', 'disputed', 'failed', 'in_escrow', 'paid', 'pending', 'processing', 'refunded', 'released'));

  -- Payments table constraints
  ALTER TABLE payments 
  ADD CONSTRAINT check_payments_status_valid 
  CHECK (status IN ('cancelled', 'completed', 'disputed', 'failed', 'in_escrow', 'paid', 'pending', 'processing', 'refunded', 'released'));

  -- Organizations table constraints
  ALTER TABLE organizations 
  ADD CONSTRAINT check_organizations_status_valid 
  CHECK (status IS NULL OR status IN ('active', 'deleted', 'inactive', 'pending', 'pending_review', 'rejected', 'suspended'));

  -- Services table constraints
  ALTER TABLE services 
  ADD CONSTRAINT check_services_status_valid 
  CHECK (status IS NULL OR status IN ('active', 'deleted', 'inactive', 'pending', 'pending_review', 'rejected', 'suspended'));

  -- Add business logic constraints
  
  -- Ensure appointment duration is reasonable
  ALTER TABLE appointments 
  ADD CONSTRAINT check_appointments_duration_reasonable 
  CHECK (duration_minutes > 0 AND duration_minutes <= 480); -- Max 8 hours

  -- Ensure booking dates are logical
  ALTER TABLE bookings 
  ADD CONSTRAINT check_bookings_dates_logical 
  CHECK (start_date <= end_date);

  -- Ensure positive amounts
  ALTER TABLE payments 
  ADD CONSTRAINT check_payments_amount_positive 
  CHECK (amount >= 0);

  ALTER TABLE appointments 
  ADD CONSTRAINT check_appointments_cost_positive 
  CHECK (total_cost IS NULL OR total_cost >= 0);

  -- Ensure pet birth dates are reasonable
  ALTER TABLE pets 
  ADD CONSTRAINT check_pets_birth_date_reasonable 
  CHECK (date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE);

  -- Ensure ratings are within valid range
  ALTER TABLE reviews 
  ADD CONSTRAINT check_reviews_rating_valid 
  CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5));

  -- Add email format validation
  ALTER TABLE profiles 
  ADD CONSTRAINT check_profiles_email_format 
  CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

EXCEPTION
  WHEN duplicate_object THEN
    -- Constraint already exists, skip
    NULL;
  WHEN others THEN
    -- Log error but continue
    RAISE NOTICE 'Error adding constraint: %', SQLERRM;
END $$;

-- Create indexes without CONCURRENTLY to avoid transaction block issues
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role) WHERE role IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_platform_role ON profiles(platform_role) WHERE platform_role IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status) WHERE status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status) WHERE status IS NOT NULL;

-- Add function to validate enum values before insert/update
CREATE OR REPLACE FUNCTION validate_enum_values()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be extended to add custom enum validation logic
  -- For now, it serves as a placeholder for future enum validation needs
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add audit trigger for sensitive operations
CREATE OR REPLACE FUNCTION audit_sensitive_operations()
RETURNS TRIGGER AS $$
BEGIN
  -- Log sensitive operations to audit table
  INSERT INTO audit_logs (
    table_name,
    operation,
    old_values,
    new_values,
    user_id,
    timestamp
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    COALESCE(NEW.updated_by, OLD.updated_by, current_setting('app.current_user_id', true)::uuid),
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for sensitive tables
DROP TRIGGER IF EXISTS audit_profiles_trigger ON profiles;
CREATE TRIGGER audit_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION audit_sensitive_operations();

DROP TRIGGER IF EXISTS audit_pets_trigger ON pets;
CREATE TRIGGER audit_pets_trigger
  AFTER INSERT OR UPDATE OR DELETE ON pets
  FOR EACH ROW EXECUTE FUNCTION audit_sensitive_operations();

DROP TRIGGER IF EXISTS audit_payments_trigger ON payments;
CREATE TRIGGER audit_payments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION audit_sensitive_operations();
