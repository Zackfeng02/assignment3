import React from "react";
import { Routes, Route } from 'react-router-dom';
import VitalList from './components/VitalList';
import VitalForm from './components/VitalForm';
import { Alert } from 'react-bootstrap';

export default function App() {
  return (
    <div className="vital-app">
      <Routes>
        <Route path="/vitals" element={
          <>
            <VitalList />
            <VitalForm />
          </>
        } />
        <Route path="*" element={
          <Alert variant="warning" className="mt-4">
            Please access through the main application
          </Alert>
        } />
      </Routes>
    </div>
  );
}