-- =============================================================================
-- CENTRIC SYSTEMS GHANA LIMITED
-- Enterprise Multi-Branch Stock, Sales & Credit Management System
-- Prepared for: Kwame Yeboah (Owner)
-- Target Platform: Supabase (PostgreSQL with RLS) & Cloudflare Pages
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. ENUMS
-- =============================================================================
DO $$ BEGIN
    CREATE TYPE location_type AS ENUM ('warehouse', 'branch');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'warehouse_manager', 'branch_staff', 'customer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE transfer_status AS ENUM ('pending_approval', 'approved', 'dispatched', 'received', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE sale_status AS ENUM ('quotation', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_mode AS ENUM ('cash', 'credit', 'split', 'momo', 'bank_transfer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ledger_type AS ENUM ('debit', 'credit');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =============================================================================
-- 2. CORE TABLES
-- =============================================================================

-- 2.1 Locations (Central Warehouse & Retail Branches)
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    type location_type NOT NULL DEFAULT 'branch',
    address TEXT,
    phone TEXT,
    manager_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 Profiles (Linked to auth.users or standalone auth records)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'branch_staff',
    assigned_location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 Products Master
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    description TEXT,
    unit_of_measure TEXT DEFAULT 'pcs',
    cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    low_stock_threshold INT NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 Location Stock (Multi-branch inventory ledger)
CREATE TABLE IF NOT EXISTS public.location_stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_product_location UNIQUE (location_id, product_id)
);

-- 2.5 Customers (Credit & Commercial Account Holders)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    company_name TEXT,
    tin_number TEXT,
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.6 Sales Orders
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT NOT NULL UNIQUE,
    location_id UUID NOT NULL REFERENCES public.locations(id),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL DEFAULT 'Walk-in Customer',
    cashier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status sale_status NOT NULL DEFAULT 'completed',
    payment_mode payment_mode NOT NULL DEFAULT 'cash',
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    change_due NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.7 Sale Items
CREATE TABLE IF NOT EXISTS public.sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    product_name TEXT NOT NULL,
    sku TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL
);

-- 2.8 Customer Credit Ledger (Double-Entry Balance Model)
-- Debit = increases debt (purchase on credit)
-- Credit = decreases debt (payment made by customer)
CREATE TABLE IF NOT EXISTS public.credit_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
    entry_type ledger_type NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_method TEXT DEFAULT 'Cash',
    reference_number TEXT,
    notes TEXT,
    recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.9 Stock Transfers & Restock Workflow
CREATE TABLE IF NOT EXISTS public.stock_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transfer_number TEXT NOT NULL UNIQUE,
    from_location_id UUID NOT NULL REFERENCES public.locations(id),
    to_location_id UUID NOT NULL REFERENCES public.locations(id),
    status transfer_status NOT NULL DEFAULT 'pending_approval',
    requested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    dispatched_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    received_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    waybill_number TEXT,
    driver_name TEXT,
    driver_phone TEXT,
    notes TEXT,
    owner_review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    dispatched_at TIMESTAMPTZ,
    received_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.10 Stock Transfer Items
CREATE TABLE IF NOT EXISTS public.stock_transfer_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transfer_id UUID NOT NULL REFERENCES public.stock_transfers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity_requested INT NOT NULL CHECK (quantity_requested > 0),
    quantity_approved INT DEFAULT 0 CHECK (quantity_approved >= 0),
    quantity_dispatched INT DEFAULT 0 CHECK (quantity_dispatched >= 0),
    quantity_received INT DEFAULT 0 CHECK (quantity_received >= 0)
);

-- 2.11 Supplier Inbound Receipts (Warehouse Intake Only)
CREATE TABLE IF NOT EXISTS public.supplier_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number TEXT NOT NULL UNIQUE,
    warehouse_id UUID NOT NULL REFERENCES public.locations(id),
    supplier_name TEXT NOT NULL,
    supplier_invoice_ref TEXT,
    received_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    total_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.supplier_receipt_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_id UUID NOT NULL REFERENCES public.supplier_receipts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_cost NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL
);

-- =============================================================================
-- 3. VIEWS FOR AUTOMATED CALCULATIONS & OWNER REPORTING
-- =============================================================================

