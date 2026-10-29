import React from "react";

export default function Input({
  label,
  badge,
  error,
  helpText,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  minLength,
  autoComplete,
  rightAction,
  className = "",
  ...props
}) {
  const inputId = id || name;

  return (
    <div className={`field-group ${className}`}>
      {label && (
        <label htmlFor={inputId}>
          <span>{label}</span>
          {badge && <span className="label-badge">{badge}</span>}
        </label>
      )}

      <div className="input-wrapper">
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          autoComplete={autoComplete}
          className={`input-field ${error ? "has-error" : ""} ${
            rightAction ? "has-action" : ""
          }`}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
          }
          {...props}
        />
        {rightAction && rightAction}
      </div>

      {error ? (
        <span id={`${inputId}-error`} className="field-help" style={{ color: "var(--danger)" }}>
          {error}
        </span>
      ) : helpText ? (
        <span id={`${inputId}-help`} className="field-help">
          {helpText}
        </span>
      ) : null}
    </div>
  );
}
