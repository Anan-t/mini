import { getVerdict } from '../../utils/verdict';

export default function VerdictBadge({ verdict, size = 'md' }) {
  const meta = getVerdict(verdict);
  const scale = size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border font-mono uppercase tracking-[0.12em] ${meta.border} ${meta.bg} ${meta.text} ${scale}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.key}
    </span>
  );
}
