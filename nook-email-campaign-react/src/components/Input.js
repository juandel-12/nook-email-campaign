import React from 'react';
import styles from './Input.module.css';

const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  helperText = '',
  required = false,
  className = ''
}) => {
  return (
    <div className={`${styles.fieldGroup} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input}
        required={required}
      />
      {helperText && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
};

export default Input;
