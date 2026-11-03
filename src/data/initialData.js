// =============================================================================
// Centric Systems Ghana Limited - Canonical Initial Data & State
// Gate Automation, Access Control & Security Supplies Catalog
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
    "id": "p0000001-0000-0000-0000-000000000001",
    "sku": "CEN-D5-EVO-SMART-PLU",
    "name": "D5 Evo Smart Plus",
    "category": "Gate Motors & Kits",
    "description": "High-speed sliding gate motor full kit for domestic and light-industrial gates up to 500kg with battery backup.",
    "unit_of_measure": "kit",
    "cost_price": 4773,
    "unit_price": 6450,
    "low_stock_threshold": 4,
    "is_active": true
  },
  {
    "id": "p0000002-0000-0000-0000-000000000001",
    "sku": "CEN-D6-SMART-PLUS",
    "name": "D6 Smart Plus",
    "category": "Gate Motors & Kits",
    "description": "Next-generation intelligent sliding gate automation kit with MyCentsys smartphone setup and ultra-rapid travel speed.",
    "unit_of_measure": "kit",
    "cost_price": 5402,
    "unit_price": 7300,
    "low_stock_threshold": 4,
    "is_active": true
  },
  {
    "id": "p0000003-0000-0000-0000-000000000001",
    "sku": "CEN-D10-SMART-PLUS",
    "name": "D10 Smart Plus",
    "category": "Gate Motors & Kits",
    "description": "Heavy-duty commercial sliding gate motor system for demanding industrial gates up to 1000kg with intelligent speed control.",
    "unit_of_measure": "kit",
    "cost_price": 8732,
    "unit_price": 11800,
    "low_stock_threshold": 3,
    "is_active": true
  },
  {
    "id": "p0000004-0000-0000-0000-000000000001",
    "sku": "CEN-D10-TURBO-SMART-",
    "name": "D10 Turbo Smart Plus",
    "category": "Gate Motors & Kits",
    "description": "High-speed commercial operator kit for high-traffic gates, delivering exceptional velocity and sustained duty cycle.",
    "unit_of_measure": "kit",
    "cost_price": 8658,
    "unit_price": 11700,
    "low_stock_threshold": 3,
    "is_active": true
  },
  {
    "id": "p0000005-0000-0000-0000-000000000001",
    "sku": "CEN-VANTAGE",
    "name": "Vantage",
    "category": "Gate Motors & Kits",
    "description": "Heavy-duty linear swing gate automation complete system with dual articulated arms and electronic master controller.",
    "unit_of_measure": "kit",
    "cost_price": 9250,
    "unit_price": 12500,
    "low_stock_threshold": 2,
    "is_active": true
  },
  {
    "id": "p0000006-0000-0000-0000-000000000001",
    "sku": "CEN-BATTERY",
    "name": "Battery",
    "category": "Chargers & Power",
    "description": "12V 7.2Ah / 8Ah rechargeable sealed lead-acid (SLA) deep-cycle gate motor standby backup battery.",
    "unit_of_measure": "pcs",
    "cost_price": 296,
    "unit_price": 400,
    "low_stock_threshold": 15,
    "is_active": true
  },
  {
    "id": "p0000007-0000-0000-0000-000000000001",
    "sku": "CEN-D5-EVO-CHARGER",
    "name": "D5 Evo Charger",
    "category": "Chargers & Power",
    "description": "Replacement switch-mode 2A internal battery charger unit for Centurion D5 Evo gate motor series.",
    "unit_of_measure": "pcs",
    "cost_price": 740,
    "unit_price": 1000,
    "low_stock_threshold": 5,
    "is_active": true
  },
  {
    "id": "p0000008-0000-0000-0000-000000000001",
    "sku": "CEN-D10-STANDARD-CHA",
    "name": "D10 Standard Charger",
    "category": "Chargers & Power",
    "description": "Standard 27V / 2A switch-mode battery charger module for Centurion D10 and A10 commercial operators.",
    "unit_of_measure": "pcs",
    "cost_price": 777,
    "unit_price": 1050,
    "low_stock_threshold": 4,
    "is_active": true
  },
  {
    "id": "p0000009-0000-0000-0000-000000000001",
    "sku": "CEN-D5-EVO-SMART-CHA",
    "name": "D5 Evo Smart Charger",
    "category": "Chargers & Power",
    "description": "Intelligent multi-stage plug-in battery charger power pack for D5 Evo Smart automation systems.",
    "unit_of_measure": "pcs",
    "cost_price": 703,
    "unit_price": 950,
    "low_stock_threshold": 5,
    "is_active": true
  },
  {
    "id": "p0000010-0000-0000-0000-000000000001",
    "sku": "CEN-D10-SMART-CHARGE",
    "name": "D10 Smart Charger",
    "category": "Chargers & Power",
    "description": "High-capacity multi-stage intelligent battery charger module for D10 and D20 Smart series.",
    "unit_of_measure": "pcs",
    "cost_price": 777,
    "unit_price": 1050,
    "low_stock_threshold": 4,
    "is_active": true
  },
  {
    "id": "p0000011-0000-0000-0000-000000000001",
    "sku": "CEN-D6-SMART-CHARGER",
    "name": "D6 Smart Charger",
    "category": "Chargers & Power",
    "description": "Intelligent plug-in charger module designed specifically for Centurion D6 Smart gate automation.",
    "unit_of_measure": "pcs",
    "cost_price": 703,
    "unit_price": 950,
    "low_stock_threshold": 5,
    "is_active": true
  },
  {
    "id": "p0000012-0000-0000-0000-000000000001",
    "sku": "CEN-PHOTON-SMART",
    "name": "Photon Smart",
    "category": "Remotes & Beams",
    "description": "Centurion Photon Smart wireless infrared safety beams with 30-meter detection range and audible alignment buzzer.",
    "unit_of_measure": "pair",
    "cost_price": 666,
    "unit_price": 900,
    "low_stock_threshold": 8,
    "is_active": true
  },
  {
    "id": "p0000013-0000-0000-0000-000000000001",
    "sku": "CEN-D5-SMART-CHARGER",
    "name": "D5 Smart Charger",
    "category": "Chargers & Power",
    "description": "Compact 1.8A plug-in charger power unit for Centurion D5 Smart gate motor controller systems.",
    "unit_of_measure": "pcs",
    "cost_price": 481,
    "unit_price": 650,
    "low_stock_threshold": 6,
    "is_active": true
  },
  {
    "id": "p0000014-0000-0000-0000-000000000001",
    "sku": "CEN-STEEL-RACK",
    "name": "Steel Rack",
    "category": "Hardware & Racks",
    "description": "Heavy-duty galvanized steel toothed gear rack (1 metre piece with mounting spacers & hardware).",
    "unit_of_measure": "pcs",
    "cost_price": 333,
    "unit_price": 450,
    "low_stock_threshold": 20,
    "is_active": true
  },
  {
    "id": "p0000015-0000-0000-0000-000000000001",
    "sku": "CEN-ONE-BUTTON-REMOT",
    "name": "One Button Remote",
    "category": "Remotes & Beams",
    "description": "Centurion Nova 1-button secure code-hopping 433MHz remote transmitter for gate access.",
    "unit_of_measure": "pcs",
    "cost_price": 185,
    "unit_price": 250,
    "low_stock_threshold": 25,
    "is_active": true
  },
  {
    "id": "p0000016-0000-0000-0000-000000000001",
    "sku": "CEN-TWO-BUTTON-REMOT",
    "name": "Two Button Remote",
    "category": "Remotes & Beams",
    "description": "Centurion Nova 2-button secure code-hopping 433MHz remote transmitter with silicone push buttons.",
    "unit_of_measure": "pcs",
    "cost_price": 222,
    "unit_price": 300,
    "low_stock_threshold": 25,
    "is_active": true
  },
  {
    "id": "p0000017-0000-0000-0000-000000000001",
    "sku": "CEN-FOUR-BUTTON-REMO",
    "name": "Four Button Remote",
    "category": "Remotes & Beams",
    "description": "Centurion Nova 4-button multi-channel code-hopping transmitter for gates, garage doors, and alarms.",
    "unit_of_measure": "pcs",
    "cost_price": 259,
    "unit_price": 350,
    "low_stock_threshold": 30,
    "is_active": true
  },
  {
    "id": "p0000018-0000-0000-0000-000000000001",
    "sku": "CEN-G-SPEAK-ULTRA",
    "name": "G Speak Ultra",
    "category": "Control Boards & GSM",
    "description": "4G LTE wireless intercom and access automation module with phone call alerts, missed-call gate trigger, and SMS notifications.",
    "unit_of_measure": "unit",
    "cost_price": 1924,
    "unit_price": 2600,
    "low_stock_threshold": 4,
    "is_active": true
  },
  {
    "id": "p0000019-0000-0000-0000-000000000001",
    "sku": "CEN-SDO5",
    "name": "SDO5",
    "category": "Gate Motors & Kits",
    "description": "Centurion SDO5 smart sectional and tip-up garage door automation operator with battery backup and whisper-quiet belt drive.",
    "unit_of_measure": "kit",
    "cost_price": 2590,
    "unit_price": 3500,
    "low_stock_threshold": 3,
    "is_active": true
  },
  {
    "id": "p0000020-0000-0000-0000-000000000001",
    "sku": "CEN-I5V3",
    "name": "I5V3",
    "category": "Remotes & Beams",
    "description": "Centurion i5 hardwired infrared safety photo-beams (up to 40m range) for anti-crush entrapment protection.",
    "unit_of_measure": "pair",
    "cost_price": 370,
    "unit_price": 500,
    "low_stock_threshold": 8,
    "is_active": true
  },
  {
    "id": "p0000021-0000-0000-0000-000000000001",
    "sku": "CEN-PHOTON",
    "name": "Photon",
    "category": "Remotes & Beams",
    "description": "Centurion Photon wireless infrared gate safety beam kit with battery-powered transmitter for easy installation.",
    "unit_of_measure": "pair",
    "cost_price": 666,
    "unit_price": 900,
    "low_stock_threshold": 8,
    "is_active": true
  },
  {
    "id": "p0000022-0000-0000-0000-000000000001",
    "sku": "CEN-SMART-GUARD-AIR",
    "name": "Smart Guard Air",
    "category": "Remotes & Beams",
    "description": "Wireless weatherproof 1000-user code-hopping digital keypad for keyless gate and door entry.",
    "unit_of_measure": "unit",
    "cost_price": 703,
    "unit_price": 950,
    "low_stock_threshold": 5,
    "is_active": true
  },
  {
    "id": "p0000023-0000-0000-0000-000000000001",
    "sku": "CEN-SMART-GUARD",
    "name": "Smart Guard",
    "category": "Remotes & Beams",
    "description": "Hardwired backlit digital access control keypad with multi-channel relay output for secure pedestrian access.",
    "unit_of_measure": "unit",
    "cost_price": 666,
    "unit_price": 900,
    "low_stock_threshold": 5,
    "is_active": true
  },
  {
    "id": "p0000024-0000-0000-0000-000000000001",
    "sku": "CEN-ONE-CHANNEL-RECE",
    "name": "One Channel Receiver",
    "category": "Control Boards & GSM",
    "description": "Centurion 1-channel 433MHz Nova code-hopping standalone receiver unit for gate/alarm integration.",
    "unit_of_measure": "pcs",
    "cost_price": 333,
    "unit_price": 450,
    "low_stock_threshold": 10,
    "is_active": true
  },
  {
    "id": "p0000025-0000-0000-0000-000000000001",
    "sku": "CEN-D5-EVO-BOARD",
    "name": "D5 Evo Board",
    "category": "Control Boards & GSM",
    "description": "Genuine replacement main controller PCB mother board with LCD display for Centurion D5 Evo sliding motor.",
    "unit_of_measure": "pcs",
    "cost_price": 1258,
    "unit_price": 1700,
    "low_stock_threshold": 5,
    "is_active": true
  },
  {
    "id": "p0000026-0000-0000-0000-000000000001",
    "sku": "CEN-G-SWITCH-ULTRA",
    "name": "G Switch Ultra",
    "category": "Control Boards & GSM",
    "description": "GSM cellular access control and monitoring module for remote gate opening via missed call, mobile app, or SMS.",
    "unit_of_measure": "unit",
    "cost_price": 1702,
    "unit_price": 2300,
    "low_stock_threshold": 4,
    "is_active": true
  },
  {
    "id": "p0000027-0000-0000-0000-000000000001",
    "sku": "CEN-D10-BOARD",
    "name": "D10 Board",
    "category": "Control Boards & GSM",
    "description": "Replacement main control board with multi-function display for Centurion D10 and D10 Turbo commercial motors.",
    "unit_of_measure": "pcs",
    "cost_price": 1332,
    "unit_price": 1800,
    "low_stock_threshold": 4,
    "is_active": true
  },
  {
    "id": "p0000028-0000-0000-0000-000000000001",
    "sku": "CEN-DX-BOARD",
    "name": "DX Board",
    "category": "Control Boards & GSM",
    "description": "Industrial logic controller board for Centurion heavy sliding and swing automation equipment.",
    "unit_of_measure": "pcs",
    "cost_price": 1332,
    "unit_price": 1800,
    "low_stock_threshold": 4,
    "is_active": true
  },
  {
    "id": "p0000029-0000-0000-0000-000000000001",
    "sku": "CEN-D6-SMART-OPERATO",
    "name": "D6 Smart Operator",
    "category": "Motor Operators",
    "description": "Standalone motor gearbox operator unit for Centurion D6 Smart (without full accessory kit).",
    "unit_of_measure": "unit",
    "cost_price": 4699,
    "unit_price": 6350,
    "low_stock_threshold": 3,
    "is_active": true
  },
  {
    "id": "p0000030-0000-0000-0000-000000000001",
    "sku": "CEN-D5-EVO-SMART-OPE",
    "name": "D5 Evo Smart Operator",
    "category": "Motor Operators",
    "description": "Centurion D5 Evo Smart standalone motor operator unit with gearbox, motor, and controller base.",
    "unit_of_measure": "unit",
    "cost_price": 4218,
    "unit_price": 5700,
    "low_stock_threshold": 3,
    "is_active": true
  },
  {
    "id": "p0000031-0000-0000-0000-000000000001",
    "sku": "CEN-D2-FULL-KIT",
    "name": "D2 Full Kit",
    "category": "Gate Motors & Kits",
    "description": "Centurion D2 Turbo compact residential sliding gate motor full kit for domestic gates up to 250kg.",
    "unit_of_measure": "kit",
    "cost_price": 3145,
    "unit_price": 4250,
    "low_stock_threshold": 4,
    "is_active": true
  },
  {
    "id": "p0000032-0000-0000-0000-000000000001",
    "sku": "CEN-D20-SMART-PLUS-O",
    "name": "D20 Smart Plus Operator",
    "category": "Motor Operators",
    "description": "Ultra-heavy-duty industrial standalone operator unit for Centurion D20 Smart gates up to 2000kg.",
    "unit_of_measure": "unit",
    "cost_price": 8399,
    "unit_price": 11350,
    "low_stock_threshold": 2,
    "is_active": true
  },
  {
    "id": "p0000033-0000-0000-0000-000000000001",
    "sku": "CEN-D10-TURBO-SMART-",
    "name": "D10 Turbo Smart Plus Operator",
    "category": "Motor Operators",
    "description": "High-speed commercial standalone motor operator unit for Centurion D10 Turbo Smart series.",
    "unit_of_measure": "unit",
    "cost_price": 7918,
    "unit_price": 10700,
    "low_stock_threshold": 2,
    "is_active": true
  },
  {
    "id": "p0000034-0000-0000-0000-000000000001",
    "sku": "CEN-D20-SMART-PLUS-K",
    "name": "D20 Smart Plus Kit",
    "category": "Gate Motors & Kits",
    "description": "Industrial sliding gate automation complete kit for heavy community and factory gates up to 2 tonnes.",
    "unit_of_measure": "kit",
    "cost_price": 9176,
    "unit_price": 12400,
    "low_stock_threshold": 2,
    "is_active": true
  },
  {
    "id": "p0000035-0000-0000-0000-000000000001",
    "sku": "CEN-D10-SMART-PLUS-O",
    "name": "D10 Smart Plus Operator",
    "category": "Motor Operators",
    "description": "Commercial standalone motor gearbox operator for Centurion D10 Smart sliding gate series.",
    "unit_of_measure": "unit",
    "cost_price": 7970,
    "unit_price": 10770,
    "low_stock_threshold": 2,
    "is_active": true
  },
  {
    "id": "p0000036-0000-0000-0000-000000000001",
    "sku": "CEN-SURGE-PROTECTOR",
    "name": "Surge Protector",
    "category": "Chargers & Power",
    "description": "Lightning and voltage surge protector unit for Centurion gate motor controllers and power mains.",
    "unit_of_measure": "pcs",
    "cost_price": 407,
    "unit_price": 550,
    "low_stock_threshold": 10,
    "is_active": true
  },
  {
    "id": "p0000037-0000-0000-0000-000000000001",
    "sku": "CEN-D6-BASE-PLATE",
    "name": "D6 Base Plate",
    "category": "Hardware & Racks",
    "description": "Foundation steel mounting base plate kit with anchor bolts for Centurion D6 Smart motor.",
    "unit_of_measure": "pcs",
    "cost_price": 222,
    "unit_price": 300,
    "low_stock_threshold": 10,
    "is_active": true
  },
  {
    "id": "p0000038-0000-0000-0000-000000000001",
    "sku": "CEN-D10-BASE-PLATE",
    "name": "D10 Base Plate",
    "category": "Hardware & Racks",
    "description": "Heavy-gauge foundation steel mounting plate with J-bolts for Centurion D10 / D20 series.",
    "unit_of_measure": "pcs",
    "cost_price": 259,
    "unit_price": 350,
    "low_stock_threshold": 8,
    "is_active": true
  },
  {
    "id": "p0000039-0000-0000-0000-000000000001",
    "sku": "CEN-D20-SMART-OPERAT",
    "name": "D20 Smart Operator",
    "category": "Motor Operators",
    "description": "Heavy commercial gate motor operator mechanism for Centurion D20 industrial systems.",
    "unit_of_measure": "unit",
    "cost_price": 6216,
    "unit_price": 8400,
    "low_stock_threshold": 2,
    "is_active": true
  },
  {
    "id": "p0000040-0000-0000-0000-000000000001",
    "sku": "CEN-VANTAGE-ARM",
    "name": "Vantage Arm",
    "category": "Hardware & Racks",
    "description": "Replacement linear actuator swing arm assembly for Centurion Vantage swing gate operator.",
    "unit_of_measure": "pcs",
    "cost_price": 3515,
    "unit_price": 4750,
    "low_stock_threshold": 3,
    "is_active": true
  },
  {
    "id": "p0000041-0000-0000-0000-000000000001",
    "sku": "CEN-VANTAGE-CONTROLL",
    "name": "Vantage Controller",
    "category": "Control Boards & GSM",
    "description": "Complete V-Series electronic controller unit in weatherproof housing for Vantage swing gates.",
    "unit_of_measure": "unit",
    "cost_price": 2035,
    "unit_price": 2750,
    "low_stock_threshold": 3,
    "is_active": true
  },
  {
    "id": "p0000042-0000-0000-0000-000000000001",
    "sku": "CEN-D3-SMART-PLUS",
    "name": "D3 Smart Plus",
    "category": "Gate Motors & Kits",
    "description": "Compact high-speed residential sliding gate motor full kit for domestic gates up to 300kg.",
    "unit_of_measure": "kit",
    "cost_price": 3626,
    "unit_price": 4900,
    "low_stock_threshold": 4,
    "is_active": true
  },
  {
    "id": "p0000043-0000-0000-0000-000000000001",
    "sku": "CEN-D4-SMART-PLUS",
    "name": "D4 Smart Plus",
    "category": "Gate Motors & Kits",
    "description": "Domestic sliding gate motor full kit with intelligent speed profiling for gates up to 400kg.",
    "unit_of_measure": "kit",
    "cost_price": 4181,
    "unit_price": 5650,
    "low_stock_threshold": 4,
    "is_active": true
  },
  {
    "id": "p0000044-0000-0000-0000-000000000001",
    "sku": "CEN-D4-SMART-PLUS-OP",
    "name": "D4 Smart Plus Operator",
    "category": "Motor Operators",
    "description": "Standalone motor gearbox operator unit for Centurion D4 Smart residential sliding series.",
    "unit_of_measure": "unit",
    "cost_price": 3700,
    "unit_price": 5000,
    "low_stock_threshold": 3,
    "is_active": true
  },
  {
    "id": "p0000045-0000-0000-0000-000000000001",
    "sku": "CEN-D3-SMART-PLUS-OP",
    "name": "D3 Smart Plus Operator",
    "category": "Motor Operators",
    "description": "Standalone residential sliding gate motor operator for Centurion D3 Smart series.",
    "unit_of_measure": "unit",
    "cost_price": 3182,
    "unit_price": 4300,
    "low_stock_threshold": 3,
    "is_active": true
  }
];

