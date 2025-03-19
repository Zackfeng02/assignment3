import { gql } from 'apollo-server-express';

export default gql`
  type User {
    id: ID!
    email: String!
    role: String!
    createdAt: String!
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  type LogoutResponse {
    message: String!
  }

  input SignupInput {
    email: String!
    password: String!
    role: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Mutation {
    signup(input: SignupInput!): AuthPayload
    login(input: LoginInput!): AuthPayload
    logout: LogoutResponse!
  }

  type Query {
    currentUser: User
  }
`;