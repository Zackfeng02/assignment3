import React, { useState } from 'react';
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { authClient } from "./AuthWrapper";

const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      accessToken
      user {
        id
        email
      }
    }
  }
`;

const Register = () => {
  const [input, setInput] = useState({ 
    email: "", 
    password: "", 
    role: "user" 
  });
  const navigate = useNavigate();
  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION, { 
    client: authClient 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signup({ variables: { input } });
      localStorage.setItem("token", data.signup.accessToken);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup failed:", err.message);
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
        {loading ? "Creating account..." : "Sign Up"}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
};

export default Register;