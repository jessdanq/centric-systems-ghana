// =============================================================================
// Centric Systems Ghana Limited - Canonical Initial Data & State
// Built for Kwame Yeboah (Owner)
// =============================================================================

export const LOCATIONS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Central Warehouse',
    code: 'WH-ACCRA',
    type: 'warehouse',
    address: 'Plot 48, Spintex Heavy Industrial Area, Accra, Ghana',
    phone: '+233 24 400 1100',
    manager_name: 'Kofi Mensah',
    is_warehouse: true
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Centric - Medie',
    code: 'BR-MEDIE',
    type: 'branch',
    address: 'Nsawam Road, Medie Tollbooth Commercial Junction, Greater Accra',
    phone: '+233 20 500 2200',
    manager_name: 'Ama Boateng',
    is_warehouse: false
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Centric - Lapaz',
    code: 'BR-LAPAZ',
    type: 'branch',
    address: 'George Walker Bush Highway, Near Nii Boi Town Junction, Lapaz, Accra',
    phone: '+233 55 600 3300',
    manager_name: 'Yaw Ofori',
    is_warehouse: false
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Centric - Kumasi',
    code: 'BR-KUMASI',
    type: 'branch',
    address: 'Suame Magazine Commercial Strip, Off Sunyani Road, Kumasi, Ashanti',
    phone: '+233 24 700 4400',
    manager_name: 'Akosua Darko',
    is_warehouse: false
  }
];

export const DEMO_USERS = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Kwame Yeboah',
    role: 'owner',
    role_label: 'Business Owner & Managing Director',
    assigned_location_id: null,
    location_name: 'All Locations (Headquarters)',
    email: 'kwame@centricsystems.gh',
    phone: '+233 24 100 0001',
    avatar: 'KY'
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Kofi Mensah',
    role: 'warehouse_manager',
    role_label: 'Central Warehouse Logistics Manager',
    assigned_location_id: '11111111-1111-1111-1111-111111111111',
    location_name: 'Central Warehouse (Accra)',
    email: 'kofi.warehouse@centricsystems.gh',
    phone: '+233 24 400 1100',
    avatar: 'KM'
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    name: 'Ama Boateng',
    role: 'branch_staff',
    role_label: 'Branch Sales Clerk & Inventory Lead',
    assigned_location_id: '22222222-2222-2222-2222-222222222222',
    location_name: 'Centric - Medie',
    email: 'ama.medie@centricsystems.gh',
    phone: '+233 20 500 2200',
    avatar: 'AB'
  },
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    name: 'Yaw Ofori',
    role: 'branch_staff',
    role_label: 'Branch Sales Clerk',
    assigned_location_id: '33333333-3333-3333-3333-333333333333',
    location_name: 'Centric - Lapaz',
    email: 'yaw.lapaz@centricsystems.gh',
    phone: '+233 55 600 3300',
    avatar: 'YO'
  },
  {
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    name: 'Akosua Darko',
    role: 'branch_staff',
    role_label: 'Branch Sales Clerk',
    assigned_location_id: '44444444-4444-4444-4444-444444444444',
    location_name: 'Centric - Kumasi',
    email: 'akosua.kumasi@centricsystems.gh',
    phone: '+233 24 700 4400',
    avatar: 'AD'
  },
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Alhaji Haruna Issah',
    role: 'customer',
    role_label: 'Credit Customer (Haruna Electro-Tech)',
    assigned_location_id: null,
    location_name: 'Customer Portal',
    email: 'haruna.const@yahoo.com',
    phone: '0244987654',
    customer_id: 'c1111111-1111-1111-1111-111111111111',
    avatar: 'AH'
  }
];

