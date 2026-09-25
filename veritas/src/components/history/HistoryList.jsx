import HistoryItem from './HistoryItem';
import { HistoryIcon } from '../ui/Icons';

export default function HistoryList({ entries, onOpen, onRemove, emptyAction }) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line px-6 py-14 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink-850 text-mist">
          <HistoryIcon className="h-6 w-6" />
        </span>
        <p className="text-sm text-frost">Nothing checked yet</p>
        <p className="max-w-xs text-xs text-mist">
          Every claim you verify is saved here on this device, with its verdict and sources.
        </p>
        {emptyAction}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {entries.map((entry) => (
        <li key={entry.id}>
          <HistoryItem entry={entry} onOpen={onOpen} onRemove={onRemove} />
        </li>
      ))}
    </ul>
  );
}
