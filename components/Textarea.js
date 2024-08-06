import { useState } from 'react';

export default function Textarea({
  disabled = false,
  className,
  labelClass,
  inputClass,
  label,
  placeholder,
  value,
  onChange,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`${className} relative`}>
      <label
        htmlFor={props.id}
        className={`${labelClass} absolute -top-2 left-2 bg-cf-background rounded-md inline-block px-1 text-xs font-medium text-gray-900`}
      >
        {label}
      </label>
      <div className="relative">
        <textarea
          className={`${inputClass} w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cf-blue-500 focus:border-cf-blue-500 text-sm placeholder:text-xs`}
          disabled={disabled}
          rows={5}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          onChange={onChange}
          {...props}
        />
        <span
          className={`absolute left-3 top-3 text-xs text-gray-500 transition-opacity duration-200 pointer-events-none ${
            isFocused || value ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {placeholder}
        </span>
      </div>
    </div>
  );
}