import React from 'react'
import { ErrorMessage } from 'formik'

export default function CustomErrorMessage({ errors, touched, name }) {
  return (
    errors[name] &&
    touched[name] && (
      <span style={{fontSize: '15px', backgroundColor: 'transparent'}} className="error">
        <ErrorMessage name={name} />
      </span>
    )
  );
}