-- 3.1 Customer Balances (Buy Now Pay Later Balances) View
CREATE OR REPLACE VIEW public.customer_balances AS
SELECT 
    c.id AS customer_id,
    c.full_name,
    c.phone,
    c.company_name,
    c.is_active,
    COALESCE(SUM(CASE WHEN cl.entry_type = 'debit' THEN cl.amount ELSE 0 END), 0.00) AS total_purchases,
    COALESCE(SUM(CASE WHEN cl.entry_type = 'credit' THEN cl.amount ELSE 0 END), 0.00) AS total_paid,
    COALESCE(SUM(CASE WHEN cl.entry_type = 'debit' THEN cl.amount ELSE -cl.amount END), 0.00) AS current_unpaid_balance
FROM public.customers c
LEFT JOIN public.credit_ledger cl ON c.id = cl.customer_id
GROUP BY c.id, c.full_name, c.phone, c.company_name, c.is_active;

-- 3.2 Branch Stock Overview with Low Stock Indicator
CREATE OR REPLACE VIEW public.branch_stock_overview AS
SELECT 
    ls.id AS stock_id,
    l.id AS location_id,
    l.name AS location_name,
    l.code AS location_code,
    l.type AS location_type,
    p.id AS product_id,
    p.sku,
    p.name AS product_name,
    p.category,
    p.unit_price,
    p.cost_price,
    p.low_stock_threshold,
    ls.quantity,
    (ls.quantity <= p.low_stock_threshold) AS is_low_stock,
    (ls.quantity * p.unit_price) AS total_retail_value,
    (ls.quantity * p.cost_price) AS total_cost_value,
    ls.updated_at
FROM public.location_stock ls
JOIN public.locations l ON ls.location_id = l.id
JOIN public.products p ON ls.product_id = p.id;

-- =============================================================================
-- 4. ATOMIC STORED PROCEDURES / FUNCTIONS
-- =============================================================================

-- 4.1 Confirm Stock Transfer Receipt (Atomic double-inventory adjustment)
-- Moves stock from Central Warehouse to Branch atomically upon physical receipt
CREATE OR REPLACE FUNCTION public.confirm_stock_transfer_receipt(
    p_transfer_id UUID,
    p_received_by UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_transfer RECORD;
    v_item RECORD;
    v_wh_stock INT;
BEGIN
    SELECT * INTO v_transfer FROM public.stock_transfers WHERE id = p_transfer_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Transfer order not found';
    END IF;

    IF v_transfer.status != 'dispatched' AND v_transfer.status != 'approved' THEN
        RAISE EXCEPTION 'Transfer status must be approved or dispatched to receive. Current status: %', v_transfer.status;
    END IF;

    FOR v_item IN SELECT * FROM public.stock_transfer_items WHERE transfer_id = p_transfer_id LOOP
        -- Verify warehouse has sufficient stock
        SELECT quantity INTO v_wh_stock 
        FROM public.location_stock 
        WHERE location_id = v_transfer.from_location_id AND product_id = v_item.product_id
        FOR UPDATE;

        IF v_wh_stock < v_item.quantity_approved THEN
            RAISE EXCEPTION 'Insufficient stock in source warehouse for product %. Available: %, Required: %', 
                v_item.product_id, COALESCE(v_wh_stock, 0), v_item.quantity_approved;
        END IF;

        -- Decrement warehouse stock
        UPDATE public.location_stock
        SET quantity = quantity - v_item.quantity_approved, updated_at = NOW()
        WHERE location_id = v_transfer.from_location_id AND product_id = v_item.product_id;

        -- Increment destination branch stock
        INSERT INTO public.location_stock (location_id, product_id, quantity, updated_at)
        VALUES (v_transfer.to_location_id, v_item.product_id, v_item.quantity_approved, NOW())
        ON CONFLICT (location_id, product_id)
        DO UPDATE SET quantity = public.location_stock.quantity + EXCLUDED.quantity, updated_at = NOW();

        -- Update quantity received on item
        UPDATE public.stock_transfer_items
        SET quantity_received = v_item.quantity_approved
        WHERE id = v_item.id;
    END LOOP;

    -- Update transfer status
    UPDATE public.stock_transfers
    SET status = 'received',
        received_by = p_received_by,
        received_at = NOW(),
        updated_at = NOW()
    WHERE id = p_transfer_id;

    RETURN jsonb_build_object('success', true, 'message', 'Stock transfer successfully received and inventory updated');
END;
$$;

-- 4.2 Query 30-Day Branch Sales for Restock Verification
-- Used by Kwame Yeboah before approving restock dispatch
CREATE OR REPLACE FUNCTION public.get_branch_recent_product_sales(
    p_location_id UUID,
    p_product_id UUID,
    p_days INT DEFAULT 30
)
RETURNS TABLE (
    sale_id UUID,
    invoice_number TEXT,
    sale_date TIMESTAMPTZ,
    customer_name TEXT,
    quantity_sold INT,
    unit_price NUMERIC,
    subtotal NUMERIC,
    payment_mode payment_mode
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        s.id AS sale_id,
        s.invoice_number,
        s.created_at AS sale_date,
        s.customer_name,
        si.quantity AS quantity_sold,
        si.unit_price,
        si.subtotal,
        s.payment_mode
    FROM public.sales s
    JOIN public.sale_items si ON s.id = si.sale_id
    WHERE s.location_id = p_location_id
      AND si.product_id = p_product_id
      AND s.status = 'completed'
      AND s.created_at >= (NOW() - (p_days || ' days')::INTERVAL)
    ORDER BY s.created_at DESC;
$$;

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_transfer_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_receipt_items ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user profile
CREATE OR REPLACE FUNCTION public.current_profile()
RETURNS public.profiles
LANGUAGE sql
STABLE
AS $$
    SELECT * FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 5.1 Locations: All authenticated staff can read; only owner can modify
CREATE POLICY "Locations readable by authenticated"
ON public.locations FOR SELECT TO authenticated, anon
USING (true);

CREATE POLICY "Locations modifiable by owner only"
ON public.locations FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'owner'));