export const PRODUCTS = [
  {
    id: 'p0000001-0000-0000-0000-000000000001',
    sku: 'INV-5KW-HYB',
    name: 'Growatt 5kVA Hybrid Solar Inverter 48V',
    category: 'Inverters',
    description: 'Pure sine wave hybrid inverter with 80A MPPT solar charge controller and grid failover',
    unit_of_measure: 'unit',
    cost_price: 6800.00,
    unit_price: 8500.00,
    low_stock_threshold: 5,
    is_active: true
  },
  {
    id: 'p0000002-0000-0000-0000-000000000002',
    sku: 'BAT-LITH-48V',
    name: 'Dyness 4.8kWh LiFePO4 Lithium Battery 48V',
    category: 'Batteries',
    description: 'Deep cycle lithium iron phosphate battery module with intelligent BMS and 6000 cycles',
    unit_of_measure: 'unit',
    cost_price: 11500.00,
    unit_price: 14200.00,
    low_stock_threshold: 4,
    is_active: true
  },
  {
    id: 'p0000003-0000-0000-0000-000000000003',
    sku: 'PAN-550W-MONO',
    name: 'Canadian Solar 550W Monocrystalline Panel',
    category: 'Solar Panels',
    description: 'High-efficiency tier-1 half-cell solar photovoltaic module with IP68 junction box',
    unit_of_measure: 'pcs',
    cost_price: 1100.00,
    unit_price: 1450.00,
    low_stock_threshold: 15,
    is_active: true
  },
  {
    id: 'p0000004-0000-0000-0000-000000000004',
    sku: 'CBL-16MM-CU',
    name: '16mm² Single Core Copper Cable (100m Roll)',
    category: 'Cables & Wiring',
    description: 'Pure copper flame-retardant heavy-duty conduit building wire for main distribution',
    unit_of_measure: 'roll',
    cost_price: 1450.00,
    unit_price: 1950.00,
    low_stock_threshold: 8,
    is_active: true
  },
  {
    id: 'p0000005-0000-0000-0000-000000000005',
    sku: 'CBL-2.5MM-3C',
    name: '2.5mm² 3-Core Flat Twin & Earth Cable (100m)',
    category: 'Cables & Wiring',
    description: 'Standard domestic & commercial electrical installation cable with earth lead',
    unit_of_measure: 'roll',
    cost_price: 720.00,
    unit_price: 980.00,
    low_stock_threshold: 12,
    is_active: true
  },
  {
    id: 'p0000006-0000-0000-0000-000000000006',
    sku: 'DB-12WAY-3PH',
    name: 'Schneider 12-Way Three Phase Distribution Board',
    category: 'Switchgear',
    description: 'Sheet steel consumer unit with 100A main isolator switch and busbar assembly',
    unit_of_measure: 'unit',
    cost_price: 850.00,
    unit_price: 1200.00,
    low_stock_threshold: 6,
    is_active: true
  },
  {
    id: 'p0000007-0000-0000-0000-000000000007',
    sku: 'MCB-63A-2P',
    name: 'ABB 63A Double Pole Miniature Circuit Breaker',
    category: 'Switchgear',
    description: '6kA breaking capacity DIN rail mount protection circuit breaker 230/400V',
    unit_of_measure: 'pcs',
    cost_price: 75.00,
    unit_price: 120.00,
    low_stock_threshold: 20,
    is_active: true
  },
  {
    id: 'p0000008-0000-0000-0000-000000000008',
    sku: 'SPD-40KA-AC',
    name: 'Chint 40kA AC Surge Protective Device Type 2',
    category: 'Surge Protection',
    description: 'Lightning and voltage surge arrester module 385V pluggable cartridge',
    unit_of_measure: 'pcs',
    cost_price: 180.00,
    unit_price: 275.00,
    low_stock_threshold: 10,
    is_active: true
  },
  {
    id: 'p0000009-0000-0000-0000-000000000009',
    sku: 'SWT-13A-TWIN',
    name: 'Legrand 13A Double Switched Socket with USB-C',
    category: 'Accessories',
    description: 'Modern brushed metallic finish flush wall socket with dual 3.1A fast USB charge ports',
    unit_of_measure: 'pcs',
    cost_price: 45.00,
    unit_price: 75.00,
    low_stock_threshold: 25,
    is_active: true
  },
  {
    id: 'p0000010-0000-0000-0000-000000000010',
    sku: 'CON-20MM-PVC',
    name: '20mm High-Impact PVC Conduit Pipe (3m Length)',
    category: 'Piping & Trunking',
    description: 'Corrosion-proof rigid electrical conduit for surface or concealed wiring installations',
    unit_of_measure: 'pcs',
    cost_price: 18.00,
    unit_price: 32.00,
    low_stock_threshold: 40,
    is_active: true
  }
];

