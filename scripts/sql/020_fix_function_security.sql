-- Fix security warnings by setting search_path for all functions
-- This addresses the "Function Search Path Mutable" warnings

-- Fix update_conversation_last_message function
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.conversations 
    SET last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$;

-- Fix audit_sensitive_operations function
CREATE OR REPLACE FUNCTION public.audit_sensitive_operations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        details,
        created_at
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        jsonb_build_object(
            'old', to_jsonb(OLD),
            'new', to_jsonb(NEW)
        ),
        NOW()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Fix get_or_create_conversation function
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(p_user1_id uuid, p_user2_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_conversation_id uuid;
BEGIN
    -- Try to find existing conversation
    SELECT id INTO v_conversation_id
    FROM public.conversations
    WHERE (user1_id = p_user1_id AND user2_id = p_user2_id)
       OR (user1_id = p_user2_id AND user2_id = p_user1_id)
    LIMIT 1;
    
    -- Create new conversation if none exists
    IF v_conversation_id IS NULL THEN
        INSERT INTO public.conversations (user1_id, user2_id, created_at)
        VALUES (p_user1_id, p_user2_id, NOW())
        RETURNING id INTO v_conversation_id;
    END IF;
    
    RETURN v_conversation_id;
END;
$$;

-- Fix cleanup_old_metrics function
CREATE OR REPLACE FUNCTION public.cleanup_old_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Delete metrics older than 30 days
    DELETE FROM public.edge_function_metrics 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Delete health checks older than 7 days
    DELETE FROM public.system_health_checks 
    WHERE created_at < NOW() - INTERVAL '7 days';
    
    -- Delete error logs older than 90 days
    DELETE FROM public.error_logs 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;

-- Fix update_conversations_updated_at function
CREATE OR REPLACE FUNCTION public.update_conversations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix cleanup_storage_on_media_delete function
CREATE OR REPLACE FUNCTION public.cleanup_storage_on_media_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- This would typically call Supabase Storage API to delete the file
    -- For now, we'll just log the deletion
    INSERT INTO public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        details
    ) VALUES (
        auth.uid(),
        'DELETE_MEDIA_FILE',
        'media_files',
        OLD.id,
        jsonb_build_object('storage_path', OLD.storage_path)
    );
    
    RETURN OLD;
END;
$$;

-- Fix create_booking_conversation function
CREATE OR REPLACE FUNCTION public.create_booking_conversation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_conversation_id uuid;
BEGIN
    -- Create conversation between booking owner and provider
    SELECT public.get_or_create_conversation(NEW.owner_id, NEW.provider_user_id)
    INTO v_conversation_id;
    
    -- Update booking with conversation ID
    UPDATE public.bookings 
    SET conversation_id = v_conversation_id
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$;

-- Fix update_messages_updated_at function
CREATE OR REPLACE FUNCTION public.update_messages_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        created_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'pet_owner'),
        NOW()
    );
    
    RETURN NEW;
END;
$$;

-- Fix validate_enum_values function
CREATE OR REPLACE FUNCTION public.validate_enum_values()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- This function would validate enum values against allowed lists
    -- Implementation depends on specific validation requirements
    RETURN NEW;
END;
$$;

-- Fix create_appointment_conversation function
CREATE OR REPLACE FUNCTION public.create_appointment_conversation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_conversation_id uuid;
    v_provider_user_id uuid;
BEGIN
    -- Get provider user ID
    SELECT user_id INTO v_provider_user_id
    FROM public.provider_profiles
    WHERE id = NEW.provider_id;
    
    -- Create conversation between appointment owner and provider
    SELECT public.get_or_create_conversation(NEW.owner_id, v_provider_user_id)
    INTO v_conversation_id;
    
    -- Update appointment with conversation ID
    UPDATE public.appointments 
    SET conversation_id = v_conversation_id
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$;

-- Add the cleanup_monitoring_data function with proper security
CREATE OR REPLACE FUNCTION public.cleanup_monitoring_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Delete metrics older than 30 days
    DELETE FROM public.edge_function_metrics 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Delete health checks older than 7 days
    DELETE FROM public.system_health_checks 
    WHERE created_at < NOW() - INTERVAL '7 days';
    
    -- Delete error logs older than 90 days
    DELETE FROM public.error_logs 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;

COMMENT ON FUNCTION public.cleanup_monitoring_data() IS 'Cleans up old monitoring data to prevent database bloat';
