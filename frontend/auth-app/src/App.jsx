import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import { Container } from 'react-bootstrap';

export default function App() {
  return (
    <Container className="mt-5">
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Container>
  );
}