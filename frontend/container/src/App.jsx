import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Navbar, Container, Spinner, Alert } from 'react-bootstrap';

const Login = lazy(() => import('authApp/Login'));
const Register = lazy(() => import('authApp/Register'));
const VitalList = lazy(() => import('vitalApp/VitalList'));
const VitalForm = lazy(() => import('vitalApp/VitalForm'));

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">Health Monitoring System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">
                  Welcome, {user?.email}
                </Navbar.Text>
                <Navbar.Text onClick={logout} style={{ cursor: 'pointer' }}>
                  Logout
                </Navbar.Text>
              </>
            ) : (
              <>
                <Navbar.Text href="/login" className="me-3">
                  Login
                </Navbar.Text>
                <Navbar.Text href="/register">
                  Register
                </Navbar.Text>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Suspense fallback={
          <div className="text-center mt-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        }>
          <Routes>
            <Route path="/" element={
              isAuthenticated ? (
                <Navigate to="/vitals" />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/login" element={
              !isAuthenticated ? <Login /> : <Navigate to="/vitals" />
            } />
            <Route path="/register" element={
              !isAuthenticated ? <Register /> : <Navigate to="/vitals" />
            } />
            <Route path="/vitals" element={
              isAuthenticated ? (
                <>
                  <VitalList />
                  <VitalForm />
                </>
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Container>
    </>
  );
}