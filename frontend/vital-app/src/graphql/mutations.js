import { gql } from '@apollo/client';

export const ADD_VITAL_MUTATION = gql`
  mutation AddVitals($input: VitalSignInput!) {
    addVitals(input: $input) {
      id
      heartRate
      bloodPressure {
        systolic
        diastolic
      }
      temperature
      oxygenSaturation
      timestamp
    }
  }
`;

export const UPDATE_VITAL_MUTATION = gql`
  mutation UpdateVitals($id: ID!, $input: VitalSignInput!) {
    updateVitals(id: $id, input: $input) {
      id
      heartRate
      bloodPressure {
        systolic
        diastolic
      }
      temperature
      oxygenSaturation
      timestamp
    }
  }
`;