export const INITIAL_LOCATION_STOCK = [
  // Central Warehouse (Bulk supplier inventory)
  { location_id: '11111111-1111-1111-1111-111111111111', product_id: 'p0000001-0000-0000-0000-000000000001', quantity: 45 },
  { location_id: '11111111-1111-1111-1111-111111111111', product_id: 'p0000002-0000-0000-0000-000000000002', quantity: 32 },
  { location_id: '11111111-1111-1111-1111-111111111111', product_id: 'p0000003-0000-0000-0000-000000000003', quantity: 180 },
  { location_id: '11111111-1111-1111-1111-111111111111', product_id: 'p0000004-0000-0000-0000-000000000004', quantity: 65 },
  { location_id: '11111111-1111-1111-1111-111111111111', product_id: 'p0000005-0000-0000-0000-000000000005', quantity: 120 },
  { location_id: '11111111-1111-1111-1111-111111111111', product_id: 'p0000006-0000-0000-0000-000000000006', quantity: 40 },
  { location_id: '11111111-1111-1111-1111-111111111111', product_id: 'p0000007-0000-0000-0000-000000000007', quantity: 150 },
  { location_id: '11111111-1111-1111-1111-111111111111', product_id: 'p0000008-0000-0000-0000-000000000008', quantity: 90 },
  { location_id: '11111111-1111-1111-1111-111111111111', product_id: 'p0000009-0000-0000-0000-000000000009', quantity: 240 },
  { location_id: '11111111-1111-1111-1111-111111111111', product_id: 'p0000010-0000-0000-0000-000000000010', quantity: 400 },

  // Medie Branch (Low stock on Growatt Inverters & Dyness Batteries)
  { location_id: '22222222-2222-2222-2222-222222222222', product_id: 'p0000001-0000-0000-0000-000000000001', quantity: 3 }, // LOW (threshold: 5)
  { location_id: '22222222-2222-2222-2222-222222222222', product_id: 'p0000002-0000-0000-0000-000000000002', quantity: 2 }, // LOW (threshold: 4)
  { location_id: '22222222-2222-2222-2222-222222222222', product_id: 'p0000003-0000-0000-0000-000000000003', quantity: 24 },
  { location_id: '22222222-2222-2222-2222-222222222222', product_id: 'p0000004-0000-0000-0000-000000000004', quantity: 12 },
  { location_id: '22222222-2222-2222-2222-222222222222', product_id: 'p0000005-0000-0000-0000-000000000005', quantity: 25 },
  { location_id: '22222222-2222-2222-2222-222222222222', product_id: 'p0000006-0000-0000-0000-000000000006', quantity: 7 },
  { location_id: '22222222-2222-2222-2222-222222222222', product_id: 'p0000007-0000-0000-0000-000000000007', quantity: 35 },
  { location_id: '22222222-2222-2222-2222-222222222222', product_id: 'p0000008-0000-0000-0000-000000000008', quantity: 14 },
  { location_id: '22222222-2222-2222-2222-222222222222', product_id: 'p0000009-0000-0000-0000-000000000009', quantity: 42 },
  { location_id: '22222222-2222-2222-2222-222222222222', product_id: 'p0000010-0000-0000-0000-000000000010', quantity: 80 },

  // Lapaz Branch (Critical low on inverters, batteries & copper cable)
  { location_id: '33333333-3333-3333-3333-333333333333', product_id: 'p0000001-0000-0000-0000-000000000001', quantity: 2 }, // LOW
  { location_id: '33333333-3333-3333-3333-333333333333', product_id: 'p0000002-0000-0000-0000-000000000002', quantity: 1 }, // CRITICAL LOW
  { location_id: '33333333-3333-3333-3333-333333333333', product_id: 'p0000003-0000-0000-0000-000000000003', quantity: 10 }, // LOW
  { location_id: '33333333-3333-3333-3333-333333333333', product_id: 'p0000004-0000-0000-0000-000000000004', quantity: 5 },  // LOW
  { location_id: '33333333-3333-3333-3333-333333333333', product_id: 'p0000005-0000-0000-0000-000000000005', quantity: 18 },
  { location_id: '33333333-3333-3333-3333-333333333333', product_id: 'p0000006-0000-0000-0000-000000000006', quantity: 4 },  // LOW
  { location_id: '33333333-3333-3333-3333-333333333333', product_id: 'p0000007-0000-0000-0000-000000000007', quantity: 48 },
  { location_id: '33333333-3333-3333-3333-333333333333', product_id: 'p0000008-0000-0000-0000-000000000008', quantity: 8 },  // LOW
  { location_id: '33333333-3333-3333-3333-333333333333', product_id: 'p0000009-0000-0000-0000-000000000009', quantity: 55 },
  { location_id: '33333333-3333-3333-3333-333333333333', product_id: 'p0000010-0000-0000-0000-000000000010', quantity: 95 },

  // Kumasi Branch
  { location_id: '44444444-4444-4444-4444-444444444444', product_id: 'p0000001-0000-0000-0000-000000000001', quantity: 6 },
  { location_id: '44444444-4444-4444-4444-444444444444', product_id: 'p0000002-0000-0000-0000-000000000002', quantity: 3 }, // LOW
  { location_id: '44444444-4444-4444-4444-444444444444', product_id: 'p0000003-0000-0000-0000-000000000003', quantity: 30 },
  { location_id: '44444444-4444-4444-4444-444444444444', product_id: 'p0000004-0000-0000-0000-000000000004', quantity: 15 },
  { location_id: '44444444-4444-4444-4444-444444444444', product_id: 'p0000005-0000-0000-0000-000000000005', quantity: 22 },
  { location_id: '44444444-4444-4444-4444-444444444444', product_id: 'p0000006-0000-0000-0000-000000000006', quantity: 9 },
  { location_id: '44444444-4444-4444-4444-444444444444', product_id: 'p0000007-0000-0000-0000-000000000007', quantity: 40 },
  { location_id: '44444444-4444-4444-4444-444444444444', product_id: 'p0000008-0000-0000-0000-000000000008', quantity: 12 },
  { location_id: '44444444-4444-4444-4444-444444444444', product_id: 'p0000009-0000-0000-0000-000000000009', quantity: 30 },
  { location_id: '44444444-4444-4444-4444-444444444444', product_id: 'p0000010-0000-0000-0000-000000000010', quantity: 110 }
];

