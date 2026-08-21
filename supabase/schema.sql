-- ==============================================================================
-- 🚀 DELIVERY MANAGEMENT PLATFORM - SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. EXECUTIVES TABLE
CREATE TABLE IF NOT EXISTS executives (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  mobile TEXT NOT NULL,
  email TEXT,
  city TEXT DEFAULT 'Nellore',
  zone TEXT DEFAULT 'Nellore Central Hub (Zone 3)',
  dob TEXT,
  blood_group TEXT,
  emergency_contact TEXT,
  joining_date TEXT,
  kyc_status TEXT DEFAULT 'Verified',
  account_status TEXT DEFAULT 'Active',
  rating NUMERIC DEFAULT 4.9,
  total_deliveries_lifetime INTEGER DEFAULT 0,
  vehicle_type TEXT DEFAULT 'Two Wheeler (Bike)',
  vehicle_model TEXT DEFAULT 'Honda Activa 6G',
  vehicle_reg_number TEXT,
  driving_license TEXT,
  bank_name TEXT,
  bank_account_masked TEXT,
  upi_id TEXT,
  weekly_orders INTEGER DEFAULT 0,
  weekly_target INTEGER DEFAULT 50,
  weekly_earnings NUMERIC DEFAULT 0,
  delivery_earnings NUMERIC DEFAULT 0,
  bonus_earnings NUMERIC DEFAULT 0,
  referral_earnings NUMERIC DEFAULT 0,
  rank INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  executive_id TEXT REFERENCES executives(id) ON DELETE SET NULL,
  executive_name TEXT,
  customer_name TEXT,
  drop_area TEXT,
  distance_km NUMERIC DEFAULT 0,
  items_count INTEGER DEFAULT 1,
  order_type TEXT DEFAULT 'Standard Delivery',
  base_pay NUMERIC DEFAULT 80,
  surge_pay NUMERIC DEFAULT 0,
  tip NUMERIC DEFAULT 0,
  earnings NUMERIC DEFAULT 80,
  status TEXT DEFAULT 'Completed',
  order_date TEXT,
  order_time TEXT,
  rating_given INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. MILESTONES TABLE
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  cycle_name TEXT,
  start_date TEXT,
  end_date TEXT,
  target_orders INTEGER DEFAULT 50,
  completed_orders INTEGER DEFAULT 0,
  reward_amount NUMERIC DEFAULT 700,
  status TEXT DEFAULT 'In Progress',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. WEEKLY CONTESTS TABLE
CREATE TABLE IF NOT EXISTS weekly_contests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  prize_pool NUMERIC DEFAULT 3000,
  first_prize NUMERIC DEFAULT 1500,
  second_prize NUMERIC DEFAULT 1000,
  third_prize NUMERIC DEFAULT 500,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. REWARDS CATALOG TABLE
CREATE TABLE IF NOT EXISTS rewards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  points_cost INTEGER DEFAULT 100,
  discount_value TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  stock_count INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. REFERRALS TABLE
CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY,
  referrer_id TEXT,
  candidate_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  status TEXT DEFAULT 'Invited',
  reward_amount NUMERIC DEFAULT 300,
  orders_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. BROADCAST NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  recipient_id TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'announcement',
  is_read BOOLEAN DEFAULT false,
  timestamp TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  executive_id TEXT,
  executive_name TEXT,
  subject TEXT NOT NULL,
  category TEXT DEFAULT 'Earnings & Payouts',
  priority TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'Open',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE executives ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- PUBLIC ACCESS POLICIES (for anon client development)
CREATE POLICY "Allow public read executives" ON executives FOR SELECT USING (true);
CREATE POLICY "Allow public insert executives" ON executives FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update executives" ON executives FOR UPDATE USING (true);
CREATE POLICY "Allow public delete executives" ON executives FOR DELETE USING (true);

CREATE POLICY "Allow public all orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all milestones" ON milestones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all contests" ON weekly_contests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all rewards" ON rewards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all referrals" ON referrals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all tickets" ON support_tickets FOR ALL USING (true) WITH CHECK (true);
