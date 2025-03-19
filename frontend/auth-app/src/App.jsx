import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear stored JWT
    navigate("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default App;