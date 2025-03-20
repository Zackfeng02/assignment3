import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import VitalProvider from './components/VitalProvider'; // Remove curly braces

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VitalProvider>
      <App />
    </VitalProvider>
  </React.StrictMode>
);