export const CUSTOMERS = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    full_name: 'Alhaji Haruna Issah',
    phone: '0244987654',
    email: 'haruna.const@yahoo.com',
    company_name: 'Haruna Electro-Tech Engineering',
    tin_number: 'C0028919283',
    address: 'Lapaz New Road, Accra',
    is_active: true,
    notes: 'Approved commercial solar contractor. Prompt payment history.'
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    full_name: 'Ing. Samuel K. Osei',
    phone: '0208112233',
    email: 'samuel.osei@oseicontracting.com',
    company_name: 'Osei & Partners Contracting Ltd',
    tin_number: 'C0019284711',
    address: 'Ahodwo Roundabout, Kumasi',
    is_active: true,
    notes: 'Top tier industrial electrical engineering contractor.'
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    full_name: 'Vida Adobea Boadi',
    phone: '0553445566',
    email: 'vida.adobea@gmail.com',
    company_name: 'Sunlight Volt Energy Services',
    tin_number: 'C0093847261',
    address: 'Medie Pokuase Interchange Corridor',
    is_active: true,
    notes: 'Regular buyer of Growatt inverters and solar PV panels at Medie shop.'
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    full_name: 'Nana Kwasi Agyemang',
    phone: '0243123789',
    email: 'nana.agyemang@buildghana.com',
    company_name: 'Agyemang Commercial Builders',
    tin_number: 'C0037192834',
    address: 'Adum Commercial Area, Kumasi',
    is_active: true,
    notes: 'Clean balance, approved for distribution boards & conduit pipes.'
  }
];

