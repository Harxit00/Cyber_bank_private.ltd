import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { CreditCard } from 'lucide-react';

export default function Accounts() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get('/accounts');
        setAccounts(response.data.accounts || []);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to load accounts');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAccounts();
  }, [token]);

  if (loading) return <div className="p-8">Loading accounts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Your Accounts</h1>
      </div>

      {accounts.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-center text-gray-500">
          No accounts found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <div key={account._id} className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{account.type}</h3>
                  <p className="text-sm text-gray-600">Account: {account.number}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  account.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {account.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance:</span>
                  <span className="font-semibold">₹{account.balance?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-mono text-xs">{account._id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
