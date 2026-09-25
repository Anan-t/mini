import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import VerifyPanel from '../components/verify/VerifyPanel';
import VerifyingState from '../components/verify/VerifyingState';
import ResultCard from '../components/result/ResultCard';
import ReplyBubble from '../components/verify/ReplyBubble';
import ErrorState from '../components/ui/ErrorState';
import { useVerification } from '../hooks/useVerification';
import { useHistory } from '../context/HistoryContext';

export default function Verify() {
  const location = useLocation();
  const { addEntry } = useHistory();

  const [input, setInput] = useState(location.state?.query || '');
  const lastRequest = useRef(null);
  const resultRef = useRef(null);

  const onSuccess = useCallback(
    (payload) => {
      if (payload.result?.kind === 'verdict') addEntry(payload);
    },
    [addEntry]
  );
  const { status, result, error, query, run, reset } = useVerification({ onSuccess });

  const submit = useCallback(
    (payload) => {
      lastRequest.current = payload;
      run(payload);
    },
    [run]
  );

  const initialMode =
    location.state?.mode === 'voice' ? 'voice' : location.state?.mode === 'image' ? 'image' : 'text';

  useEffect(() => {
    if (status === 'success' || status === 'loading') {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [status]);

  const startOver = () => {
    reset();
    setInput('');
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pb-16 pt-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-frost">Verify a claim</h1>
        <p className="mt-1.5 text-sm text-mist">
          Paste text, or upload a screenshot or voice clip. You'll get a verdict, a confidence
          score and the sources it rests on.
        </p>
      </header>

      <VerifyPanel
        value={input}
        onValueChange={setInput}
        onVerify={submit}
        busy={status === 'loading'}
        initialMode={initialMode}
      />

      <div ref={resultRef} className="mt-6">
        {status === 'loading' && <VerifyingState query={query} />}

        {status === 'error' && (
          <ErrorState
            message={error}
            onRetry={
              lastRequest.current ? () => run(lastRequest.current) : undefined
            }
          />
        )}

        {status === 'success' && result?.kind === 'verdict' && (
          <ResultCard result={result} query={query} onReset={startOver} />
        )}

        {status === 'success' && result?.kind === 'reply' && (
          <ReplyBubble text={result.text} sources={result.sources} />
        )}
      </div>
    </div>
  );
}