export const INITIAL_CREDIT_LEDGER = [
  // Alhaji Haruna: Owes 22,700 (Purchases 31,200 - Paid 8,500)
  {
    id: 'l1111111-1111-1111-1111-111111111111',
    customer_id: 'c1111111-1111-1111-1111-111111111111',
    sale_id: 's2222222-2222-2222-2222-222222222221',
    entry_type: 'debit',
    amount: 31200.00,
    payment_method: 'Invoice',
    reference_number: 'INV-LPZ-2026-201',
    notes: 'Supply of 2x Growatt 5kVA Inverters + 1x Lithium Battery',
    recorded_by_name: 'Yaw Ofori',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'l1111111-1111-1111-1111-111111111112',
    customer_id: 'c1111111-1111-1111-1111-111111111111',
    sale_id: null,
    entry_type: 'credit',
    amount: 8500.00,
    payment_method: 'MTN MoMo',
    reference_number: 'MM-2026-9921',
    notes: 'Interim debt settlement by Alhaji Haruna via MoMo Merchant Till',
    recorded_by_name: 'Kwame Yeboah',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },

  // Ing. Samuel K. Osei: Owes 42,600 (Purchases 57,600 - Paid 15,000)
  {
    id: 'l2222222-2222-2222-2222-222222222221',
    customer_id: 'c2222222-2222-2222-2222-222222222222',
    sale_id: null,
    entry_type: 'debit',
    amount: 57600.00,
    payment_method: 'Invoice',
    reference_number: 'INV-KMS-2026-0840',
    notes: 'Kumasi Hospital Solar Backup Phase 1 equipment & cabling',
    recorded_by_name: 'Akosua Darko',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'l2222222-2222-2222-2222-222222222222',
    customer_id: 'c2222222-2222-2222-2222-222222222222',
    sale_id: null,
    entry_type: 'credit',
    amount: 15000.00,
    payment_method: 'Bank Wire',
    reference_number: 'GCB-TRF-4819',
    notes: 'Payment received into Centric Systems GCB Bank Account',
    recorded_by_name: 'Kwame Yeboah',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },

  // Vida Adobea: Owes 14,200 (Purchases 14,200 - Paid 0)
  {
    id: 'l3333333-3333-3333-3333-333333333331',
    customer_id: 'c3333333-3333-3333-3333-333333333333',
    sale_id: 's1111111-1111-1111-1111-111111111111',
    entry_type: 'debit',
    amount: 14200.00,
    payment_method: 'Invoice',
    reference_number: 'INV-MED-2026-101',
    notes: '1x Dyness 4.8kWh LiFePO4 Lithium Battery 48V on credit terms',
    recorded_by_name: 'Ama Boateng',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const INITIAL_SALES = [
  // Medie Branch Past Sales
  {
    id: 's1111111-1111-1111-1111-111111111111',
    invoice_number: 'INV-MED-2026-101',
    location_id: '22222222-2222-2222-2222-222222222222',
    location_name: 'Centric - Medie',
    customer_id: 'c3333333-3333-3333-3333-333333333333',
    customer_name: 'Vida Adobea Boadi (Sunlight Volt)',
    customer_phone: '0553445566',
    cashier_name: 'Ama Boateng',
    status: 'completed',
    payment_mode: 'credit',
    subtotal: 14200.00,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 14200.00,
    amount_paid: 0.00,
    change_due: 0.00,
    notes: 'Solar backup client order - 30 days settlement agreement',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000002-0000-0000-0000-000000000002',
        product_name: 'Dyness 4.8kWh LiFePO4 Lithium Battery 48V',
        sku: 'BAT-LITH-48V',
        quantity: 1,
        unit_price: 14200.00,
        subtotal: 14200.00
      }
    ]
  },
  {
    id: 's1111111-1111-1111-1111-111111111112',
    invoice_number: 'INV-MED-2026-102',
    location_id: '22222222-2222-2222-2222-222222222222',
    location_name: 'Centric - Medie',
    customer_id: null,
    customer_name: 'Kojo Appiah (Electrician Walk-in)',
    customer_phone: '0244712399',
    cashier_name: 'Ama Boateng',
    status: 'completed',
    payment_mode: 'cash',
    subtotal: 8500.00,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 8500.00,
    amount_paid: 8500.00,
    change_due: 0.00,
    notes: 'Cash sale Growatt Inverter for residential site in Pokuase',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000001-0000-0000-0000-000000000001',
        product_name: 'Growatt 5kVA Hybrid Solar Inverter 48V',
        sku: 'INV-5KW-HYB',
        quantity: 1,
        unit_price: 8500.00,
        subtotal: 8500.00
      }
    ]
  },
  {
    id: 's1111111-1111-1111-1111-111111111113',
    invoice_number: 'INV-MED-2026-103',
    location_id: '22222222-2222-2222-2222-222222222222',
    location_name: 'Centric - Medie',
    customer_id: null,
    customer_name: 'Dr. Evans Mensah (Residential Client)',
    customer_phone: '0205882211',
    cashier_name: 'Ama Boateng',
    status: 'completed',
    payment_mode: 'momo',
    subtotal: 17000.00,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 17000.00,
    amount_paid: 17000.00,
    change_due: 0.00,
    notes: '2x Growatt Inverters paid via MTN Mobile Money',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000001-0000-0000-0000-000000000001',
        product_name: 'Growatt 5kVA Hybrid Solar Inverter 48V',
        sku: 'INV-5KW-HYB',
        quantity: 2,
        unit_price: 8500.00,
        subtotal: 17000.00
      }
    ]
  },

  // Lapaz Branch Past Sales
  {
    id: 's2222222-2222-2222-2222-222222222221',
    invoice_number: 'INV-LPZ-2026-201',
    location_id: '33333333-3333-3333-3333-333333333333',
    location_name: 'Centric - Lapaz',
    customer_id: 'c1111111-1111-1111-1111-111111111111',
    customer_name: 'Alhaji Haruna Issah',
    customer_phone: '0244987654',
    cashier_name: 'Yaw Ofori',
    status: 'completed',
    payment_mode: 'credit',
    subtotal: 31200.00,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 31200.00,
    amount_paid: 0.00,
    change_due: 0.00,
    notes: 'Commercial site installation equipment on credit account',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000001-0000-0000-0000-000000000001',
        product_name: 'Growatt 5kVA Hybrid Solar Inverter 48V',
        sku: 'INV-5KW-HYB',
        quantity: 2,
        unit_price: 8500.00,
        subtotal: 17000.00
      },
      {
        product_id: 'p0000002-0000-0000-0000-000000000002',
        product_name: 'Dyness 4.8kWh LiFePO4 Lithium Battery 48V',
        sku: 'BAT-LITH-48V',
        quantity: 1,
        unit_price: 14200.00,
        subtotal: 14200.00
      }
    ]
  },
  {
    id: 's2222222-2222-2222-2222-222222222222',
    invoice_number: 'INV-LPZ-2026-202',
    location_id: '33333333-3333-3333-3333-333333333333',
    location_name: 'Centric - Lapaz',
    customer_id: null,
    customer_name: 'Grace Antwi (Apex Clinics Lapaz)',
    customer_phone: '0249871122',
    cashier_name: 'Yaw Ofori',
    status: 'completed',
    payment_mode: 'cash',
    subtotal: 14200.00,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 14200.00,
    amount_paid: 14200.00,
    change_due: 0.00,
    notes: 'Clinic solar backup battery paid in cash',
    created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000002-0000-0000-0000-000000000002',
        product_name: 'Dyness 4.8kWh LiFePO4 Lithium Battery 48V',
        sku: 'BAT-LITH-48V',
        quantity: 1,
        unit_price: 14200.00,
        subtotal: 14200.00
      }
    ]
  },
  {
    id: 's2222222-2222-2222-2222-222222222223',
    invoice_number: 'INV-LPZ-2026-203',
    location_id: '33333333-3333-3333-3333-333333333333',
    location_name: 'Centric - Lapaz',
    customer_id: null,
    customer_name: 'Kwabena Donkor (Electrical Contractor)',
    customer_phone: '0501239876',
    cashier_name: 'Yaw Ofori',
    status: 'completed',
    payment_mode: 'momo',
    subtotal: 8500.00,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 8500.00,
    amount_paid: 8500.00,
    change_due: 0.00,
    notes: 'Growatt Inverter unit paid via Telecel Cash',
    created_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000001-0000-0000-0000-000000000001',
        product_name: 'Growatt 5kVA Hybrid Solar Inverter 48V',
        sku: 'INV-5KW-HYB',
        quantity: 1,
        unit_price: 8500.00,
        subtotal: 8500.00
      }
    ]
  }
];

