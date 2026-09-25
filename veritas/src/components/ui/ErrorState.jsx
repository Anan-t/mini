import Button from './Button';
import { AlertIcon } from './Icons';

export default function ErrorState({ message, onRetry }) {
  return (
    <section
      role="alert"
      className="rounded-2xl border border-verdict-false/30 bg-verdict-false/5 p-5 animate-rise"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-verdict-false">
          <AlertIcon />
        </span>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-frost">The check didn't run</h2>
          <p className="mt-1 text-sm text-mist">{message}</p>
          {onRetry && (
            <Button variant="ghost" size="sm" className="mt-4" onClick={onRetry}>
              Try again
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
