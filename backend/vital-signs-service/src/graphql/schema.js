import { gql } from 'apollo-server-express';

export default gql`
  type BloodPressure {
    systolic: Float!
    diastolic: Float!
  }

  type VitalSign {
    id: ID!
    user: ID!
    heartRate: Float!
    bloodPressure: BloodPressure!
    temperature: Float!
    oxygenSaturation: Float
    timestamp: String!
  }

  input VitalSignInput {
    heartRate: Float!
    bloodPressure: BloodPressureInput!
    temperature: Float!
    oxygenSaturation: Float
  }

  input BloodPressureInput {
    systolic: Float!
    diastolic: Float!
  }

  type Mutation {
    addVitals(input: VitalSignInput!): VitalSign!
    updateVitals(id: ID!, input: VitalSignInput!): VitalSign!
  }

  type Query {
    getVitals: [VitalSign!]!
    getVital(id: ID!): VitalSign
    getLatestVitals: VitalSign
  }
`;