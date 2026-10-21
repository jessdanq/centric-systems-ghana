# Centric Systems Ghana Limited
### Multi-Branch Stock Management, Sales Verification & Credit ERP

Custom enterprise web application engineered for **Kwame Yeboah**, Managing Director of **Centric Systems Ghana Limited**.

Designed for deployment on **Cloudflare Pages** (Frontend / Edge) with **Supabase (PostgreSQL with Row Level Security)** and offline-ready local state synchronization.

---

## 1. Enterprise Hierarchy & Stock Distribution Architecture

```
Centric Systems Ghana Limited (Umbrella Entity)
 ├── Central Warehouse (Spintex Industrial Area, Accra)
 │    └── Exclusively receives overseas & local supplier shipments
 ├── Branch 1: Centric - Medie (Nsawam Road)
 ├── Branch 2: Centric - Lapaz (George Walker Bush Highway)
 └── Branch 3: Centric - Kumasi (Suame Magazine Commercial Strip)
```

### Core Business Rules Implemented
1. **Supplier Intake Exclusivity:** Suppliers deliver goods **exclusively to the Central Warehouse**. Retail branches (Medie, Lapaz, Kumasi) cannot receive stock directly from external vendors.
2. **Restock Audit Requirement:** Before the Owner (**Kwame Yeboah**) approves any restock dispatch from Central Warehouse, the system automatically presents the item's **previous 30 days of sales records at that specific requesting branch**, cross-referenced with customer names, quantities, and dates.
3. **Atomic Stock Receipt:** When a branch confirms physical arrival of a dispatched transfer, the system atomically decrements Central Warehouse stock and increments the local retail branch inventory.
4. **Double-Entry Customer Credit Ceiling:** Registered commercial accounts have credit limits. Every credit sale automatically generates a `debit` entry in the credit ledger, blocking transactions if `balance + order > credit_limit`. Cash or MoMo debt repayments generate `credit` entries, restoring available credit.

---

## 2. User Roles & Permission Matrix (RBAC)

| Role | Persona | Permissions & Scope |
|---|---|---|
| **Owner** | **Kwame Yeboah** | Unrestricted read/write across all branches and warehouse. Executive analytics, 30-day branch sales verification & restock approvals, customer credit limit provisioning, consolidated financial audit logs. |
| **Warehouse Manager** | **Kofi Mensah** | Central Warehouse hub only. Inbound supplier deliveries intake, dispatch queue management (assigning haulage driver & waybill numbers), global inventory monitoring. |
| **Branch Staff** | **Ama Boateng** (Medie)<br>**Yaw Ofori** (Lapaz)<br>**Akosua Darko** (Kumasi) | Restricted strictly to their assigned branch. Point of Sale (POS) terminal, local shelf stock tracking, restock requisitions, and confirming receipt of incoming shipments. |
| **Customer** | **Alhaji Haruna Issah**<br>**Ing. Samuel K. Osei** | Dedicated Customer Portal stripped of internal POS navigation. View current debt balance, remaining credit, double-entry statement, and download historical invoices. |

---

## 3. Quick Start & Local Preview

### Double-Click Instant Offline Preview
Double-click `open-app.bat` in this folder. It opens the self-contained production application directly in your default web browser without needing any server setup.

### Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) in your browser.

### Production Build
```bash
npm run build
```
Generates static assets in `./dist` ready for Cloudflare Pages.

---

## 4. Supabase Setup & Database Migration

To connect to your live Supabase cloud database:

1. Open your [Supabase Dashboard](https://supabase.com).
2. Create a new project (e.g. `centric-systems-ghana`).
3. Navigate to **SQL Editor** -> **New Query**.
4. Copy the entire contents of [`supabase_schema.sql`](./supabase_schema.sql) and click **Run**.
   * This creates all tables (`locations`, `profiles`, `products`, `location_stock`, `customers`, `sales`, `sale_items`, `credit_ledger`, `stock_transfers`, `supplier_receipts`).
   * Sets up Row Level Security (RLS) policies.
   * Creates the `customer_balances` view and atomic stored procedures.
   * Seeds realistic initial Ghanaian data for Medie, Lapaz, Kumasi, and Central Warehouse.
5. In your project, copy `.env.example` to `.env` and fill in:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

---

## 5. Deploying to Cloudflare Pages

### Option A: Via GitHub Integration (Recommended)
1. Push this repository to GitHub.
2. In Cloudflare Dashboard, go to **Workers & Pages** -> **Create Application** -> **Pages** -> **Connect to Git**.
3. Select your repository.
4. Set Build Settings:
   * **Framework Preset:** Vite
   * **Build Command:** `npm run build`
   * **Build Output Directory:** `dist`
5. Under **Environment Variables**, add:
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
6. Click **Save and Deploy**.

### Option B: Direct Wrangler Upload
```bash
npx wrangler pages deploy dist --project-name centric-systems-ghana
```

---

## 6. Official Printable Documents (A4 Print / PDF)

The built-in document engine produces pixel-perfect A4 documents with:
* Centric Systems Ghana Limited header & GRA TIN (`C0049281726`)
* Spintex HQ and regional branch addresses
* Toggle between **Tax Invoice**, **Payment Receipt**, and **Proforma Quotation**
* Official verification seal and Managing Director signatory line
* Formatted in Ghana Cedis (`GHS ₵`)

---

## 7. Tech Stack
* **Frontend:** React 19, Tailwind CSS v4, Lucide React Icons
* **Build System:** Vite 6 with `vite-plugin-singlefile`
* **Backend & DB:** Supabase (PostgreSQL 15+ with Row Level Security)
* **Hosting:** Cloudflare Pages (Edge network)
