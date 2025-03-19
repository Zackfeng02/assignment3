import { useQuery } from '@apollo/client';
import { GET_VITALS_QUERY } from '../graphql/queries';
import { useState } from 'react';
import { Button, Table, Card, Alert, Spinner } from 'react-bootstrap';
import VitalForm from './VitalForm';

export default function VitalList() {
  const { loading, error, data } = useQuery(GET_VITALS_QUERY, {
    pollInterval: 5000
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedVital, setSelectedVital] = useState(null);

  const handleEdit = (vital) => {
    setSelectedVital(vital);
    setShowForm(true);
  };

  return (
    <Card className="mt-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Vital Signs History</h5>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Add New
        </Button>
      </Card.Header>
      
      <Card.Body>
        {loading && <Spinner animation="border" />}
        
        {error && (
          <Alert variant="danger">
            Error loading vital signs: {error.message}
          </Alert>
        )}

        {data?.getVitals?.length > 0 ? (
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Heart Rate</th>
                <th>Blood Pressure</th>
                <th>Temperature</th>
                <th>O₂ Sat</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.getVitals.map((vital) => (
                <tr key={vital.id}>
                  <td>{new Date(vital.timestamp).toLocaleDateString()}</td>
                  <td>{vital.heartRate} bpm</td>
                  <td>{vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}</td>
                  <td>{vital.temperature}°C</td>
                  <td>{vital.oxygenSaturation || 'N/A'}%</td>
                  <td>
                    <Button 
                      variant="link" 
                      onClick={() => handleEdit(vital)}
                      className="text-primary"
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <Alert variant="info">No vital signs recorded yet</Alert>
        )}
      </Card.Body>

      <VitalForm
        vital={selectedVital}
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setSelectedVital(null);
        }}
      />
    </Card>
  );
}