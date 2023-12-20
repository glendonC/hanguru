import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const messageHandler = (event) => {
      if (event.data.type === 'NAVIGATE') {
        navigate(event.data.path);
      }
    };

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [navigate]);

  return (
    <iframe 
      src="/dashboard/dashboard.html"
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Dashboard Page"
    ></iframe>
  );
}

export default Dashboard;
