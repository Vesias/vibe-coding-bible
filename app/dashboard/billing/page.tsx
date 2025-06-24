import { Metadata } from 'next'
import { BillingDashboard } from '@/components/billing/BillingDashboard'

export const metadata: Metadata = {
  title: 'Billing & Rechnungen - Vibe Coding Bible',
  description: 'Verwalten Sie Ihr Abonnement, Zahlungsmethoden und Rechnungen.',
}

export default function BillingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing & Rechnungen</h1>
        <p className="text-gray-600">
          Verwalten Sie Ihr Abonnement, Zahlungsmethoden und laden Sie Ihre Rechnungen herunter.
        </p>
      </div>
      
      <BillingDashboard />
    </div>
  )
}