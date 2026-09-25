import { useCallback, useEffect, useRef, useState } from 'react';
import { verifyContent } from '../services/verifyApi';

/**
 * Drives a single verification request.
 * status: 'idle' | 'loading' | 'success' | 'error'
 */
export function useVerification({ onSuccess } = {}) {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState(null);

  const controllerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  const run = useCallback(
    async ({ type, content, preview = '' }) => {
      const trimmed = type === 'text' ? String(content || '').trim() : content;

      if (!trimmed) {
        setStatus('error');
        setError(
          type === 'text'
            ? 'Type a claim, headline or link first.'
            : 'Choose a screenshot first.'
        );
        return null;
      }

      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setStatus('loading');
      setError('');
      setResult(null);
      setQuery({ type, preview: preview || (type === 'text' ? trimmed : 'Screenshot') });

      try {
        const data = await verifyContent({ type, content: trimmed, signal: controller.signal });
        if (!mountedRef.current || controller.signal.aborted) return null;

        setResult(data);
        setStatus('success');
        onSuccess?.({
          result: data,
          type,
          preview: preview || (type === 'text' ? trimmed : 'Screenshot'),
        });
        return data;
      } catch (err) {
        if (!mountedRef.current || controller.signal.aborted) return null;
        setError(err.message || 'Something went wrong during the check.');
        setStatus('error');
        return null;
      }
    },
    [onSuccess]
  );

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setStatus('idle');
    setResult(null);
    setError('');
    setQuery(null);
  }, []);

  const showResult = useCallback((entry) => {
    controllerRef.current?.abort();
    setResult(entry.result);
    setQuery({ type: entry.type, preview: entry.preview });
    setError('');
    setStatus('success');
  }, []);

  return { status, result, error, query, run, reset, showResult };
}
