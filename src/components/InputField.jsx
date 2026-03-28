export default function InputField({ label, value, multiline = false, className = '' }) {
  const baseClass =
    'w-full bg-surface-container-high ghost-border rounded-inner px-3 py-2 text-sm text-on-surface outline-none focus-inner-glow placeholder:text-on-surface-variant/40 transition-shadow duration-200'

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          className={`${baseClass} resize-none`}
          rows={4}
          defaultValue={value}
          readOnly
        />
      ) : (
        <input
          className={baseClass}
          type="text"
          defaultValue={value}
          readOnly
        />
      )}
    </div>
  )
}
