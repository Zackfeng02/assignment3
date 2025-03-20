import React, { createContext, useState } from 'react';

// Create context
export const VitalContext = createContext();

// Default export for the provider
export default function VitalProvider({ children }) {
  const [vitals, setVitals] = useState([]);

  return (
    <VitalContext.Provider value={{ vitals, setVitals }}>
      {children}
    </VitalContext.Provider>
  );
}