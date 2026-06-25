import { useState, useCallback } from 'react';

/**
 * useForm – Form handling with validation
 * 
 * @param {object} initialValues - Initial form values
 * @param {function} validate - Validation function
 * @param {function} onSubmit - Submit handler
 * @returns {object} { values, errors, touched, handleChange, handleBlur, handleSubmit, setField, reset }
 * 
 * Usage:
 *   const form = useForm(
 *     { email: '', password: '' },
 *     (values) => { if (!values.email) return { email: 'Required' }; },
 *     (values) => { console.log(values); }
 *   );
 */
const useForm = (initialValues = {}, validate = null, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setValues(prev => ({ ...prev, [name]: val }));
    if (touched[name] && validate) {
      const validationErrors = validate({ ...values, [name]: val });
      setErrors(prev => ({ ...prev, [name]: validationErrors?.[name] }));
    }
  }, [values, touched, validate]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (validate) {
      const validationErrors = validate(values);
      setErrors(prev => ({ ...prev, ...validationErrors }));
    }
  }, [values, validate]);

  const setField = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = useCallback(() => {
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors || {});
      return !validationErrors || Object.keys(validationErrors).length === 0;
    }
    return true;
  }, [values, validate]);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit, validateForm]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setField,
    reset,
    setValues,
  };
};

export default useForm;