export const INITIAL_LOCATION_STOCK = [
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000001-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000001-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000001-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000001-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000002-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000002-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000002-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000002-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000003-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000003-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000003-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000003-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000004-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000004-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000004-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000004-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000005-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000005-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000005-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000005-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000006-0000-0000-0000-000000000001",
    "quantity": 120
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000006-0000-0000-0000-000000000001",
    "quantity": 14
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000006-0000-0000-0000-000000000001",
    "quantity": 6
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000006-0000-0000-0000-000000000001",
    "quantity": 12
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000007-0000-0000-0000-000000000001",
    "quantity": 40
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000007-0000-0000-0000-000000000001",
    "quantity": 4
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000007-0000-0000-0000-000000000001",
    "quantity": 6
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000007-0000-0000-0000-000000000001",
    "quantity": 4
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000008-0000-0000-0000-000000000001",
    "quantity": 40
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000008-0000-0000-0000-000000000001",
    "quantity": 4
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000008-0000-0000-0000-000000000001",
    "quantity": 6
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000008-0000-0000-0000-000000000001",
    "quantity": 4
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000009-0000-0000-0000-000000000001",
    "quantity": 40
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000009-0000-0000-0000-000000000001",
    "quantity": 4
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000009-0000-0000-0000-000000000001",
    "quantity": 6
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000009-0000-0000-0000-000000000001",
    "quantity": 4
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000010-0000-0000-0000-000000000001",
    "quantity": 40
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000010-0000-0000-0000-000000000001",
    "quantity": 4
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000010-0000-0000-0000-000000000001",
    "quantity": 6
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000010-0000-0000-0000-000000000001",
    "quantity": 4
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000011-0000-0000-0000-000000000001",
    "quantity": 40
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000011-0000-0000-0000-000000000001",
    "quantity": 4
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000011-0000-0000-0000-000000000001",
    "quantity": 6
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000011-0000-0000-0000-000000000001",
    "quantity": 4
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000012-0000-0000-0000-000000000001",
    "quantity": 150
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000012-0000-0000-0000-000000000001",
    "quantity": 18
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000012-0000-0000-0000-000000000001",
    "quantity": 22
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000012-0000-0000-0000-000000000001",
    "quantity": 15
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000013-0000-0000-0000-000000000001",
    "quantity": 40
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000013-0000-0000-0000-000000000001",
    "quantity": 4
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000013-0000-0000-0000-000000000001",
    "quantity": 6
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000013-0000-0000-0000-000000000001",
    "quantity": 4
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000014-0000-0000-0000-000000000001",
    "quantity": 200
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000014-0000-0000-0000-000000000001",
    "quantity": 12
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000014-0000-0000-0000-000000000001",
    "quantity": 30
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000014-0000-0000-0000-000000000001",
    "quantity": 20
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000015-0000-0000-0000-000000000001",
    "quantity": 150
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000015-0000-0000-0000-000000000001",
    "quantity": 18
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000015-0000-0000-0000-000000000001",
    "quantity": 22
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000015-0000-0000-0000-000000000001",
    "quantity": 15
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000016-0000-0000-0000-000000000001",
    "quantity": 150
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000016-0000-0000-0000-000000000001",
    "quantity": 18
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000016-0000-0000-0000-000000000001",
    "quantity": 22
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000016-0000-0000-0000-000000000001",
    "quantity": 15
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000017-0000-0000-0000-000000000001",
    "quantity": 150
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000017-0000-0000-0000-000000000001",
    "quantity": 8
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000017-0000-0000-0000-000000000001",
    "quantity": 22
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000017-0000-0000-0000-000000000001",
    "quantity": 15
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000018-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000018-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000018-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000018-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000019-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000019-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000019-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000019-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000020-0000-0000-0000-000000000001",
    "quantity": 150
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000020-0000-0000-0000-000000000001",
    "quantity": 18
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000020-0000-0000-0000-000000000001",
    "quantity": 22
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000020-0000-0000-0000-000000000001",
    "quantity": 15
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000021-0000-0000-0000-000000000001",
    "quantity": 150
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000021-0000-0000-0000-000000000001",
    "quantity": 18
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000021-0000-0000-0000-000000000001",
    "quantity": 22
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000021-0000-0000-0000-000000000001",
    "quantity": 15
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000022-0000-0000-0000-000000000001",
    "quantity": 150
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000022-0000-0000-0000-000000000001",
    "quantity": 18
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000022-0000-0000-0000-000000000001",
    "quantity": 22
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000022-0000-0000-0000-000000000001",
    "quantity": 15
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000023-0000-0000-0000-000000000001",
    "quantity": 150
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000023-0000-0000-0000-000000000001",
    "quantity": 18
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000023-0000-0000-0000-000000000001",
    "quantity": 22
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000023-0000-0000-0000-000000000001",
    "quantity": 15
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000024-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000024-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000024-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000024-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000025-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000025-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000025-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000025-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000026-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000026-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000026-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000026-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000027-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000027-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000027-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000027-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000028-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000028-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000028-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000028-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000029-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000029-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000029-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000029-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000030-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000030-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000030-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000030-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000031-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000031-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000031-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000031-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000032-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000032-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000032-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000032-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000033-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000033-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000033-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000033-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000034-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000034-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000034-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000034-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000035-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000035-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000035-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000035-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000036-0000-0000-0000-000000000001",
    "quantity": 40
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000036-0000-0000-0000-000000000001",
    "quantity": 4
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000036-0000-0000-0000-000000000001",
    "quantity": 6
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000036-0000-0000-0000-000000000001",
    "quantity": 4
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000037-0000-0000-0000-000000000001",
    "quantity": 60
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000037-0000-0000-0000-000000000001",
    "quantity": 7
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000037-0000-0000-0000-000000000001",
    "quantity": 9
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000037-0000-0000-0000-000000000001",
    "quantity": 6
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000038-0000-0000-0000-000000000001",
    "quantity": 60
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000038-0000-0000-0000-000000000001",
    "quantity": 7
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000038-0000-0000-0000-000000000001",
    "quantity": 9
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000038-0000-0000-0000-000000000001",
    "quantity": 6
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000039-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000039-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000039-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000039-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000040-0000-0000-0000-000000000001",
    "quantity": 60
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000040-0000-0000-0000-000000000001",
    "quantity": 7
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000040-0000-0000-0000-000000000001",
    "quantity": 9
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000040-0000-0000-0000-000000000001",
    "quantity": 6
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000041-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000041-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000041-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000041-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000042-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000042-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000042-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000042-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000043-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000043-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000043-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000043-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000044-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000044-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000044-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000044-0000-0000-0000-000000000001",
    "quantity": 2
  },
  {
    "location_id": "11111111-1111-1111-1111-111111111111",
    "product_id": "p0000045-0000-0000-0000-000000000001",
    "quantity": 25
  },
  {
    "location_id": "22222222-2222-2222-2222-222222222222",
    "product_id": "p0000045-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "33333333-3333-3333-3333-333333333333",
    "product_id": "p0000045-0000-0000-0000-000000000001",
    "quantity": 3
  },
  {
    "location_id": "44444444-4444-4444-4444-444444444444",
    "product_id": "p0000045-0000-0000-0000-000000000001",
    "quantity": 2
  }
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
    notes: 'Approved commercial gate automation & electrical contractor. Prompt payment history.'
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
    notes: 'Top tier industrial automation contractor for estates & institutional gates in Ashanti Region.'
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    full_name: 'Vida Adobea Boadi',
    phone: '0553445566',
    email: 'vida.adobea@gmail.com',
    company_name: 'Sunlight Volt Energy & Security',
    tin_number: 'C0093847261',
    address: 'Medie Pokuase Interchange Corridor',
    is_active: true,
    notes: 'Regular installer of Centurion D5 Evo and D6 Smart sliding motors at Medie shop.'
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
    notes: 'Approved for Vantage swing gate kits and steel gear racks.'
  }
];