export const INITIAL_STOCK_TRANSFERS = [
  // 1. Pending Approval by Kwame Yeboah (Requested by Medie)
  {
    id: 't1111111-1111-1111-1111-111111111111',
    transfer_number: 'TRF-MED-2026-0041',
    from_location_id: '11111111-1111-1111-1111-111111111111', // Central Warehouse
    to_location_id: '22222222-2222-2222-2222-222222222222',   // Centric - Medie
    from_name: 'Central Warehouse',
    to_name: 'Centric - Medie',
    status: 'pending_approval',
    requested_by_name: 'Ama Boateng (Medie Clerk)',
    notes: 'Urgent restock requested: Current shelf count is only 3 inverters and 2 lithium batteries. Contractor requests are high for Pokuase estates.',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000001-0000-0000-0000-000000000001',
        product_name: 'Growatt 5kVA Hybrid Solar Inverter 48V',
        sku: 'INV-5KW-HYB',
        quantity_requested: 5,
        quantity_approved: 0,
        quantity_dispatched: 0,
        quantity_received: 0
      },
      {
        product_id: 'p0000002-0000-0000-0000-000000000002',
        product_name: 'Dyness 4.8kWh LiFePO4 Lithium Battery 48V',
        sku: 'BAT-LITH-48V',
        quantity_requested: 3,
        quantity_approved: 0,
        quantity_dispatched: 0,
        quantity_received: 0
      }
    ]
  },

  // 2. Approved by Kwame Yeboah, Awaiting Dispatch by Central Warehouse (Lapaz)
  {
    id: 't2222222-2222-2222-2222-222222222222',
    transfer_number: 'TRF-LPZ-2026-0042',
    from_location_id: '11111111-1111-1111-1111-111111111111',
    to_location_id: '33333333-3333-3333-3333-333333333333',
    from_name: 'Central Warehouse',
    to_name: 'Centric - Lapaz',
    status: 'approved',
    requested_by_name: 'Yaw Ofori (Lapaz Clerk)',
    approved_by_name: 'Kwame Yeboah (Owner)',
    owner_review_notes: 'Approved for 10 rolls 16mm copper cable and 5 distribution units after verifying rapid turnover at Lapaz shop.',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    approved_at: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000004-0000-0000-0000-000000000004',
        product_name: '16mm² Single Core Copper Cable (100m Roll)',
        sku: 'CBL-16MM-CU',
        quantity_requested: 10,
        quantity_approved: 10,
        quantity_dispatched: 0,
        quantity_received: 0
      },
      {
        product_id: 'p0000006-0000-0000-0000-000000000006',
        product_name: 'Schneider 12-Way Three Phase Distribution Board',
        sku: 'DB-12WAY-3PH',
        quantity_requested: 5,
        quantity_approved: 5,
        quantity_dispatched: 0,
        quantity_received: 0
      }
    ]
  },

  // 3. Dispatched in Transit to Kumasi (With VIP Haulage Driver details)
  {
    id: 't3333333-3333-3333-3333-333333333333',
    transfer_number: 'TRF-KMS-2026-0040',
    from_location_id: '11111111-1111-1111-1111-111111111111',
    to_location_id: '44444444-4444-4444-4444-444444444444',
    from_name: 'Central Warehouse',
    to_name: 'Centric - Kumasi',
    status: 'dispatched',
    requested_by_name: 'Akosua Darko (Kumasi)',
    approved_by_name: 'Kwame Yeboah',
    dispatched_by_name: 'Kofi Mensah (Warehouse)',
    waybill_number: 'WB-GH-89021',
    driver_name: 'Emmanuel K. Addo (VIP Cargo Logistics)',
    driver_phone: '+233 24 333 8811',
    notes: 'Dispatched via VIP Cargo Logistics Truck #GT-4819-22 to Suame Magazine shop.',
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    approved_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    dispatched_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000002-0000-0000-0000-000000000002',
        product_name: 'Dyness 4.8kWh LiFePO4 Lithium Battery 48V',
        sku: 'BAT-LITH-48V',
        quantity_requested: 4,
        quantity_approved: 4,
        quantity_dispatched: 4,
        quantity_received: 0
      },
      {
        product_id: 'p0000003-0000-0000-0000-000000000003',
        product_name: 'Canadian Solar 550W Monocrystalline Panel',
        sku: 'PAN-550W-MONO',
        quantity_requested: 25,
        quantity_approved: 25,
        quantity_dispatched: 25,
        quantity_received: 0
      }
    ]
  }
];