-- 5.2 Products: All authenticated can read; owner and warehouse manager can modify
CREATE POLICY "Products readable by authenticated"
ON public.products FOR SELECT TO authenticated, anon
USING (true);

CREATE POLICY "Products modifiable by owner or warehouse_manager"
ON public.products FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('owner', 'warehouse_manager')));

-- 5.3 Location Stock:
-- Owner & Warehouse Manager can see all; Branch staff can see only their branch
CREATE POLICY "Location stock read policy"
ON public.location_stock FOR SELECT TO authenticated, anon
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE (user_id = auth.uid() AND role IN ('owner', 'warehouse_manager'))
           OR (user_id = auth.uid() AND role = 'branch_staff' AND assigned_location_id = location_stock.location_id)
    )
    OR auth.uid() IS NULL -- allow read in anon/demo environment
);

-- 5.4 Sales & Sale Items:
-- Branch staff only can access their location's sales; Owner can access all
CREATE POLICY "Sales read policy"
ON public.sales FOR SELECT TO authenticated, anon
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE (user_id = auth.uid() AND role = 'owner')
           OR (user_id = auth.uid() AND role = 'branch_staff' AND assigned_location_id = sales.location_id)
    )
    OR auth.uid() IS NULL
);

CREATE POLICY "Sales insert policy"
ON public.sales FOR INSERT TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Sale items read policy"
ON public.sale_items FOR SELECT TO authenticated, anon
USING (true);

CREATE POLICY "Sale items insert policy"
ON public.sale_items FOR INSERT TO authenticated, anon
WITH CHECK (true);

-- 5.5 Credit Ledger:
-- Customers see only their own entries; Owner sees all
CREATE POLICY "Credit ledger read policy"
ON public.credit_ledger FOR SELECT TO authenticated, anon
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE (user_id = auth.uid() AND role = 'owner')
           OR (user_id = auth.uid() AND role = 'customer' AND id = credit_ledger.customer_id)
    )
    OR auth.uid() IS NULL
);

CREATE POLICY "Credit ledger insert policy"
ON public.credit_ledger FOR INSERT TO authenticated, anon
WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('owner', 'branch_staff'))
    OR auth.uid() IS NULL
);

-- 5.6 Stock Transfers & Items:
CREATE POLICY "Transfers read policy"
ON public.stock_transfers FOR SELECT TO authenticated, anon
USING (true);

CREATE POLICY "Transfers insert/update policy"
ON public.stock_transfers FOR ALL TO authenticated, anon
USING (true);

CREATE POLICY "Transfer items policy"
ON public.stock_transfer_items FOR ALL TO authenticated, anon
USING (true);

-- =============================================================================
-- 6. REALISTIC GHANAIAN SEED DATA
-- Centric Systems Ghana Limited (Accra, Medie, Lapaz, Kumasi)
-- =============================================================================

