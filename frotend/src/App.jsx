// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import Dashboard from './pages/Dashboard';
import OrderPage from './pages/OrderPage';
import NotFound from './pages/NotFound';
import { setClientId, getClientId } from './api/api';

// Context for sharing role & clientId
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

function App() {
  const [clientId, setClientIdState] = useState(getClientId() || '');
  const [isAdmin, setIsAdmin] = useState(false);

  // Sync clientId with localStorage & api interceptor
  useEffect(() => {
    if (clientId && clientId.length === 36) {
      setClientId(clientId);
    }
  }, [clientId]);

  const handleClientIdChange = (e) => {
    const newId = e.target.value.trim();
    setClientIdState(newId);
    if (newId.length === 36) {
      setClientId(newId);
    }
  };

  return (
    <AppContext.Provider value={{ isAdmin, setIsAdmin, clientId }}>
      <Router>
        {/* Header */}
        <header className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold">Wallet Dashboard</h1>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Role Toggle */}
              <div className="flex items-center bg-white/20 rounded-full px-1 py-1">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  !isAdmin ? 'bg-white text-indigo-900' : 'text-white'
                }`}>
                  Client
                </span>
                <label className="mx-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={() => setIsAdmin(!isAdmin)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 relative">
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      isAdmin ? 'translate-x-6' : ''
                    }`}></div>
                  </div>
                </label>
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  isAdmin ? 'bg-white text-indigo-900' : 'text-white'
                }`}>
                  Admin
                </span>
              </div>

              {/* Client ID input */}
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-90">Client ID:</span>
                <input
                  type="text"
                  value={clientId}
                  onChange={handleClientIdChange}
                  placeholder="Enter UUID..."
                  className="px-3 py-1.5 bg-white/20 border border-white/30 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-white/50"
                  maxLength={36}
                />
              </div>
            </div>
          </div>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                clientId.length === 36 ? (
                  <Dashboard />
                ) : (
                  <div className="min-h-[70vh] flex items-center justify-center p-6">
                    <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-lg">
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Welcome to Wallet Dashboard
                      </h2>
                      <p className="text-gray-600 mb-6 text-lg">
                        Please enter a valid Client ID (36-character UUID) in the header to begin.
                      </p>
                      <p className="text-sm text-gray-500">
                        Example: <code className="bg-gray-100 px-2 py-1 rounded">550e8400-e29b-41d4-a716-446655440000</code>
                      </p>
                    </div>
                  </div>
                )
              }
            />
            <Route path="/order/:id" element={<OrderPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </AppContext.Provider>
  );
}

export default App;