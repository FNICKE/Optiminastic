// src/pages/OrderPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../api/api';

export default function OrderPage() {
  const { id } = useParams(); // gets :id from URL /order/:id
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrder(id);
        setOrder(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-lg mb-6">{error}</p>
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Not Found</h1>
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="text-xl font-mono">{order.id}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-3xl font-bold text-indigo-700">₹{order.amount}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
                order.status === 'fulfilled'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'failed'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {order.status.toUpperCase()}
            </span>
          </div>

          {order.fulfillment_id && (
            <div>
              <p className="text-sm text-gray-500">Fulfillment ID</p>
              <p className="font-medium">{order.fulfillment_id}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p>{new Date(order.created_at).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}