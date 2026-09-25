import { useEffect, useState } from 'react';
import { truncate } from '../../utils/format';

const STAGES = [
  'Reading the claim',
  'Searching news archives',
  'Comparing against sources',
  'Scoring confidence',
];

export default function VerifyingState({ query }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((current) => (current < STAGES.length - 1 ? current + 1 : current));
    }, 1600);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="surface overflow-hidden p-5 sm:p-6" aria-live="polite" aria-busy="true">
      <div className="relative -mx-5 -mt-5 mb-6 h-px overflow-hidden bg-line sm:-mx-6 sm:-mt-6">
        <span className="absolute inset-y-0 w-1/3 bg-signal animate-sweep" />
      </div>

      {query?.preview && (
        <p className="mb-5 rounded-xl border border-line-soft bg-ink-900 p-3 text-sm text-mist">
          {truncate(query.preview, 160)}
        </p>
      )}

      <ol className="flex flex-col gap-3">
        {STAGES.map((text, index) => {
          const done = index < stage;
          const active = index === stage;
          return (
            <li key={text} className="flex items-center gap-3 text-sm">
              <span
                className={[
                  'h-2 w-2 shrink-0 rounded-full transition-colors',
                  done ? 'bg-signal' : active ? 'bg-signal animate-breathe' : 'bg-line',
                ].join(' ')}
              />
              <span className={done || active ? 'text-frost' : 'text-mist/60'}>{text}</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-col gap-2.5">
        {[100, 88, 64].map((width) => (
          <span
            key={width}
            style={{ width: `${width}%` }}
            className="h-3 rounded bg-ink-800 animate-breathe"
          />
        ))}
      </div>
    </section>
  );
}
