import React from "react";
import { AlertCircle } from "lucide-react";

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
  onBlur,
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
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;
  const describedBy = [
    helpText ? helpId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={`field-group ${className}`}>
      {label && (
        <label htmlFor={inputId}>
          <span>
            {label}
            {required && (
              <span className="required-mark" aria-hidden="true">
                *
              </span>
            )}
          </span>
          {badge && <span className="label-badge">{badge}</span>}
        </label>
      )}

      {helpText && (
        <span id={helpId} className="field-help">
          {helpText}
        </span>
      )}

      <div className="input-wrapper">
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          autoComplete={autoComplete}
          className={`input-field ${error ? "has-error" : ""} ${
            rightAction ? "has-action" : ""
          }`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedBy}
          {...props}
        />
        {rightAction && rightAction}
      </div>

      {error && (
        <span id={errorId} className="field-error" role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          <span>{error}</span>
        </span>
      )}
    </div>
  );
}
