const Select = ({
  options,
  label,
  ...selectProps
}) => {
  return (
    <label className='d-block mb-3'>
      {label && <div className='form-label'>{label}</div>}
      <select
        className="form-control"
        {...selectProps}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
};

export default Select;
