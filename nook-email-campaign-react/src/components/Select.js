import React from 'react';
import styles from './Select.module.css';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  required = false,
  className = ''
}) => {
  return (
    <div className={`${styles.selectGroup} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={styles.select}
        required={required}
      >
        {options.map((option, idx) => (
          <option key={idx} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
