import { useState, useEffect } from 'react';
import { getBalance } from '../api/api';

export default function WalletBalance() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await getBalance();
        setBalance(res.data.balance);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load balance');
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  if (loading) return <div className="text-center py-8">Loading balance...</div>;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Your Wallet</h2>
      <div className="text-5xl font-extrabold">
        ₹{balance?.toFixed(2) || '0.00'}
      </div>
      <p className="mt-2 opacity-90">Available Balance</p>
    </div>
  );
}