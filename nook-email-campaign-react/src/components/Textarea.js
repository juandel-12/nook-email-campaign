import React from 'react';
import styles from './Textarea.module.css';

const Textarea = ({
  label,
  value,
  onChange,
  placeholder = '',
  helperText = '',
  required = false,
  minHeight = '120px',
  monospace = false,
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
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.textarea} ${monospace ? styles.monospace : ''}`}
        style={{ minHeight }}
        required={required}
      />
      {helperText && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
};

export default Textarea;
