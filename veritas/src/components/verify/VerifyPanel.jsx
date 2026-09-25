import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import FileUpload from './FileUpload';
import { ImageIcon, ShieldIcon, TextIcon } from '../ui/Icons';
import { fileToDataUrl } from '../../utils/format';
import { UPLOAD } from '../../config/api';

const MODES = [
  { key: 'text', label: 'Text', icon: TextIcon },
  { key: 'image', label: 'Screenshot', icon: ImageIcon },
];

const MAX_CHARS = 2000;

export default function VerifyPanel({ value, onValueChange, onVerify, busy, initialMode = 'text' }) {
  const [mode, setMode] = useState(initialMode);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [readError, setReadError] = useState('');

  useEffect(() => setMode(initialMode), [initialMode]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const changeMode = (key) => {
    setMode(key);
    setFile(null);
    setReadError('');
  };

  const clearFile = () => {
    setFile(null);
    setReadError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;

    if (mode === 'text') {
      onVerify({ type: 'text', content: value });
      return;
    }

    if (!file) {
      setReadError('Choose a screenshot first.');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      onVerify({ type: 'image', content: dataUrl, preview: file.name });
    } catch (error) {
      setReadError(error.message);
    }
  };

  const textEmpty = value.trim().length === 0;
  const disabled = busy || (mode === 'text' ? textEmpty : !file);

  return (
    <form onSubmit={submit} className="surface p-4 shadow-lift sm:p-5">
      <div className="mb-4 inline-flex flex-wrap rounded-xl border border-line bg-ink-900 p-1">
        {MODES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => changeMode(key)}
            aria-pressed={mode === key}
            className={[
              'inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm transition-colors',
              mode === key ? 'bg-ink-800 text-frost' : 'text-mist hover:text-frost',
            ].join(' ')}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {mode === 'text' && (
        <div>
          <label htmlFor="claim" className="sr-only">
            Claim, headline or link
          </label>
          <textarea
            id="claim"
            rows={6}
            maxLength={MAX_CHARS}
            value={value}
            disabled={busy}
            onChange={(event) => onValueChange(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') submit(event);
            }}
            placeholder="Paste the message, headline or link you want checked."
            className="w-full resize-y rounded-xl border border-line bg-ink-900 p-4 text-[15px] leading-relaxed text-frost placeholder:text-mist/70 focus:border-signal/50 focus:outline-none disabled:opacity-60"
          />
          <p className="mt-2 px-1 font-mono text-[11px] text-mist/70">
            {value.length}/{MAX_CHARS} · Ctrl + Enter to run
          </p>
        </div>
      )}

      {mode === 'image' && (
        <FileUpload
          file={file}
          previewUrl={previewUrl}
          onSelect={setFile}
          onClear={clearFile}
          disabled={busy}
          accept={UPLOAD.accept}
          maxBytes={UPLOAD.maxBytes}
          icon={ImageIcon}
          kindLabel="screenshot"
          hint="PNG, JPG or WebP up to 5 MB"
          renderPreview={(url, f) => (
            <img
              src={url}
              alt={`Preview of ${f.name}`}
              className="mx-auto max-h-72 w-auto object-contain"
            />
          )}
        />
      )}

      {readError && <p className="mt-3 text-xs text-verdict-false">{readError}</p>}

      <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-mist">
          Veritas returns a verdict, a confidence score and the sources behind it.
        </p>
        <Button type="submit" size="lg" disabled={disabled} className="w-full sm:w-auto">
          <ShieldIcon className="h-4 w-4" />
          {busy ? 'Checking…' : 'Verify'}
        </Button>
      </div>
    </form>
  );
}