-- 6.1 Insert Business Locations
INSERT INTO public.locations (id, name, code, type, address, phone, manager_name) VALUES
('11111111-1111-1111-1111-111111111111', 'Central Warehouse', 'WH-ACCRA', 'warehouse', 'Spintex Industrial Area, Accra, Ghana', '+233 24 400 1100', 'Kofi Mensah'),
('22222222-2222-2222-2222-222222222222', 'Centric - Medie', 'BR-MEDIE', 'branch', 'Nsawam Road, Medie Tollbooth Junction, Greater Accra', '+233 20 500 2200', 'Ama Boateng'),
('33333333-3333-3333-3333-333333333333', 'Centric - Lapaz', 'BR-LAPAZ', 'branch', 'George Walker Bush Highway, Near Nii Boi Town Junction, Lapaz', '+233 55 600 3300', 'Yaw Ofori'),
('44444444-4444-4444-4444-444444444444', 'Centric - Kumasi', 'BR-KUMASI', 'branch', 'Suame Magazine Commercial Strip, Off Sunyani Road, Kumasi', '+233 24 700 4400', 'Akosua Darko')
ON CONFLICT (code) DO NOTHING;

-- 6.2 Insert Staff Profiles (Kwame Yeboah & Team)
INSERT INTO public.profiles (id, email, full_name, role, assigned_location_id, phone) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'kwame@centricsystems.gh', 'Kwame Yeboah', 'owner', NULL, '+233 24 100 0001'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'kofi.warehouse@centricsystems.gh', 'Kofi Mensah', 'warehouse_manager', '11111111-1111-1111-1111-111111111111', '+233 24 400 1100'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'ama.medie@centricsystems.gh', 'Ama Boateng', 'branch_staff', '22222222-2222-2222-2222-222222222222', '+233 20 500 2200'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'yaw.lapaz@centricsystems.gh', 'Yaw Ofori', 'branch_staff', '33333333-3333-3333-3333-333333333333', '+233 55 600 3300'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'akosua.kumasi@centricsystems.gh', 'Akosua Darko', 'branch_staff', '44444444-4444-4444-4444-444444444444', '+233 24 700 4400')
ON CONFLICT (email) DO NOTHING;

-- 6.3 Insert Products Master (Electrical & Solar Systems Hardware)
INSERT INTO public.products (id, sku, name, category, description, unit_of_measure, cost_price, unit_price, low_stock_threshold) VALUES
('p0000001-0000-0000-0000-000000000001', 'INV-5KW-HYB', 'Growatt 5kVA Hybrid Solar Inverter 48V', 'Inverters', 'Pure sine wave hybrid inverter with 80A MPPT solar charge controller', 'unit', 6800.00, 8500.00, 5),
('p0000002-0000-0000-0000-000000000002', 'BAT-LITH-48V', 'Dyness 4.8kWh LiFePO4 Lithium Battery 48V', 'Batteries', 'Deep cycle lithium iron phosphate battery module with BMS', 'unit', 11500.00, 14200.00, 4),
('p0000003-0000-0000-0000-000000000003', 'PAN-550W-MONO', 'Canadian Solar 550W Monocrystalline Panel', 'Solar Panels', 'High-efficiency tier-1 half-cell solar photovoltaic module', 'pcs', 1100.00, 1450.00, 15),
('p0000004-0000-0000-0000-000000000004', 'CBL-16MM-CU', '16mm² Single Core Copper Cable (100m Roll)', 'Cables & Wiring', 'Flame-retardant heavy-duty conduit building wire', 'roll', 1450.00, 1950.00, 8),
('p0000005-0000-0000-0000-000000000005', 'CBL-2.5MM-3C', '2.5mm² 3-Core Flat Twin & Earth Cable (100m)', 'Cables & Wiring', 'Standard domestic & commercial electrical installation cable', 'roll', 720.00, 980.00, 12),
('p0000006-0000-0000-0000-000000000006', 'DB-12WAY-3PH', 'Schneider 12-Way Three Phase Distribution Board', 'Switchgear', 'Sheet steel consumer unit with 100A main isolator switch', 'unit', 850.00, 1200.00, 6),
('p0000007-0000-0000-0000-000000000007', 'MCB-63A-2P', 'ABB 63A Double Pole Miniature Circuit Breaker', 'Switchgear', '6kA breaking capacity DIN rail mount protection breaker', 'pcs', 75.00, 120.00, 20),
('p0000008-0000-0000-0000-000000000008', 'SPD-40KA-AC', 'Chint 40kA AC Surge Protective Device Type 2', 'Surge Protection', 'Lightning and voltage surge arrester module 385V', 'pcs', 180.00, 275.00, 10),
('p0000009-0000-0000-0000-000000000009', 'SWT-13A-TWIN', 'Legrand 13A Double Switched Socket with USB-C', 'Accessories', 'Modern brushed metallic finish flush wall socket', 'pcs', 45.00, 75.00, 25),
('p0000010-0000-0000-0000-000000000010', 'CON-20MM-PVC', '20mm High-Impact PVC Conduit Pipe (3m Length)', 'Piping & Trunking', 'Corrosion-proof rigid electrical conduit for surface/concealed wiring', 'pcs', 18.00, 32.00, 40)
ON CONFLICT (sku) DO NOTHING;

