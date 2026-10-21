
import { useEffect, useState } from 'react';
import api from './services/api';

function App() {
  const [apiStatus, setApiStatus] = useState('Checking backend connection...');

  useEffect(() => {
    api.get('/health')
      .then((response) => {
        setApiStatus(response.data.message);
      })
      .catch((error) => {
        console.error('API connection failed:', error);
        setApiStatus('Could not connect to the backend.');
      });
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <section className="w-full max-w-xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Hospital Management System
        </h1>

        <p className="mb-2 text-gray-600">Backend connection status:</p>

        <p className="font-semibold text-green-700" role="status">
          {apiStatus}
        </p>
      </section>
    </main>
  );
}

export default App;
