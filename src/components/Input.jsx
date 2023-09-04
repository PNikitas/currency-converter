const Input = ({
  label,
  error,
  ...inputProps
}) => {
  return (
    <label className='d-block mb-3'>
      {label && <div className='form-label'>{label}</div>}
      <input className={`form-control ${error ? 'is-invalid' : ''}`} {...inputProps} />
      {error && <div className='mt-1 invalid-feedback'>{error}</div>}
    </label>
  );
};

export default Input;