export const INITIAL_CREDIT_LEDGER = [
  // Alhaji Haruna: Purchases 27,600 - Paid 8,500 = Owes 19,100
  {
    id: 'l1111111-1111-1111-1111-111111111111',
    customer_id: 'c1111111-1111-1111-1111-111111111111',
    sale_id: 's2222222-2222-2222-2222-222222222221',
    entry_type: 'debit',
    amount: 27600.00,
    payment_method: 'Invoice',
    reference_number: 'INV-LPZ-2026-201',
    notes: 'Supply of 2x D10 Smart Plus + 1x G Speak Ultra + 4x Four Button Remote on 30-day terms',
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

  // Ing. Samuel K. Osei: Purchases 41,500 - Paid 15,000 = Owes 26,500
  {
    id: 'l2222222-2222-2222-2222-222222222221',
    customer_id: 'c2222222-2222-2222-2222-222222222222',
    sale_id: null,
    entry_type: 'debit',
    amount: 41500.00,
    payment_method: 'Invoice',
    reference_number: 'INV-KMS-2026-0840',
    notes: 'Kumasi Gated Community project: 3x D10 Turbo Smart Plus + 20m Steel Rack + 10x Remotes',
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

  // Vida Adobea: Owes 7,550
  {
    id: 'l3333333-3333-3333-3333-333333333331',
    customer_id: 'c3333333-3333-3333-3333-333333333333',
    sale_id: 's1111111-1111-1111-1111-111111111111',
    entry_type: 'debit',
    amount: 7550.00,
    payment_method: 'Invoice',
    reference_number: 'INV-MED-2026-101',
    notes: '1x D5 Evo Smart Plus kit + 2x Four Button Remote + 1x Battery on credit terms',
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
    subtotal: 7550.00,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 7550.00,
    amount_paid: 0.00,
    change_due: 0.00,
    notes: 'Pokuase Residential Estate installation - 30 days settlement agreement',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000001-0000-0000-0000-000000000001',
        product_name: 'D5 Evo Smart Plus',
        sku: 'CEN-D5-EVO-SMART-PLU',
        quantity: 1,
        unit_price: 6450.00,
        subtotal: 6450.00
      },
      {
        product_id: 'p0000017-0000-0000-0000-000000000001',
        product_name: 'Four Button Remote',
        sku: 'CEN-FOUR-BUTTON-REMO',
        quantity: 2,
        unit_price: 350.00,
        subtotal: 700.00
      },
      {
        product_id: 'p0000006-0000-0000-0000-000000000001',
        product_name: 'Battery',
        sku: 'CEN-BATTERY',
        quantity: 1,
        unit_price: 400.00,
        subtotal: 400.00
      }
    ]
  },
  {
    id: 's1111111-1111-1111-1111-111111111112',
    invoice_number: 'INV-MED-2026-102',
    location_id: '22222222-2222-2222-2222-222222222222',
    location_name: 'Centric - Medie',
    customer_id: null,
    customer_name: 'Kojo Appiah (Gate Installer Walk-in)',
    customer_phone: '0244712399',
    cashier_name: 'Ama Boateng',
    status: 'completed',
    payment_mode: 'cash',
    subtotal: 7300.00,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 7300.00,
    amount_paid: 7300.00,
    change_due: 0.00,
    notes: 'Cash sale D6 Smart Plus full kit for residential sliding gate in Amasaman',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000002-0000-0000-0000-000000000001',
        product_name: 'D6 Smart Plus',
        sku: 'CEN-D6-SMART-PLUS',
        quantity: 1,
        unit_price: 7300.00,
        subtotal: 7300.00
      }
    ]
  },
  {
    id: 's1111111-1111-1111-1111-111111111113',
    invoice_number: 'INV-MED-2026-103',
    location_id: '22222222-2222-2222-2222-222222222222',
    location_name: 'Centric - Medie',
    customer_id: null,
    customer_name: 'Dr. Evans Mensah (Homeowner)',
    customer_phone: '0205882211',
    cashier_name: 'Ama Boateng',
    status: 'completed',
    payment_mode: 'momo',
    subtotal: 9100.00,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 9100.00,
    amount_paid: 9100.00,
    change_due: 0.00,
    notes: 'D6 Smart Plus kit + 4x Steel Rack paid via MTN Mobile Money',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000002-0000-0000-0000-000000000001',
        product_name: 'D6 Smart Plus',
        sku: 'CEN-D6-SMART-PLUS',
        quantity: 1,
        unit_price: 7300.00,
        subtotal: 7300.00
      },
      {
        product_id: 'p0000014-0000-0000-0000-000000000001',
        product_name: 'Steel Rack',
        sku: 'CEN-STEEL-RACK',
        quantity: 4,
        unit_price: 450.00,
        subtotal: 1800.00
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
    subtotal: 27600.00,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 27600.00,
    amount_paid: 0.00,
    change_due: 0.00,
    notes: 'Warehouse complex automation project on credit account',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000003-0000-0000-0000-000000000001',
        product_name: 'D10 Smart Plus',
        sku: 'CEN-D10-SMART-PLUS',
        quantity: 2,
        unit_price: 11800.00,
        subtotal: 23600.00
      },
      {
        product_id: 'p0000018-0000-0000-0000-000000000001',
        product_name: 'G Speak Ultra',
        sku: 'CEN-G-SPEAK-ULTRA',
        quantity: 1,
        unit_price: 2600.00,
        subtotal: 2600.00
      },
      {
        product_id: 'p0000017-0000-0000-0000-000000000001',
        product_name: 'Four Button Remote',
        sku: 'CEN-FOUR-BUTTON-REMO',
        quantity: 4,
        unit_price: 350.00,
        subtotal: 1400.00
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
    subtotal: 4100.00,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 4100.00,
    amount_paid: 4100.00,
    change_due: 0.00,
    notes: 'Clinic ambulance garage automation motor + remotes paid in cash',
    created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000019-0000-0000-0000-000000000001',
        product_name: 'SDO5',
        sku: 'CEN-SDO5',
        quantity: 1,
        unit_price: 3500.00,
        subtotal: 3500.00
      },
      {
        product_id: 'p0000016-0000-0000-0000-000000000001',
        product_name: 'Two Button Remote',
        sku: 'CEN-TWO-BUTTON-REMOT',
        quantity: 2,
        unit_price: 300.00,
        subtotal: 600.00
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
    subtotal: 7350.00,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 7350.00,
    amount_paid: 7350.00,
    change_due: 0.00,
    notes: 'D5 Evo Smart Plus + Photon safety beams paid via Telecel Cash',
    created_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000001-0000-0000-0000-000000000001',
        product_name: 'D5 Evo Smart Plus',
        sku: 'CEN-D5-EVO-SMART-PLU',
        quantity: 1,
        unit_price: 6450.00,
        subtotal: 6450.00
      },
      {
        product_id: 'p0000012-0000-0000-0000-000000000001',
        product_name: 'Photon Smart',
        sku: 'CEN-PHOTON-SMART',
        quantity: 1,
        unit_price: 900.00,
        subtotal: 900.00
      }
    ]
  }
];

