// pages/Home.jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import Logo from '../components/ui/Logo';
import Composer from '../components/verify/Composer';
import SuggestedInquiries from '../components/verify/SuggestedInquiries';
import ChatMessage from '../components/verify/ChatMessage';
import { useHistory } from '../context/HistoryContext';
import { sendChatMessage, verifyContent, prepareImage } from '../services/verifyApi';

let messageId = 0;
const nextId = () => `m${Date.now()}-${messageId++}`;

export default function Home() {
  const { addEntry } = useHistory();
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  // Free blob URLs when the page unmounts
  const previewsRef = useRef([]);
  useEffect(() => () => previewsRef.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const ask = useCallback(
    async (text, file) => {
      const id = nextId();
      const imagePreview = file ? URL.createObjectURL(file) : '';
      if (imagePreview) previewsRef.current.push(imagePreview);

      setMessages((prev) => [
        ...prev,
        {
          id,
          text: text || (file ? file.name : ''),
          imagePreview, // ChatMessage can show <img src={message.imagePreview} />
          file, // kept so Retry can resend the image
          status: 'loading',
          result: null,
          error: '',
        },
      ]);

      const conversation = messages
        .filter((m) => m.status === 'success' && m.result)
        .map((m) => ({
          role: 'user',
          content: m.text,
          reply: m.result?.text || m.result?.explanation || '',
        }));

          try {
        const result = file
          ? await verifyContent({ type: 'image', content: await prepareImage(file) })
          : await sendChatMessage({ message: text, conversation });
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: 'success', result } : m))
        );
        if (result.kind === 'verdict') {
          addEntry({
            result,
            type: file ? 'image' : 'text',
            preview: result.extractedClaim || text || file?.name || '',
          });
        }
      } catch (error) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: 'error', error: error.message } : m))
        );
      }
    },
    [messages, addEntry]
  );

  const retry = useCallback(
    (id) => {
      const message = messages.find((m) => m.id === id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (message) ask(message.file ? '' : message.text, message.file);
    },
    [messages, ask]
  );

  const busy = messages.some((m) => m.status === 'loading');
  const hasChat = messages.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-5 pb-6 pt-14 sm:pt-20">
      {!hasChat && (
        <div className="flex flex-col items-center text-center animate-rise">
          <Logo size="lg" showWordmark={false} />
          <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-frost sm:text-4xl">
            How can I help you verify today?
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-mist sm:text-base">
            Check a breaking headline, read a suspicious screenshot, or test a claim against what
            reliable sources actually say.
          </p>
        </div>
      )}

      {!hasChat && (
        <div className="mt-10">
          <SuggestedInquiries onPick={(q) => ask(q)} />
        </div>
      )}

      {hasChat && (
        <div className="flex flex-col gap-6 pb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} onRetry={retry} />
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      <div className={hasChat ? 'sticky bottom-4' : 'mt-6'}>
        <Composer onSubmit={ask} disabled={busy} />
        {!hasChat && (
          <p className="mt-2.5 px-1 text-center text-xs text-mist/70">
            Have an image or voice clip? Use the clip or mic icon to attach or dictate directly.
          </p>
        )}
      </div>
    </div>
  );
}