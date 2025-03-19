import VitalSign from '../models/VitalSign.js';

export default {
  Mutation: {
    addVitals: async (_, { input }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      return VitalSign.create({
        user: user.id,
        ...input
      });
    },

    updateVitals: async (_, { id, input }, { user }) => {
      const updated = await VitalSign.findOneAndUpdate(
        { _id: id, user: user.id },
        input,
        { new: true }
      );
      if (!updated) throw new Error('Vital sign not found');
      return updated;
    }

  },
  Query: {
    getVitals: async (_, __, { user }) => {
      return VitalSign.find({ user: user.id }).sort('-timestamp');
    },
    getVital: async (_, { id }, { user }) => {
      const vital = await VitalSign.findOne({ _id: id, user: user.id });
      if (!vital) throw new Error('Vital sign not found');
      return vital;
    },
    getLatestVitals: async (_, __, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      return await VitalSign.findOne({ user: user.id }).sort({ timestamp: -1 });
    }
  }
};