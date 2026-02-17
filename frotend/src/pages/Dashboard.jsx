// src/pages/Dashboard.jsx
import { useAppContext } from '../App';
import WalletBalance from '../components/WalletBalance';
import CreateOrderForm from '../components/CreateOrderForm';
import OrderDetails from '../components/OrderDetails';
import AdminControls from '../components/AdminControls';
import TransactionHistory from '../components/TransactionHistory';   // ← NEW

export default function Dashboard() {
  const { isAdmin, clientId } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
          Wallet Dashboard
        </h1>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left column - Balance & Actions */}
          <div className="space-y-10">
            {/* Wallet Balance - always visible */}
            <WalletBalance />

            {/* Role-specific content */}
            {isAdmin ? (
              <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Admin Wallet Controls
                </h2>
                <AdminControls clientId={clientId} />
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Create New Order
                </h2>
                <CreateOrderForm />
              </div>
            )}

            {/* Transaction History - visible to everyone */}
            <TransactionHistory />
          </div>

          {/* Right column - Order Details */}
          <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Order Details
            </h2>
            <OrderDetails />
          </div>
        </div>

        {/* Info footer */}
        <div className="mt-16 text-center text-gray-600">
          <p className="text-sm">
            {isAdmin
              ? 'You are in Admin mode – manage any client’s wallet balance'
              : 'You are in Client mode – create and track your orders'}
          </p>
          <p className="mt-2 text-sm">
            Client ID: <span className="font-mono">{clientId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}