export const INITIAL_STOCK_TRANSFERS = [
  // 1. Pending Approval by Kwame Yeboah (Requested by Medie)
  {
    id: 't1111111-1111-1111-1111-111111111111',
    transfer_number: 'TRF-MED-2026-0041',
    from_location_id: '11111111-1111-1111-1111-111111111111',
    to_location_id: '22222222-2222-2222-2222-222222222222',
    from_name: 'Central Warehouse',
    to_name: 'Centric - Medie',
    status: 'pending_approval',
    requested_by_name: 'Ama Boateng (Medie Clerk)',
    notes: 'Urgent restock requested: Current shelf count is only 2 D5 Evo Smart Plus motors and 8 remotes. Installer demand is high around Pokuase/Amasaman.',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000001-0000-0000-0000-000000000001',
        product_name: 'D5 Evo Smart Plus',
        sku: 'CEN-D5-EVO-SMART-PLU',
        quantity_requested: 5,
        quantity_approved: 0,
        quantity_dispatched: 0,
        quantity_received: 0
      },
      {
        product_id: 'p0000017-0000-0000-0000-000000000001',
        product_name: 'Four Button Remote',
        sku: 'CEN-FOUR-BUTTON-REMO',
        quantity_requested: 20,
        quantity_approved: 0,
        quantity_dispatched: 0,
        quantity_received: 0
      },
      {
        product_id: 'p0000006-0000-0000-0000-000000000001',
        product_name: 'Battery',
        sku: 'CEN-BATTERY',
        quantity_requested: 15,
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
    owner_review_notes: 'Approved 30 steel racks and 10 D5 replacement boards after verifying fast turnover at Lapaz counter.',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    approved_at: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: 'p0000014-0000-0000-0000-000000000001',
        product_name: 'Steel Rack',
        sku: 'CEN-STEEL-RACK',
        quantity_requested: 30,
        quantity_approved: 30,
        quantity_dispatched: 0,
        quantity_received: 0
      },
      {
        product_id: 'p0000025-0000-0000-0000-000000000001',
        product_name: 'D5 Evo Board',
        sku: 'CEN-D5-EVO-BOARD',
        quantity_requested: 10,
        quantity_approved: 10,
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
        product_id: 'p0000005-0000-0000-0000-000000000001',
        product_name: 'Vantage',
        sku: 'CEN-VANTAGE',
        quantity_requested: 3,
        quantity_approved: 3,
        quantity_dispatched: 3,
        quantity_received: 0
      },
      {
        product_id: 'p0000003-0000-0000-0000-000000000001',
        product_name: 'D10 Smart Plus',
        sku: 'CEN-D10-SMART-PLUS',
        quantity_requested: 4,
        quantity_approved: 4,
        quantity_dispatched: 4,
        quantity_received: 0
      },
      {
        product_id: 'p0000012-0000-0000-0000-000000000001',
        product_name: 'Photon Smart',
        sku: 'CEN-PHOTON-SMART',
        quantity_requested: 12,
        quantity_approved: 12,
        quantity_dispatched: 12,
        quantity_received: 0
      }
    ]
  }
];

