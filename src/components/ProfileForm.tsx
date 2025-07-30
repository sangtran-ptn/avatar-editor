import React from 'react';
import { Formik, Form } from 'formik';
import { Button, Stack, TextField } from '@mui/material';
import * as Yup from 'yup';

interface Props {
  initialValues: { email: string; firstName?: string; lastName?: string };
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const ProfileForm: React.FC<Props> = ({ initialValues, onSubmit, onCancel }) => (
  <Formik
    initialValues={initialValues}
    validationSchema={Yup.object({})}
    onSubmit={onSubmit}
  >
    {({ values, handleChange }) => (
      <Form>
        <Stack spacing={2}>
          <TextField label="Email" name="email" value={values.email} disabled fullWidth />
          <TextField label="First Name" name="firstName" value={values.firstName || ''} onChange={handleChange} fullWidth />
          <TextField label="Last Name" name="lastName" value={values.lastName || ''} onChange={handleChange} fullWidth />
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={onCancel}>Cancel</Button>
            <Button variant="contained" type="submit">Save</Button>
          </Stack>
        </Stack>
      </Form>
    )}
  </Formik>
);

export default ProfileForm;
