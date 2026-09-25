# Veritas — frontend

React + Vite + Tailwind interface for an AI fake-news and manipulated-media checker.
Frontend only: no server, no database, no keys.

## Run it

```bash
npm install
npm run dev
```

Opens on http://localhost:5173.

## Backend URL

One place: `src/config/api.js`.

```js
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://server-ten-jet-57.vercel.app';
  
  ```

To point elsewhere without touching code, create `.env`:

```
VITE_API_BASE_URL=https://your-api.example.com
```

## Routes

- `/` — chat. Ask questions, dictate, attach a screenshot. Verification happens inline.
- `/verify` — the focused single-claim form.
- `/history` — everything checked, saved on this device.

## The calls

`POST {API_BASE_URL}/api/verify`

```json
{ "type": "text", "content": "user's text or claim" }
```

Expected reply:

```json
{
  "success": true,
  "result": {
    "verdict": "TRUE | FALSE | MISLEADING | UNVERIFIED",
    "confidence": 87,
    "explanation": "...",
    "evidence": [{ "title": "...", "source": "...", "url": "..." }]
  }
}
```

### Chat

`POST {API_BASE_URL}/api/chat`

```json
{ "messages": [{ "role": "user", "content": "how do you decide what's misleading?" }] }
```

Reply either way:

```json
{ "success": true, "reply": "..." }
```

or, if your backend decides the turn deserves a real check, return the same
`result` object as `/api/verify` and the thread renders a verdict card instead:

```json
{ "success": true, "result": { "verdict": "FALSE", "confidence": 91, "explanation": "...", "evidence": [] } }
```

If `/api/chat` doesn't exist yet the UI says so plainly and claim checks keep working.

### Attachments and voice

Screenshot mode sends the same endpoint with `"type": "image"` and `content` set to a
base64 data URL (`data:image/png;base64,…`). If your backend expects raw base64 instead,
strip the prefix in `src/components/verify/VerifyPanel.jsx`.

Malformed replies are tolerated: `normalizeResult` in `src/utils/verdict.js` clamps the
confidence, falls back to `UNVERIFIED`, and guarantees `evidence` is an array.

## Structure

```
src/
  config/api.js              backend URL, timeout, upload limits
  services/verifyApi.js      the single fetch call, with timeout + error messages
  hooks/useVerification.js   idle → loading → success | error
  context/HistoryContext.jsx history, persisted to localStorage
  utils/                     verdict metadata, formatting, file → data URL
  components/
    layout/                  Navbar, Layout
    ui/                      Button, Logo, Icons, ErrorState
    verify/                  Composer, SuggestedInquiries, VerifyPanel, FileUpload, VerifyingState, ChatMessage
    result/                  ResultCard, VerdictBadge, ConfidenceMeter, EvidenceCard
    history/                 HistoryList, HistoryItem
  pages/                     Home, Verify, History, NotFound
```

Text attachments (`.txt`, `.md`) are read in the browser and prepended to the claim —
no upload endpoint needed.

Dictation uses the browser's own `SpeechRecognition` (Chrome, Edge, Safari). Nothing is
sent anywhere for transcription; on Firefox the mic button simply doesn't render. Set the
recognition language with `VITE_SPEECH_LANG` (default `en-IN`).

## Routing: chat or check?

`src/utils/intent.js` decides per message. Small talk, "how does this work", and
questions starting with what/why/how stay conversational. URLs, "is this true",
"fact check", and long declarative statements go to `/api/verify`. An image attachment
always does. The "Check sources" toggle in the composer overrides all of it.

## States handled

- **Empty input** — Verify stays disabled; submitting anyway returns an inline message.
- **Loading** — staged progress panel, request aborts after 45 s.
- **Error** — network down, non-2xx, `success: false`, or timeout, each with its own message and a retry.
- **Success** — result card with verdict, confidence, explanation and source list.

## Home vs. /verify

Typing text on the homepage checks it inline, right there in a chat-style thread — no page
change, matching how your n8n chat already responds while you type. The paperclip and mic
icons in the homepage composer send you to `/verify` instead, opened directly on the
Screenshot or Voice clip tab, because those need a file picker rather than a text box.
`/verify` also still works as a standalone page for a deliberate, one-off check of any kind.

Voice clips send `type: "voice"` with a base64 audio data URL as `content`, using the same
`/api/verify` endpoint. If your backend expects a different type string, change the one line
in `VerifyPanel.jsx`'s `submit` function.

## Testing without the backend

Any tool that serves the JSON above works. A one-liner with `npx`:

```bash
npx json-server --port 5000 --routes '{"/api/verify":"/result"}' db.json
```

Or stub it inside `verifyContent` temporarily — keep the stub out of the final submission.
