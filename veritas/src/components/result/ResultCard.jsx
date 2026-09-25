import VerdictBadge from './VerdictBadge';
import ConfidenceMeter from './ConfidenceMeter';
import EvidenceCard from './EvidenceCard';
import Button from '../ui/Button';
import { getVerdict } from '../../utils/verdict';
import { truncate } from '../../utils/format';

export default function ResultCard({ result, query, onReset }) {
  const meta = getVerdict(result.verdict);

  const evidence =
    Array.isArray(result.evidence) && result.evidence.length > 0
      ? result.evidence
      : (Array.isArray(result.sources) ? result.sources : [])
          .filter(Boolean)
          .map((url, index) => {
            let host = '';

            try {
              host = new URL(url).hostname.replace(/^www\./, '');
            } catch {
              host = url;
            }

            return {
              id: `source-${index}`,
              url,
              title: host,
              source: host,
            };
          });

  return (
    <section className="surface overflow-hidden shadow-lift animate-rise">
      <div className={`h-1 w-full ${meta.bar}`} />

      <div className="p-5 sm:p-6">
        {query?.preview && (
          <p className="mb-5 border-l-2 border-line pl-3 text-sm leading-relaxed text-mist">
            {truncate(query.preview, 220)}
          </p>
        )}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <VerdictBadge verdict={result.verdict} />
            <h2 className={`mt-3 text-2xl font-semibold tracking-tight ${meta.text}`}>
              {meta.label}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-mist">{meta.summary}</p>
          </div>

          <div className="w-full sm:w-52">
            <ConfidenceMeter value={result.confidence} verdict={result.verdict} />
          </div>
        </div>

        <div className="mt-7 border-t border-line-soft pt-5">
          <h3 className="label uppercase">Why</h3>
          <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-frost/90">
            {result.explanation}
          </p>
        </div>

        <div className="mt-7 border-t border-line-soft pt-5">
          <h3 className="label uppercase">
Sources checked{evidence.length > 0 && ` · ${evidence.length}`}
          </h3>

          {evidence.length === 0 ? (
            <p className="mt-2 text-sm text-mist">
              No sources came back for this one. Treat the verdict as provisional.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2.5">
              {evidence.map((item) => (
                <li key={item.id}>
                  <EvidenceCard item={item} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {onReset && (
          <div className="mt-7 flex justify-end">
            <Button variant="ghost" size="sm" onClick={onReset}>
              Check something else
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