-- 6.4 Insert Location Stock Levels
-- Central Warehouse holds the bulk supplier deliveries
INSERT INTO public.location_stock (location_id, product_id, quantity) VALUES
-- Central Warehouse
('11111111-1111-1111-1111-111111111111', 'p0000001-0000-0000-0000-000000000001', 45),
('11111111-1111-1111-1111-111111111111', 'p0000002-0000-0000-0000-000000000002', 32),
('11111111-1111-1111-1111-111111111111', 'p0000003-0000-0000-0000-000000000003', 180),
('11111111-1111-1111-1111-111111111111', 'p0000004-0000-0000-0000-000000000004', 65),
('11111111-1111-1111-1111-111111111111', 'p0000005-0000-0000-0000-000000000005', 120),
('11111111-1111-1111-1111-111111111111', 'p0000006-0000-0000-0000-000000000006', 40),
('11111111-1111-1111-1111-111111111111', 'p0000007-0000-0000-0000-000000000007', 150),
('11111111-1111-1111-1111-111111111111', 'p0000008-0000-0000-0000-000000000008', 90),
('11111111-1111-1111-1111-111111111111', 'p0000009-0000-0000-0000-000000000009', 240),
('11111111-1111-1111-1111-111111111111', 'p00000010-0000-0000-0000-000000000010', 400),

-- Branch 1: Medie (Stocked, some healthy, some low)
('22222222-2222-2222-2222-222222222222', 'p0000001-0000-0000-0000-000000000001', 3),  -- LOW STOCK (threshold 5)
('22222222-2222-2222-2222-222222222222', 'p0000002-0000-0000-0000-000000000002', 2),  -- LOW STOCK (threshold 4)
('22222222-2222-2222-2222-222222222222', 'p0000003-0000-0000-0000-000000000003', 24),
('22222222-2222-2222-2222-222222222222', 'p0000004-0000-0000-0000-000000000004', 12),
('22222222-2222-2222-2222-222222222222', 'p0000005-0000-0000-0000-000000000005', 25),
('22222222-2222-2222-2222-222222222222', 'p0000006-0000-0000-0000-000000000006', 7),
('22222222-2222-2222-2222-222222222222', 'p0000007-0000-0000-0000-000000000007', 35),
('22222222-2222-2222-2222-222222222222', 'p0000008-0000-0000-0000-000000000008', 14),
('22222222-2222-2222-2222-222222222222', 'p0000009-0000-0000-0000-000000000009', 42),
('22222222-2222-2222-2222-222222222222', 'p00000010-0000-0000-0000-000000000010', 80),

-- Branch 2: Lapaz (High velocity retail branch)
('33333333-3333-3333-3333-333333333333', 'p0000001-0000-0000-0000-000000000001', 2),  -- LOW STOCK
('33333333-3333-3333-3333-333333333333', 'p0000002-0000-0000-0000-000000000002', 1),  -- CRITICAL LOW STOCK
('33333333-3333-3333-3333-333333333333', 'p0000003-0000-0000-0000-000000000003', 10), -- LOW STOCK (threshold 15)
('33333333-3333-3333-3333-333333333333', 'p0000004-0000-0000-0000-000000000004', 5),  -- LOW STOCK (threshold 8)
('33333333-3333-3333-3333-333333333333', 'p0000005-0000-0000-0000-000000000005', 18),
('33333333-3333-3333-3333-333333333333', 'p0000006-0000-0000-0000-000000000006', 4),  -- LOW STOCK (threshold 6)
('33333333-3333-3333-3333-333333333333', 'p0000007-0000-0000-0000-000000000007', 48),
('33333333-3333-3333-3333-333333333333', 'p0000008-0000-0000-0000-000000000008', 8),  -- LOW STOCK (threshold 10)
('33333333-3333-3333-3333-333333333333', 'p0000009-0000-0000-0000-000000000009', 55),
('33333333-3333-3333-3333-333333333333', 'p00000010-0000-0000-0000-000000000010', 95),

