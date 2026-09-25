import { ArrowRightIcon, LinkIcon } from '../ui/Icons';
import { hostFromUrl } from '../../utils/format';

export default function EvidenceCard({ item }) {
  const host = hostFromUrl(item.url);
  const hasLink = Boolean(item.url);

  const inner = (
    <>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-800 text-mist group-hover:text-signal">
        <LinkIcon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium leading-snug text-frost">{item.title}</span>
        <span className="mt-1 block font-mono text-[11px] text-mist">
          {item.source}
          {host && ` · ${host}`}
        </span>
      </span>
      {hasLink && (
        <ArrowRightIcon className="h-4 w-4 shrink-0 text-mist/50 group-hover:text-signal" />
      )}
    </>
  );

  const className =
    'group flex w-full items-start gap-3 rounded-xl border border-line-soft bg-ink-900 p-3.5 text-left transition-colors hover:border-signal/40';

  if (!hasLink) {
    return <div className={className}>{inner}</div>;
  }

  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  );
}
