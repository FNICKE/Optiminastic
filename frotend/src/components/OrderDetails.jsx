import { useState } from 'react';
import { getOrder } from '../api/api';

export default function OrderDetails() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await getOrder(orderId);
      setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-4">Check Order Status</h3>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID (UUID)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleFetch}
          disabled={loading || !orderId}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch'}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {order && (
        <div className="mt-4 border-t pt-4">
          <p><strong>Amount:</strong> ₹{order.amount}</p>
          <p><strong>Status:</strong> 
            <span className={`ml-2 font-medium ${
              order.status === 'fulfilled' ? 'text-green-600' :
              order.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {order.status.toUpperCase()}
            </span>
          </p>
          {order.fulfillment_id && (
            <p><strong>Fulfillment ID:</strong> {order.fulfillment_id}</p>
          )}
          <p><strong>Created:</strong> {new Date(order.created_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}