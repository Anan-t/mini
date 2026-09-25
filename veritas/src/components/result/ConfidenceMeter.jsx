import { useEffect, useState } from 'react';
import { getVerdict } from '../../utils/verdict';

function readingFor(confidence) {
  if (confidence >= 85) return 'Strong agreement across sources';
  if (confidence >= 65) return 'Good support, some gaps';
  if (confidence >= 40) return 'Mixed signals in the sources';
  return 'Thin evidence — treat with care';
}

export default function ConfidenceMeter({ value, verdict }) {
  const meta = getVerdict(verdict);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setWidth(value));
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="label">Confidence</span>
        <span className={`font-mono text-2xl font-medium ${meta.text}`}>{value}%</span>
      </div>

      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-800"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Confidence in this verdict"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${meta.bar}`}
          style={{ width: `${width}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-mist">{readingFor(value)}</p>
    </div>
  );
}
