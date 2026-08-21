-- ==============================================================================
-- 🚀 DELIVERYPRO HUB - CLEAN EMPTY DATABASE SCHEMA (SUPABASE)
-- 0 DATA / 0 ROWS - FRESH PRODUCTION DATABASE READY FOR REAL RECORDS
-- ==============================================================================

-- STEP 1: DROP OLD TABLES IF THEY EXIST
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS rewards CASCADE;
DROP TABLE IF EXISTS weekly_contests CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS payouts CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS executives CASCADE;
DROP TABLE IF EXISTS financial_applications CASCADE;

-- STEP 2: CREATE FRESH EMPTY TABLES

-- 1. EXECUTIVES TABLE
CREATE TABLE executives (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT DEFAULT 'Nellore',
  zone TEXT DEFAULT 'Nellore Central Hub (Zone 3)',
  dob TEXT,
  blood_group TEXT,
  emergency_contact TEXT,
  joining_date TEXT,
  kyc_status TEXT DEFAULT 'Verified',
  account_status TEXT DEFAULT 'Active',
  rating NUMERIC DEFAULT 5.0,
  total_deliveries_lifetime INTEGER DEFAULT 0,
  vehicle_type TEXT DEFAULT 'Two Wheeler (Bike)',
  vehicle_model TEXT,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ORDERS TABLE
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  executive_id TEXT,
  executive_name TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  drop_area TEXT NOT NULL,
  pickup_area TEXT DEFAULT 'Nellore Central Hub',
  distance_km NUMERIC DEFAULT 0,
  items_count INTEGER DEFAULT 1,
  order_type TEXT DEFAULT 'Standard Delivery',
  base_pay NUMERIC DEFAULT 80,
  surge_pay NUMERIC DEFAULT 0,
  tip NUMERIC DEFAULT 0,
  earnings NUMERIC DEFAULT 80,
  status TEXT DEFAULT 'Completed',
  order_date TEXT NOT NULL,
  order_time TEXT NOT NULL,
  rating_given INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PAYOUTS TABLE
CREATE TABLE payouts (
  id TEXT PRIMARY KEY,
  executive_id TEXT NOT NULL,
  payout_date TEXT NOT NULL,
  cycle_name TEXT NOT NULL,
  delivery_pay NUMERIC DEFAULT 0,
  incentives NUMERIC DEFAULT 0,
  tips NUMERIC DEFAULT 0,
  deductions NUMERIC DEFAULT 0,
  net_amount NUMERIC DEFAULT 0,
  bank_name TEXT,
  account_masked TEXT,
  reference_number TEXT,
  utr TEXT,
  expected_date TEXT,
  status TEXT DEFAULT 'Processing',
  is_instant BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. MILESTONES TABLE
CREATE TABLE milestones (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Weekly Target',
  cycle_name TEXT,
  start_date TEXT,
  end_date TEXT,
  deadline TEXT,
  period TEXT,
  target_orders INTEGER DEFAULT 50,
  completed_orders INTEGER DEFAULT 0,
  reward_amount NUMERIC DEFAULT 500,
  reward_text TEXT DEFAULT '₹500 Bonus',
  status TEXT DEFAULT 'In Progress',
  claimed_at TEXT,
  tiers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. WEEKLY CONTESTS TABLE
CREATE TABLE weekly_contests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  prize_pool NUMERIC DEFAULT 3000,
  first_prize NUMERIC DEFAULT 1500,
  second_prize NUMERIC DEFAULT 1000,
  third_prize NUMERIC DEFAULT 500,
  min_orders_to_qualify INTEGER DEFAULT 25,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. REWARDS TABLE
CREATE TABLE rewards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Fuel',
  points_cost INTEGER DEFAULT 100,
  discount_value TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  stock_count INTEGER DEFAULT 50,
  redemption_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. REFERRALS TABLE
CREATE TABLE referrals (
  id TEXT PRIMARY KEY,
  referrer_id TEXT NOT NULL,
  referrer_name TEXT,
  candidate_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  city TEXT DEFAULT 'Nellore',
  status TEXT DEFAULT 'Invited',
  reward_amount NUMERIC DEFAULT 300,
  orders_completed INTEGER DEFAULT 0,
  target_orders INTEGER DEFAULT 25,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. NOTIFICATIONS TABLE
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  recipient_executive_id TEXT DEFAULT 'all',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  tag TEXT DEFAULT 'General',
  emoji TEXT DEFAULT '📢',
  action_url TEXT DEFAULT '/app/dashboard',
  is_read BOOLEAN DEFAULT false,
  timestamp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. SUPPORT TICKETS TABLE
CREATE TABLE support_tickets (
  id TEXT PRIMARY KEY,
  executive_id TEXT NOT NULL,
  executive_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT DEFAULT 'Earnings & Payouts',
  priority TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'Open',
  description TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. FINANCIAL SERVICES TABLE
CREATE TABLE financial_applications (
  id TEXT PRIMARY KEY,
  executive_id TEXT NOT NULL,
  service_type TEXT NOT NULL,
  amount_requested NUMERIC DEFAULT 0,
  monthly_income NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Under Review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- STEP 3: ENABLE ROW LEVEL SECURITY (RLS) & OPEN POLICIES
ALTER TABLE executives ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on executives" ON executives FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on payouts" ON payouts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on milestones" ON milestones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on weekly_contests" ON weekly_contests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on rewards" ON rewards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on referrals" ON referrals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on support_tickets" ON support_tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on financial_applications" ON financial_applications FOR ALL USING (true) WITH CHECK (true);
