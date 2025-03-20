import { gql } from "@apollo/client";

export const GET_VITALS_QUERY = gql`
  query GetVitals {
    getVitals {
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
