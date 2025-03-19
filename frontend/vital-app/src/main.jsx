import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { VitalProvider } from './components/VitalProvider';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <VitalProvider>
        <App />
      </VitalProvider>
    </BrowserRouter>
  </React.StrictMode>
); 