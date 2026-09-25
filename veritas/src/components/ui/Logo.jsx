import { ShieldIcon } from './Icons';

export default function Logo({ size = 'sm', showWordmark = true }) {
  const box = size === 'lg' ? 'h-14 w-14 rounded-2xl' : 'h-9 w-9 rounded-xl';
  const icon = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';

  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`grid place-items-center border border-signal/30 bg-signal/10 text-signal ${box}`}
      >
        <ShieldIcon className={icon} />
      </span>
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight text-frost">Veritas</span>
      )}
    </span>
  );
}
