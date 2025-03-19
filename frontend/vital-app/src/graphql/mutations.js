import { gql } from "@apollo/client";

export const ADD_VITALS = gql`
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

export const UPDATE_VITALS = gql`
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
