import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Corrected import paths (remove /components/)
const Login = React.lazy(() => import('authApp/Login'));
const Register = React.lazy(() => import('authApp/Register'));
const VitalList = React.lazy(() => import('vitalApp/VitalList'));
const VitalForm = React.lazy(() => import('vitalApp/VitalForm'));
const AuthWrapper = React.lazy(() => import('authApp/AuthWrapper'));
const VitalProvider = React.lazy(() => import('vitalApp/VitalProvider'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthWrapper>
          <VitalProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/vitals" element={<VitalList />} />
              <Route path="/vitals/new" element={<VitalForm />} />
            </Routes>
          </VitalProvider>
        </AuthWrapper>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;