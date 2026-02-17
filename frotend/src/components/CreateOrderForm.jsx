import { useState } from 'react';
import { createOrder } from '../api/api';

export default function CreateOrderForm({ onOrderCreated }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await createOrder(Number(amount));
      setMessage(`Order created! ID: ${res.data.orderId} • Status: ${res.data.status}`);
      if (onOrderCreated) onOrderCreated();
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-4">Create New Order</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            step="0.01"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter amount"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !amount}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? 'Processing...' : 'Pay & Create Order'}
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}