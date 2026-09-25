// components/verify/Composer.jsx
import { useEffect, useRef, useState } from 'react';

const SpeechRecognition =
  typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

const ClipIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5l-8.6 8.6a5 5 0 01-7.1-7.1l8.9-8.9a3.3 3.3 0 014.7 4.7l-8.9 8.9a1.7 1.7 0 01-2.4-2.4l8.2-8.2" />
  </svg>
);
const MicIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="3" width="6" height="12" rx="3" />
    <path d="M5 11a7 7 0 0014 0M12 18v3" />
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

/**
 * onSubmit(text, file) - file is a File object or undefined.
 */
export default function Composer({ onSubmit, disabled = false, placeholder = 'Paste a claim, headline or link…' }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [listening, setListening] = useState(false);
  const fileRef = useRef(null);
  const textRef = useRef(null);
  const recRef = useRef(null);

  // preview URL for the attached image
  useEffect(() => {
    if (!file) return setPreview('');
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // auto-grow textarea
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);

  const attach = (f) => {
    if (f && f.type.startsWith('image/')) setFile(f);
  };

  const submit = () => {
    const value = text.trim();
    if ((!value && !file) || disabled) return;
    onSubmit(value, file || undefined);
    setText('');
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  // paste a screenshot straight from the clipboard
  const onPaste = (e) => {
    const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith('image/'));
    if (item) {
      e.preventDefault();
      attach(item.getAsFile());
    }
  };

  const toggleMic = () => {
    if (!SpeechRecognition) return alert('Voice input is not supported in this browser.');
    if (listening) return recRef.current?.stop();
    const rec = new SpeechRecognition();
    rec.lang = navigator.language || 'en-IN';
    rec.interimResults = true;
    const base = text ? text + ' ' : '';
    rec.onresult = (ev) => {
      const spoken = [...ev.results].map((r) => r[0].transcript).join('');
      setText(base + spoken);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  const canSend = !disabled && (text.trim() || file);

  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        attach(e.dataTransfer.files?.[0]);
      }}
    >
      {preview && (
        <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/5 p-2">
          <img src={preview} alt="Attached" className="h-14 w-14 rounded-lg object-cover" />
          <span className="min-w-0 flex-1 truncate text-sm text-mist">{file.name}</span>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="rounded-full px-2 py-1 text-sm text-mist hover:text-frost"
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-end gap-1">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => attach(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          className="rounded-full p-2.5 text-mist transition hover:text-frost disabled:opacity-40"
          aria-label="Attach image"
        >
          <ClipIcon />
        </button>

        <textarea
          ref={textRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          placeholder={file ? 'Add a note (optional)…' : placeholder}
          className="max-h-40 min-h-[2.75rem] flex-1 resize-none bg-transparent px-2 py-2.5 text-base text-frost placeholder:text-mist/60 focus:outline-none"
        />

        <button
          type="button"
          onClick={toggleMic}
          disabled={disabled}
          className={`rounded-full p-2.5 transition disabled:opacity-40 ${listening ? 'animate-pulse text-red-400' : 'text-mist hover:text-frost'}`}
          aria-label={listening ? 'Stop dictation' : 'Dictate'}
        >
          <MicIcon />
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          className="rounded-full bg-frost p-2.5 text-black transition disabled:opacity-30"
          aria-label="Send"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}