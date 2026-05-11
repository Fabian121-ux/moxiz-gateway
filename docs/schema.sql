-- Moxiz Gate Database Schema (PostgreSQL / Supabase)

-- 1. Profiles (Extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Merchants (Organizations)
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Merchant Users (RBAC)
CREATE TABLE IF NOT EXISTS merchant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'developer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(merchant_id, user_id)
);

-- 4. API Keys
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hint TEXT NOT NULL, -- e.g., 'sk_test_...1234'
    hashed_key TEXT NOT NULL UNIQUE,
    environment TEXT DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'live')),
    scopes TEXT[] DEFAULT '{all}',
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    reference TEXT UNIQUE NOT NULL,
    amount BIGINT NOT NULL, -- In cents
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'reversed')),
    customer_email TEXT,
    customer_name TEXT,
    metadata JSONB DEFAULT '{}',
    risk_score INTEGER DEFAULT 0,
    environment TEXT DEFAULT 'sandbox',
    provider_reference TEXT, -- External ref if we mock a provider
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Webhooks (Endpoints)
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    secret TEXT NOT NULL,
    events TEXT[] DEFAULT '{transaction.success, transaction.failed}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    environment TEXT DEFAULT 'sandbox',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Webhook Events (Logs)
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed')),
    response_code INTEGER,
    response_body TEXT,
    retry_count INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Fraud Flags
CREATE TABLE IF NOT EXISTS fraud_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    severity TEXT DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    metadata JSONB DEFAULT '{}',
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGSERIAL PRIMARY KEY,
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Request Logs (API Traffic)
CREATE TABLE IF NOT EXISTS request_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    method TEXT NOT NULL,
    path TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    latency_ms INTEGER NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    request_payload JSONB DEFAULT '{}',
    response_payload JSONB DEFAULT '{}',
    environment TEXT DEFAULT 'sandbox',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Merchants: Users can see merchants they are members of
CREATE POLICY "Users can view joined merchants" ON merchants 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM merchant_users WHERE merchant_id = merchants.id AND user_id = auth.uid())
);

-- Merchant Users: Users can see members of their own merchants
CREATE POLICY "Users can view merchant members" ON merchant_users
FOR SELECT USING (
    EXISTS (SELECT 1 FROM merchant_users mu WHERE mu.merchant_id = merchant_users.merchant_id AND mu.user_id = auth.uid())
);

-- API Keys: Only merchant owners/admins can manage keys
CREATE POLICY "Admins can manage API keys" ON api_keys
FOR ALL USING (
    EXISTS (SELECT 1 FROM merchant_users WHERE merchant_id = api_keys.merchant_id AND user_id = auth.uid() AND role IN ('owner', 'admin', 'developer'))
);

-- Transactions: Members can view transactions
CREATE POLICY "Members can view transactions" ON transactions
FOR SELECT USING (
    EXISTS (SELECT 1 FROM merchant_users WHERE merchant_id = transactions.merchant_id AND user_id = auth.uid())
);

-- Webhooks: Admins can manage webhooks
CREATE POLICY "Admins can manage webhooks" ON webhooks
FOR ALL USING (
    EXISTS (SELECT 1 FROM merchant_users WHERE merchant_id = webhooks.merchant_id AND user_id = auth.uid() AND role IN ('owner', 'admin'))
);

-- Webhook Events: Members can view logs
CREATE POLICY "Members can view webhook events" ON webhook_events
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM webhooks 
        JOIN merchant_users ON webhooks.merchant_id = merchant_users.merchant_id 
        WHERE webhooks.id = webhook_events.webhook_id AND merchant_users.user_id = auth.uid()
    )
);

-- Fraud Flags: Members can view
CREATE POLICY "Members can view fraud flags" ON fraud_flags
FOR SELECT USING (
    EXISTS (SELECT 1 FROM merchant_users WHERE merchant_id = fraud_flags.merchant_id AND user_id = auth.uid())
);

-- Audit Logs: Admins can view
CREATE POLICY "Admins can view audit logs" ON audit_logs
FOR SELECT USING (
    EXISTS (SELECT 1 FROM merchant_users WHERE merchant_id = audit_logs.merchant_id AND user_id = auth.uid() AND role IN ('owner', 'admin'))
);

-- Analytics: Members can view
CREATE POLICY "Members can view analytics" ON analytics_events
FOR SELECT USING (
    EXISTS (SELECT 1 FROM merchant_users WHERE merchant_id = analytics_events.merchant_id AND user_id = auth.uid())
);

-- Request Logs: Members can view
CREATE POLICY "Members can view request logs" ON request_logs
FOR SELECT USING (
    EXISTS (SELECT 1 FROM merchant_users WHERE merchant_id = request_logs.merchant_id AND user_id = auth.uid())
);

-- Functions & Triggers

-- Trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON merchants FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

