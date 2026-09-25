import VerifyingState from '../verify/VerifyingState';
import ResultCard from '../result/ResultCard';
import ReplyBubble from './ReplyBubble';
import ErrorState from '../ui/ErrorState';

/** One turn in the homepage chat: the user's line, then Veritas's answer. */
export default function ChatMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="self-end rounded-2xl rounded-br-sm border border-line bg-ink-800 px-4 py-2.5 text-sm text-frost sm:max-w-[80%]">
        {message.text}
      </div>

      {message.status === 'loading' && (
        message.mode === 'verify' ? (
          <VerifyingState query={{ preview: message.text }} />
        ) : (
          <div className="flex items-center gap-2.5 self-start rounded-2xl rounded-bl-sm border border-line bg-ink-850/80 px-4 py-3 text-sm text-mist">
            <span className="h-2 w-2 rounded-full bg-signal animate-breathe" />
            <span>Veritas is thinking…</span>
          </div>
        )
      )}

      {message.status === 'error' && (
        <ErrorState message={message.error} onRetry={() => onRetry(message.id)} />
      )}

      {message.status === 'success' && message.result?.kind === 'verdict' && (
        <ResultCard result={message.result} query={{ preview: message.text }} />
      )}

      {message.status === 'success' && message.result?.kind === 'chat' && (
        <ReplyBubble
          text={message.result.text}
          sources={message.result.sources}
        />
      )}
    </div>
  );
}