export const SUPPLIER_INTAKES = [
  {
    id: 'intake-001',
    receipt_number: 'REC-SUP-2026-018',
    supplier_name: 'Centurion Systems Africa (Pty) Ltd',
    supplier_invoice_ref: 'CEN-EXP-77218',
    received_by_name: 'Kofi Mensah',
    warehouse_name: 'Central Warehouse (Spintex)',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    total_cost: 97000.00,
    items: [
      {
        product_name: 'D5 Evo Smart Plus',
        sku: 'CEN-D5-EVO-SMART-PLU',
        quantity: 20,
        unit_cost: 4850.00,
        subtotal: 97000.00
      }
    ]
  },
  {
    id: 'intake-002',
    receipt_number: 'REC-SUP-2026-019',
    supplier_name: 'Centurion Systems Africa (Pty) Ltd',
    supplier_invoice_ref: 'CEN-EXP-77219',
    received_by_name: 'Kofi Mensah',
    warehouse_name: 'Central Warehouse (Spintex)',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    total_cost: 81750.00,
    items: [
      {
        product_name: 'D6 Smart Plus',
        sku: 'CEN-D6-SMART-PLUS',
        quantity: 15,
        unit_cost: 5450.00,
        subtotal: 81750.00
      }
    ]
  }
];
