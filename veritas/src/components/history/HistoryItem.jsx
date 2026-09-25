import VerdictBadge from '../result/VerdictBadge';
import { ImageIcon, TextIcon, TrashIcon } from '../ui/Icons';
import { timeAgo, truncate } from '../../utils/format';

export default function HistoryItem({ entry, onOpen, onRemove }) {
  const Icon = entry.type === 'image' ? ImageIcon : TextIcon;

  return (
    <div className="group flex items-start gap-3 rounded-2xl border border-line bg-ink-850/70 p-4 transition-colors hover:border-signal/40">
      <button
        type="button"
        onClick={() => onOpen(entry)}
        className="flex min-w-0 flex-1 items-start gap-3 text-left"
      >
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-800 text-mist">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm leading-snug text-frost">
            {truncate(entry.preview, 110)}
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-2">
            <VerdictBadge verdict={entry.result.verdict} size="sm" />
            <span className="font-mono text-[11px] text-mist">
              {entry.result.confidence}% · {timeAgo(entry.createdAt)}
            </span>
          </span>
        </span>
      </button>

      <button
        type="button"
        onClick={() => onRemove(entry.id)}
        aria-label="Remove from history"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-mist/50 transition-colors hover:bg-ink-800 hover:text-verdict-false"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
