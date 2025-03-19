// auth-service/src/graphql/resolvers.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export default {
  Mutation: {
    signup: async (_, { input }) => {
      const existingUser = await User.findOne({ email: input.email });
      if (existingUser) throw new Error('Email already registered');
      
      const user = await User.create(input);
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      return { token, user };
    },

    login: async (_, { input }) => {
      const user = await User.findOne({ email: input.email }).select('+password');
      if (!user || !(await user.comparePassword(input.password))) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return { token, user };
    }
  },
  Query: {
    currentUser: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return User.findById(user.id);
    }
  }
};