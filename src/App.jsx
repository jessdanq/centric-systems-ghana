import React, { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { OwnerDashboard } from './components/OwnerDashboard'
import { BranchDashboard } from './components/BranchDashboard'
import { WarehouseDashboard } from './components/WarehouseDashboard'
import { CustomerPortal } from './components/CustomerPortal'
import { RestockReviewModal } from './components/RestockReviewModal'
import { DocumentPrintModal } from './components/DocumentPrintModal'
import { NewCustomerModal } from './components/NewCustomerModal'
import { PaymentRecordModal } from './components/PaymentRecordModal'
import { SupplierIntakeModal } from './components/SupplierIntakeModal'
import { RequestRestockModal } from './components/RequestRestockModal'
import { SchemaModal } from './components/SchemaModal'
import { DEMO_USERS } from './data/initialData'
import { store } from './services/store'

export default function App() {
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0]) // Kwame Yeboah (Owner)
  const [, setVersion] = useState(0) // triggers re-render on store notification

  // Modals state
  const [selectedTransferForReview, setSelectedTransferForReview] = useState(null)
  const [documentPrintData, setDocumentPrintData] = useState(null)
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false)
  const [selectedCustomerForPayment, setSelectedCustomerForPayment] = useState(null)
  const [isSupplierIntakeOpen, setIsSupplierIntakeOpen] = useState(false)
  const [isRequestRestockOpen, setIsRequestRestockOpen] = useState(false)
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false)

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setVersion((v) => v + 1)
    })
    return unsubscribe
  }, [])

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to the default Ghanaian sample data?')) {
      store.resetToDefault()
      alert('All sample data has been reset to defaults.')
    }
  }

  // Get active location for branch staff
  const activeBranchLocation =
    store.locations.find((l) => l.id === currentUser.assigned_location_id) ||
    store.locations.find((l) => l.type === 'branch')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation & Role Switcher */}
      <div className="no-print print:hidden">
        <Navbar
          currentUser={currentUser}
          onSwitchUser={setCurrentUser}
          onResetData={handleResetData}
          onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 no-print print:hidden">
        {currentUser.role === 'owner' && (
          <OwnerDashboard
            onOpenRestockReview={(transfer) => setSelectedTransferForReview(transfer)}
            onOpenNewCustomer={() => setIsNewCustomerOpen(true)}
            onOpenPaymentRecord={(customer) => setSelectedCustomerForPayment(customer)}
            onOpenDocumentPrint={(doc) => setDocumentPrintData(doc)}
          />
        )}

        {currentUser.role === 'branch_staff' && (
          <BranchDashboard
            currentUser={currentUser}
            onOpenDocumentPrint={(doc) => setDocumentPrintData(doc)}
            onOpenRequestRestock={() => setIsRequestRestockOpen(true)}
          />
        )}

        {currentUser.role === 'warehouse_manager' && (
          <WarehouseDashboard
            currentUser={currentUser}
            onOpenSupplierIntake={() => setIsSupplierIntakeOpen(true)}
          />
        )}

        {currentUser.role === 'customer' && (
          <CustomerPortal
            currentUser={currentUser}
            onOpenDocumentPrint={(doc) => setDocumentPrintData(doc)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} Centric Systems Ghana Limited. All rights reserved.</p>
          <p className="font-medium text-slate-600">
            Spintex Central Warehouse • Medie Branch • Lapaz Branch • Kumasi Branch
          </p>
        </div>
      </footer>

      {/* Modals */}
      <RestockReviewModal
        isOpen={Boolean(selectedTransferForReview)}
        onClose={() => setSelectedTransferForReview(null)}
        transfer={selectedTransferForReview}
      />

      <DocumentPrintModal
        isOpen={Boolean(documentPrintData)}
        onClose={() => setDocumentPrintData(null)}
        documentData={documentPrintData}
      />

      <NewCustomerModal
        isOpen={isNewCustomerOpen}
        onClose={() => setIsNewCustomerOpen(false)}
      />

      <PaymentRecordModal
        isOpen={Boolean(selectedCustomerForPayment)}
        onClose={() => setSelectedCustomerForPayment(null)}
        customer={selectedCustomerForPayment}
      />

      <SupplierIntakeModal
        isOpen={isSupplierIntakeOpen}
        onClose={() => setIsSupplierIntakeOpen(false)}
      />

      <RequestRestockModal
        isOpen={isRequestRestockOpen}
        onClose={() => setIsRequestRestockOpen(false)}
        currentLocation={activeBranchLocation}
      />

      <SchemaModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />
    </div>
  )
}
