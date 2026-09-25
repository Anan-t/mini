import EvidenceCard from '../result/EvidenceCard';

/** For a plain conversational reply — no verdict, just text and maybe sources. */
export default function ReplyBubble({ text, sources = [] }) {
  return (
    <div className="self-start rounded-2xl rounded-bl-sm border border-line bg-ink-850/80 px-4 py-3 text-sm leading-relaxed text-frost sm:max-w-[85%]">
      <p>{text}</p>

      {sources.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2 border-t border-line-soft pt-3">
          {sources.map((item) => (
            <li key={item.id}>
              <EvidenceCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
