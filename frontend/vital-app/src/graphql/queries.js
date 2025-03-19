import { gql } from "@apollo/client";

export const GET_LATEST_VITALS = gql`
  query GetLatestVitals {
    getLatestVitals {
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
