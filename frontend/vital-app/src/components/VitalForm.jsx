import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import { ADD_VITAL_MUTATION, UPDATE_VITAL_MUTATION } from '../graphql/mutations';
import * as Yup from 'yup';
import { Button, Form, Modal, Alert } from 'react-bootstrap';

const validationSchema = Yup.object().shape({
  heartRate: Yup.number()
    .min(30, 'Too low!')
    .max(250, 'Too high!')
    .required('Required'),
  bloodPressure: Yup.object().shape({
    systolic: Yup.number()
      .min(50, 'Too low!')
      .max(250, 'Too high!')
      .required('Required'),
    diastolic: Yup.number()
      .min(30, 'Too low!')
      .max(150, 'Too high!')
      .required('Required')
  }),
  temperature: Yup.number()
    .min(34, 'Too low!')
    .max(43, 'Too high!')
    .required('Required'),
  oxygenSaturation: Yup.number()
    .min(70, 'Too low!')
    .max(100, 'Invalid value')
});

export default function VitalForm({ vital, show, onHide }) {
  const [mutate, { loading, error }] = useMutation(
    vital ? UPDATE_VITAL_MUTATION : ADD_VITAL_MUTATION,
    {
      refetchQueries: [{ query: GET_VITALS_QUERY }]
    }
  );

  const formik = useFormik({
    initialValues: {
      heartRate: vital?.heartRate || '',
      bloodPressure: {
        systolic: vital?.bloodPressure?.systolic || '',
        diastolic: vital?.bloodPressure?.diastolic || ''
      },
      temperature: vital?.temperature || '',
      oxygenSaturation: vital?.oxygenSaturation || ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const variables = vital ? { id: vital.id, input: values } : { input: values };
        await mutate({ variables });
        onHide();
      } catch (err) {
        console.error(err);
      }
    }
  });

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{vital ? 'Edit' : 'Add'} Vital Signs</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Heart Rate (bpm)</Form.Label>
            <Form.Control
              name="heartRate"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.heartRate}
              isInvalid={formik.touched.heartRate && !!formik.errors.heartRate}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.heartRate}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Blood Pressure</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                name="bloodPressure.systolic"
                placeholder="Systolic"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.bloodPressure.systolic}
                isInvalid={formik.touched.bloodPressure?.systolic && !!formik.errors.bloodPressure?.systolic}
              />
              <Form.Control
                name="bloodPressure.diastolic"
                placeholder="Diastolic"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.bloodPressure.diastolic}
                isInvalid={formik.touched.bloodPressure?.diastolic && !!formik.errors.bloodPressure?.diastolic}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Temperature (°C)</Form.Label>
            <Form.Control
              name="temperature"
              type="number"
              step="0.1"
              onChange={formik.handleChange}
              value={formik.values.temperature}
              isInvalid={formik.touched.temperature && !!formik.errors.temperature}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.temperature}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Oxygen Saturation (%)</Form.Label>
            <Form.Control
              name="oxygenSaturation"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.oxygenSaturation}
              isInvalid={formik.touched.oxygenSaturation && !!formik.errors.oxygenSaturation}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.oxygenSaturation}
            </Form.Control.Feedback>
          </Form.Group>

          {error && <Alert variant="danger">{error.message}</Alert>}

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}