export const VERDICTS = {
  TRUE: {
    key: 'TRUE',
    label: 'Holds up',
    short: 'True',
    summary: 'Sources agree with this claim.',
    text: 'text-verdict-true',
    border: 'border-verdict-true/40',
    bg: 'bg-verdict-true/10',
    bar: 'bg-verdict-true',
    dot: 'bg-verdict-true',
  },
  FALSE: {
    key: 'FALSE',
    label: 'Not true',
    short: 'False',
    summary: 'Sources contradict this claim.',
    text: 'text-verdict-false',
    border: 'border-verdict-false/40',
    bg: 'bg-verdict-false/10',
    bar: 'bg-verdict-false',
    dot: 'bg-verdict-false',
  },
  MISLEADING: {
    key: 'MISLEADING',
    label: 'Missing context',
    short: 'Misleading',
    summary: 'Partly accurate, but framed in a way that misleads.',
    text: 'text-verdict-mislead',
    border: 'border-verdict-mislead/40',
    bg: 'bg-verdict-mislead/10',
    bar: 'bg-verdict-mislead',
    dot: 'bg-verdict-mislead',
  },
  UNVERIFIED: {
    key: 'UNVERIFIED',
    label: 'Not enough evidence',
    short: 'Unverified',
    summary: 'No reliable source confirms or denies this yet.',
    text: 'text-verdict-unknown',
    border: 'border-verdict-unknown/40',
    bg: 'bg-verdict-unknown/10',
    bar: 'bg-verdict-unknown',
    dot: 'bg-verdict-unknown',
  },
};

export function getVerdict(value) {
  const key = String(value || '').trim().toUpperCase();
  return VERDICTS[key] || VERDICTS.UNVERIFIED;
}

const clampConfidence = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
};

const normalizeSources = (list) =>
  (Array.isArray(list) ? list : [])
    .filter(Boolean)
    .map((item, index) => ({
      id: `${index}-${item?.url || item?.title || index}`,
      title: item?.title?.trim() || item?.name?.trim() || 'Untitled source',
      source: item?.source?.trim() || 'Unknown publisher',
      url: typeof item?.url === 'string' ? item.url : '',
    }));

/** Shape whatever the backend sends into something the UI can always render. */
export function normalizeResult(raw) {
  return {
    verdict: getVerdict(raw?.verdict).key,
    confidence: clampConfidence(raw?.confidence),
    explanation:
      typeof raw?.explanation === 'string' && raw.explanation.trim()
        ? raw.explanation.trim()
        : 'The server did not return an explanation for this verdict.',
    evidence: normalizeSources(raw?.evidence),
  };
}

/** Shape a plain conversational reply: { response, sources }. */
export function normalizeReply(raw) {
  return {
    kind: 'reply',
    text:
      typeof raw?.response === 'string' && raw.response.trim()
        ? raw.response.trim()
        : "I didn't get a reply for that.",
    sources: normalizeSources(raw?.sources),
  };
}

/**
 * The backend answers in one of two shapes:
 *  - a verification verdict: { success, result: { verdict, confidence, explanation, evidence } }
 *  - a plain chat reply:     { response, sources }
 * This looks at what actually came back and normalizes to whichever fits.
 */
export function normalizeApiResponse(payload) {
  if (payload?.success && payload?.result && payload.result.verdict !== undefined) {
    return { kind: 'verdict', ...normalizeResult(payload.result) };
  }
  if (typeof payload?.response === 'string') {
    return normalizeReply(payload);
  }
  if (payload?.result && typeof payload.result.response === 'string') {
    return normalizeReply(payload.result);
  }
  return null;
}