-- Branch 3: Kumasi (Active Ashanti Hub)
('44444444-4444-4444-4444-444444444444', 'p0000001-0000-0000-0000-000000000001', 6),
('44444444-4444-4444-4444-444444444444', 'p0000002-0000-0000-0000-000000000002', 3),  -- LOW STOCK
('44444444-4444-4444-4444-444444444444', 'p0000003-0000-0000-0000-000000000003', 30),
('44444444-4444-4444-4444-444444444444', 'p0000004-0000-0000-0000-000000000004', 15),
('44444444-4444-4444-4444-444444444444', 'p0000005-0000-0000-0000-000000000005', 22),
('44444444-4444-4444-4444-444444444444', 'p0000006-0000-0000-0000-000000000006', 9),
('44444444-4444-4444-4444-444444444444', 'p0000007-0000-0000-0000-000000000007', 40),
('44444444-4444-4444-4444-444444444444', 'p0000008-0000-0000-0000-000000000008', 12),
('44444444-4444-4444-4444-444444444444', 'p0000009-0000-0000-0000-000000000009', 30),
('44444444-4444-4444-4444-444444444444', 'p00000010-0000-0000-0000-000000000010', 110)
ON CONFLICT (location_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

-- 6.5 Insert Commercial Customers (Buy Now Pay Later Accounts)
INSERT INTO public.customers (id, full_name, phone, email, company_name, tin_number, address, is_active, notes) VALUES
('c1111111-1111-1111-1111-111111111111', 'Alhaji Haruna Issah', '0244987654', 'haruna.const@yahoo.com', 'Haruna Electro-Tech Engineering', 'C0028919283', 'Lapaz New Road, Accra', true, 'Approved for solar inverter installs and commercial building projects'),
('c2222222-2222-2222-2222-222222222222', 'Ing. Samuel K. Osei', '0208112233', 'samuel.osei@oseicontracting.com', 'Osei & Partners Contracting Ltd', 'C0019284711', 'Ahodwo Roundabout, Kumasi', true, 'High credit standing. 30-day payment cycle.'),
('c3333333-3333-3333-3333-333333333333', 'Vida Adobea Boadi', '0553445566', 'vida.adobea@gmail.com', 'Sunlight Volt Energy Services', 'C0093847261', 'Medie Pokuase Interchange Area', true, 'Reliable contractor customer. Prompt MoMo repayments.'),
('c4444444-4444-4444-4444-444444444444', 'Nana Kwasi Agyemang', '0243123789', 'nana.agyemang@buildghana.com', 'Agyemang Commercial Builders', 'C0037192834', 'Adum Commercial Area, Kumasi', true, 'Regular buyer of distribution boards and industrial conduit')
ON CONFLICT (phone) DO NOTHING;

-- 6.6 Insert Credit Ledger Seed Records
-- Alhaji Haruna: Owes GHS 22,700 (Purchases 31,200 - Paid 8,500)
INSERT INTO public.credit_ledger (customer_id, entry_type, amount, payment_method, reference_number, notes) VALUES
('c1111111-1111-1111-1111-111111111111', 'debit', 31200.00, 'Invoice', 'INV-2026-0891', 'Supply of 2x Growatt 5kVA Inverters + 1x Lithium Battery'),
('c1111111-1111-1111-1111-111111111111', 'credit', 8500.00, 'MTN MoMo', 'MM-2026-9921', 'Interim debt settlement by Alhaji Haruna via MoMo transfer')
ON CONFLICT DO NOTHING;

-- Ing. Samuel K. Osei: Owes GHS 42,600 (Purchases 57,600 - Paid 15,000)
INSERT INTO public.credit_ledger (customer_id, entry_type, amount, payment_method, reference_number, notes) VALUES
('c2222222-2222-2222-2222-222222222222', 'debit', 57600.00, 'Invoice', 'INV-2026-0840', 'Kumasi Hospital Solar Backup Phase 1 equipment'),
('c2222222-2222-2222-2222-222222222222', 'credit', 15000.00, 'Bank Transfer', 'GCB-TRF-4819', 'Payment into Centric Systems GCB Bank Account')
ON CONFLICT DO NOTHING;

-- Vida Adobea: Owes GHS 14,200 (Purchases 14,200 - Paid 0)
INSERT INTO public.credit_ledger (customer_id, entry_type, amount, payment_method, reference_number, notes) VALUES
('c3333333-3333-3333-3333-333333333333', 'debit', 14200.00, 'Invoice', 'INV-2026-0912', '1x Dyness 4.8kWh Lithium Battery 48V')
ON CONFLICT DO NOTHING;

-- 6.7 Insert Historical Sales at Branches (Cross-referenced with customers for Restock Verification)
-- Centric - Medie Sales
INSERT INTO public.sales (id, invoice_number, location_id, customer_id, customer_name, cashier_id, status, payment_mode, subtotal, tax_rate, tax_amount, total_amount, amount_paid, notes, created_at) VALUES
('s1111111-1111-1111-1111-111111111111', 'INV-MED-2026-101', '22222222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333', 'Vida Adobea Boadi (Sunlight Volt)', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'completed', 'credit', 14200.00, 0, 0, 14200.00, 0.00, 'Solar backup client order', NOW() - INTERVAL '3 days'),
('s1111111-1111-1111-1111-111111111112', 'INV-MED-2026-102', '22222222-2222-2222-2222-222222222222', NULL, 'Kojo Appiah (Electrician Walk-in)', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'completed', 'cash', 8500.00, 0, 0, 8500.00, 8500.00, 'Cash sale Growatt Inverter', NOW() - INTERVAL '8 days'),
('s1111111-1111-1111-1111-111111111113', 'INV-MED-2026-103', '22222222-2222-2222-2222-222222222222', NULL, 'Dr. Evans Mensah (Residential Client)', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'completed', 'momo', 17000.00, 0, 0, 17000.00, 17000.00, '2x Growatt Inverters paid via MTN MoMo', NOW() - INTERVAL '14 days')
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO public.sale_items (sale_id, product_id, product_name, sku, quantity, unit_price, subtotal) VALUES
('s1111111-1111-1111-1111-111111111111', 'p0000002-0000-0000-0000-000000000002', 'Dyness 4.8kWh LiFePO4 Lithium Battery 48V', 'BAT-LITH-48V', 1, 14200.00, 14200.00),
('s1111111-1111-1111-1111-111111111112', 'p0000001-0000-0000-0000-000000000001', 'Growatt 5kVA Hybrid Solar Inverter 48V', 'INV-5KW-HYB', 1, 8500.00, 8500.00),
('s1111111-1111-1111-1111-111111111113', 'p0000001-0000-0000-0000-000000000001', 'Growatt 5kVA Hybrid Solar Inverter 48V', 'INV-5KW-HYB', 2, 8500.00, 17000.00)
ON CONFLICT DO NOTHING;

-- Centric - Lapaz Sales
INSERT INTO public.sales (id, invoice_number, location_id, customer_id, customer_name, cashier_id, status, payment_mode, subtotal, tax_rate, tax_amount, total_amount, amount_paid, notes, created_at) VALUES
('s2222222-2222-2222-2222-222222222221', 'INV-LPZ-2026-201', '33333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Alhaji Haruna Issah', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'completed', 'credit', 31200.00, 0, 0, 31200.00, 0.00, 'Commercial site install', NOW() - INTERVAL '5 days'),
('s2222222-2222-2222-2222-222222222222', 'INV-LPZ-2026-202', '33333333-3333-3333-3333-333333333333', NULL, 'Grace Antwi (Apex Clinics Lapaz)', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'completed', 'cash', 14200.00, 0, 0, 14200.00, 14200.00, 'Clinic solar backup battery', NOW() - INTERVAL '11 days'),
('s2222222-2222-2222-2222-222222222223', 'INV-LPZ-2026-203', '33333333-3333-3333-3333-333333333333', NULL, 'Kwabena Donkor (Contractor)', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'completed', 'momo', 8500.00, 0, 0, 8500.00, 8500.00, 'Inverter unit paid via MoMo', NOW() - INTERVAL '19 days')
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO public.sale_items (sale_id, product_id, product_name, sku, quantity, unit_price, subtotal) VALUES
('s2222222-2222-2222-2222-222222222221', 'p0000001-0000-0000-0000-000000000001', 'Growatt 5kVA Hybrid Solar Inverter 48V', 'INV-5KW-HYB', 2, 8500.00, 17000.00),
('s2222222-2222-2222-2222-222222222221', 'p0000002-0000-0000-0000-000000000002', 'Dyness 4.8kWh LiFePO4 Lithium Battery 48V', 'BAT-LITH-48V', 1, 14200.00, 14200.00),
('s2222222-2222-2222-2222-222222222222', 'p0000002-0000-0000-0000-000000000002', 'Dyness 4.8kWh LiFePO4 Lithium Battery 48V', 'BAT-LITH-48V', 1, 14200.00, 14200.00),
('s2222222-2222-2222-2222-222222222223', 'p0000001-0000-0000-0000-000000000001', 'Growatt 5kVA Hybrid Solar Inverter 48V', 'INV-5KW-HYB', 1, 8500.00, 8500.00)
ON CONFLICT DO NOTHING;

-- 6.8 Insert Pending Restock Transfer (For Owner Restock Review Screen Demo)
-- Medie requested restock of Growatt Inverters because stock is down to 3 (below threshold 5)
INSERT INTO public.stock_transfers (
    id, transfer_number, from_location_id, to_location_id, status, requested_by, notes, created_at
) VALUES (
    't1111111-1111-1111-1111-111111111111', 'TRF-MED-2026-0041',
    '11111111-1111-1111-1111-111111111111', -- Central Warehouse
    '22222222-2222-2222-2222-222222222222', -- Centric - Medie
    'pending_approval',
    'cccccccc-cccc-cccc-cccc-cccccccccccc', -- Ama Boateng (Medie)
    'Urgent restock requested: Current shelf count is only 3 units. We had 3 sales in the past 14 days and contractor inquiries are high.',
    NOW() - INTERVAL '4 hours'
) ON CONFLICT (transfer_number) DO NOTHING;

INSERT INTO public.stock_transfer_items (transfer_id, product_id, quantity_requested, quantity_approved) VALUES
('t1111111-1111-1111-1111-111111111111', 'p0000001-0000-0000-0000-000000000001', 5, 0),
('t1111111-1111-1111-1111-111111111111', 'p0000002-0000-0000-0000-000000000002', 3, 0)
ON CONFLICT DO NOTHING;

-- Lapaz has an Approved transfer currently awaiting dispatch from Warehouse
INSERT INTO public.stock_transfers (
    id, transfer_number, from_location_id, to_location_id, status, requested_by, approved_by, notes, created_at, approved_at
) VALUES (
    't2222222-2222-2222-2222-222222222222', 'TRF-LPZ-2026-0042',
    '11111111-1111-1111-1111-111111111111', -- Central Warehouse
    '33333333-3333-3333-3333-333333333333', -- Centric - Lapaz
    'approved',
    'dddddddd-dddd-dddd-dddd-dddddddddddd', -- Yaw Ofori (Lapaz)
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Kwame Yeboah (Owner)
    'Approved by Kwame Yeboah after reviewing high turnover at Lapaz shop.',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '18 hours'
) ON CONFLICT (transfer_number) DO NOTHING;

INSERT INTO public.stock_transfer_items (transfer_id, product_id, quantity_requested, quantity_approved) VALUES
('t2222222-2222-2222-2222-222222222222', 'p0000004-0000-0000-0000-000000000004', 10, 10),
('t2222222-2222-2222-2222-222222222222', 'p0000006-0000-0000-0000-000000000006', 5, 5)
ON CONFLICT DO NOTHING;

-- Kumasi has a Dispatched transfer in transit with driver waybill
INSERT INTO public.stock_transfers (
    id, transfer_number, from_location_id, to_location_id, status, requested_by, approved_by, dispatched_by,
    waybill_number, driver_name, driver_phone, notes, created_at, approved_at, dispatched_at
) VALUES (
    't3333333-3333-3333-3333-333333333333', 'TRF-KMS-2026-0040',
    '11111111-1111-1111-1111-111111111111', -- Central Warehouse
    '44444444-4444-4444-4444-444444444444', -- Centric - Kumasi
    'dispatched',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', -- Akosua Darko (Kumasi)
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Kwame Yeboah
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- Kofi Mensah (Warehouse)
    'WB-GH-89021', 'Emmanuel K. Addo (VIP Haulage)', '+233 24 333 8811',
    'Dispatched via VIP Cargo Truck #GT-4819-22 to Kumasi Suame shop.',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '6 hours'
) ON CONFLICT (transfer_number) DO NOTHING;

INSERT INTO public.stock_transfer_items (transfer_id, product_id, quantity_requested, quantity_approved, quantity_dispatched) VALUES
('t3333333-3333-3333-3333-333333333333', 'p0000002-0000-0000-0000-000000000002', 4, 4, 4),
('t3333333-3333-3333-3333-333333333333', 'p0000003-0000-0000-0000-000000000003', 25, 25, 25)
ON CONFLICT DO NOTHING;

-- 6.9 Enable Supabase Realtime for Live Sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.locations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.location_stock;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_transfers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;
ALTER PUBLICATION supabase_realtime ADD TABLE public.credit_ledger;
