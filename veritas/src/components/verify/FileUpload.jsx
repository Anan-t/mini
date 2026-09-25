import { useRef, useState } from 'react';
import { CloseIcon } from '../ui/Icons';
import { formatBytes } from '../../utils/format';

/** Drag-and-drop uploader shared by the screenshot and voice-clip tabs. */
export default function FileUpload({
  file,
  previewUrl,
  onSelect,
  onClear,
  disabled,
  accept,
  maxBytes,
  icon: Icon,
  kindLabel,
  hint,
  renderPreview,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState('');

  const acceptList = accept.split(',');

  const handleFiles = (files) => {
    const picked = files?.[0];
    if (!picked) return;

    if (!acceptList.includes(picked.type)) {
      setLocalError(`That file type isn't supported for a ${kindLabel}.`);
      return;
    }
    if (picked.size > maxBytes) {
      setLocalError(`That file is ${formatBytes(picked.size)}. The limit is ${formatBytes(maxBytes)}.`);
      return;
    }
    setLocalError('');
    onSelect(picked);
  };

  if (file && previewUrl) {
    return (
      <div className="rounded-2xl border border-line bg-ink-850 p-3">
        <div className="relative overflow-hidden rounded-xl bg-ink-900 p-3">
          {renderPreview(previewUrl, file)}
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            aria-label={`Remove this ${kindLabel}`}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-ink-950/80 text-mist hover:text-frost"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 truncate px-1 font-mono text-[11px] text-mist">
          {file.name} · {formatBytes(file.size)}
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={[
          'flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-12 transition-colors',
          dragging ? 'border-signal bg-signal/5' : 'border-line bg-ink-850/60 hover:border-signal/40',
        ].join(' ')}
      >
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink-800 text-mist">
          <Icon className="h-6 w-6" />
        </span>
        <span className="text-sm text-frost">Drop a {kindLabel}, or browse</span>
        <span className="text-xs text-mist">{hint}</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = '';
        }}
      />

      {localError && <p className="mt-2 text-xs text-verdict-false">{localError}</p>}
    </div>
  );
}
