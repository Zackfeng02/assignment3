import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import { SIGNUP_MUTATION } from '../graphql/mutations';
import * as Yup from 'yup';
import { Button, Form, Container, Alert } from 'react-bootstrap';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Too short!').required('Required'),
  role: Yup.string().required('Required')
});

export default function Register() {
  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION);

  const formik = useFormik({
    initialValues: { email: '', password: '', role: 'patient' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await signup({ variables: { input: values } });
        localStorage.setItem('authToken', data.signup.token);
        window.location.href = '/';
      } catch (err) {
        console.error(err);
      }
    }
  });

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Register</h2>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            isInvalid={formik.touched.email && !!formik.errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            isInvalid={formik.touched.password && !!formik.errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select
            name="role"
            onChange={formik.handleChange}
            value={formik.values.role}
          >
            <option value="patient">Patient</option>
            <option value="clinician">Clinician</option>
          </Form.Select>
        </Form.Group>

        {error && <Alert variant="danger">{error.message}</Alert>}

        <Button 
          type="submit" 
          variant="primary" 
          disabled={loading}
          className="w-100"
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Form>
    </Container>
  );
}