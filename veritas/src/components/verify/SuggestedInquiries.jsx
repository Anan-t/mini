import { ArrowRightIcon, SearchDocIcon, TextIcon, WaveIcon } from '../ui/Icons';

const SUGGESTIONS = [
  {
    icon: SearchDocIcon,
    title: 'Is the viral image of the emergency landing real?',
    hint: 'Checks compression traces and official bulletins',
    query: 'Is the viral image of the emergency landing at the city airport real?',
  },
  {
    icon: TextIcon,
    title: 'Fact-check a breaking news quote',
    hint: 'Cross-reads press releases and wire copy',
    query:
      'The health ministry announced a nationwide ban on all packaged fruit juice starting Monday.',
  },
  {
    icon: WaveIcon,
    title: 'Was this audio clip cloned?',
    hint: 'Looks at cadence and pitch variance',
    query: 'A leaked audio clip of a chief minister announcing his resignation is going around.',
  },
];

export default function SuggestedInquiries({ onPick }) {
  return (
    <section className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="label uppercase">Suggested inquiries</h2>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-signal">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-breathe" />
          Live sources
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {SUGGESTIONS.map(({ icon: Icon, title, hint, query }) => (
          <li key={title}>
            <button
              type="button"
              onClick={() => onPick(query)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-line bg-ink-850/70 p-4 text-left transition-colors hover:border-signal/40"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-800 text-mist group-hover:text-signal">
                <Icon />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-frost">{title}</span>
                <span className="block truncate text-xs text-mist">{hint}</span>
              </span>
              <ArrowRightIcon className="h-4 w-4 shrink-0 text-mist/60 group-hover:text-signal" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
