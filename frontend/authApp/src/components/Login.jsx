import React, { useState } from 'react';
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { authClient } from "./AuthWrapper";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        email
      }
    }
  }
`;

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, { 
    client: authClient 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { input } });
      localStorage.setItem("token", data.login.accessToken);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={input.email}
        onChange={(e) => setInput(prev => ({ ...prev, email: e.target.value }))}
      />
      <input
        type="password"
        placeholder="Password"
        value={input.password}
        onChange={(e) => setInput(prev => ({ ...prev, password: e.target.value }))}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
};

export default Login;