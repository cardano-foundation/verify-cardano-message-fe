export default function Textarea({
  disabled = false,
  className,
  labelClass,
  inputClass,
  label,
  ...props
}) {
  return (
    <div className={`${className} relative`}>
      <label
        htmlFor={props.id}
        className={`${labelClass} absolute -top-2 left-2 bg-cf-background rounded-md inline-block px-1 text-xs font-medium text-gray-900`}
      >
        {label}
      </label>
      <textarea
        className={`${inputClass} block bg-transparent w-full rounded-md border border-cf-blue-900/50 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cf-blue-500 sm:text-sm sm:leading-6`}
        disabled={disabled}
        rows={5}
        {...props}
      />
    </div>
  );
}
