// src/components/AdminControls.jsx
import { useState } from 'react';
import { adminCredit, adminDebit } from '../api/api';

export default function AdminControls({ clientId: defaultClientId }) {
  const [targetClientId, setTargetClientId] = useState(defaultClientId || '');
  const [amount, setAmount] = useState('');
  const [actionType, setActionType] = useState('credit');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!targetClientId || targetClientId.length !== 36) {
      setError('Valid 36-character Client ID required');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Enter a positive amount');
      return;
    }

    setLoading(true);

    try {
      const fn = actionType === 'credit' ? adminCredit : adminDebit;
      await fn(targetClientId, Number(amount));
      setMessage(
        `Successfully ${actionType === 'credit' ? 'credited' : 'debited'} ₹${amount}`
      );
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Client ID
        </label>
        <input
          type="text"
          value={targetClientId}
          onChange={(e) => setTargetClientId(e.target.value.trim())}
          placeholder="550e8400-e29b-41d4-a716-446655440000"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount (₹)
        </label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 250.50"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setActionType('credit')}
          className={`py-3 px-6 rounded-lg font-medium transition ${
            actionType === 'credit'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Credit
        </button>
        <button
          type="button"
          onClick={() => setActionType('debit')}
          className={`py-3 px-6 rounded-lg font-medium transition ${
            actionType === 'debit'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Debit
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60 transition shadow-md"
      >
        {loading ? 'Processing...' : `Confirm ${actionType === 'credit' ? 'Credit' : 'Debit'}`}
      </button>

      {message && <p className="text-green-700 font-medium bg-green-50 p-3 rounded-lg">{message}</p>}
      {error && <p className="text-red-700 font-medium bg-red-50 p-3 rounded-lg">{error}</p>}
    </form>
  );
}