import { useMutation, gql } from "@apollo/client";
import { useState } from "react";
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
  const [input, setInput] = useState({ email: "", password: "", role: "user" });
  const navigate = useNavigate();
  const [signup] = useMutation(SIGNUP_MUTATION, { client: authClient });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signup({ variables: { input } });
      localStorage.setItem("token", data.signup.accessToken); // Store JWT
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={input.email}
        onChange={(e) => setInput({ ...input, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={input.password}
        onChange={(e) => setInput({ ...input, password: e.target.value })}
      />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Register;
