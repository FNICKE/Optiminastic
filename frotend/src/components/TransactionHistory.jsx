// src/components/TransactionHistory.jsx
import { useState, useEffect } from 'react';
import { getTransactionHistory } from '../api/api';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getTransactionHistory();
        setTransactions(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <p className="text-gray-500">Loading transaction history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center text-gray-500">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">
          Transaction History
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount (₹)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {tx.created_at}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tx.type === 'credit' ? 'bg-green-100 text-green-800' :
                    tx.type === 'debit' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                    {tx.type === 'credit' ? '+' : '-'} {tx.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.reference_id || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 text-center text-sm text-gray-500 border-t">
        Showing last {transactions.length} transactions
      </div>
    </div>
  );
}