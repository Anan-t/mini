import { useRef, useState } from 'react';
import { CloseIcon, ImageIcon } from '../ui/Icons';
import { UPLOAD } from '../../config/api';
import { formatBytes } from '../../utils/format';

export default function ImageUpload({ file, previewUrl, onSelect, onClear, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState('');

  const accept = UPLOAD.accept.split(',');

  const handleFiles = (files) => {
    const picked = files?.[0];
    if (!picked) return;

    if (!accept.includes(picked.type)) {
      setLocalError('Use a PNG, JPG or WebP image.');
      return;
    }
    if (picked.size > UPLOAD.maxBytes) {
      setLocalError(`That file is ${formatBytes(picked.size)}. The limit is 5 MB.`);
      return;
    }
    setLocalError('');
    onSelect(picked);
  };

  if (file && previewUrl) {
    return (
      <div className="rounded-2xl border border-line bg-ink-850 p-3">
        <div className="relative overflow-hidden rounded-xl bg-ink-900">
          <img
            src={previewUrl}
            alt={`Preview of ${file.name}`}
            className="mx-auto max-h-72 w-auto object-contain"
          />
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            aria-label="Remove this screenshot"
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
          <ImageIcon className="h-6 w-6" />
        </span>
        <span className="text-sm text-frost">Drop a screenshot, or browse</span>
        <span className="text-xs text-mist">PNG, JPG or WebP up to 5 MB</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={UPLOAD.accept}
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