export const SUPPLIER_INTAKES = [
  {
    id: 'intake-001',
    receipt_number: 'REC-SUP-2026-018',
    supplier_name: 'Growatt New Energy Overseas Ltd',
    supplier_invoice_ref: 'GW-EXP-77218',
    received_by_name: 'Kofi Mensah',
    warehouse_name: 'Central Warehouse (Spintex)',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    total_cost: 136000.00,
    items: [
      {
        product_name: 'Growatt 5kVA Hybrid Solar Inverter 48V',
        sku: 'INV-5KW-HYB',
        quantity: 20,
        unit_cost: 6800.00,
        subtotal: 136000.00
      }
    ]
  },
  {
    id: 'intake-002',
    receipt_number: 'REC-SUP-2026-019',
    supplier_name: 'Dyness Africa Energy Ltd',
    supplier_invoice_ref: 'DYN-AFR-0994',
    received_by_name: 'Kofi Mensah',
    warehouse_name: 'Central Warehouse (Spintex)',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    total_cost: 172500.00,
    items: [
      {
        product_name: 'Dyness 4.8kWh LiFePO4 Lithium Battery 48V',
        sku: 'BAT-LITH-48V',
        quantity: 15,
        unit_cost: 11500.00,
        subtotal: 172500.00
      }
    ]
  }
];
