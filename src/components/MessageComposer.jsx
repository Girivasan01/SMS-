import { useRef } from 'react';
import { MessageSquare, Plus } from 'lucide-react';

export default function MessageComposer({ message, onChange, contactCount }) {
  const textareaRef = useRef(null);
  const characterCount = message.length;
  const smsSegments = characterCount === 0 ? 0 : Math.ceil(characterCount / 160);
  const preview = (message || 'Hello [Name], your offer is ready!').replace(/\[name\]/gi, 'John');

  const insertToken = (token) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      onChange(`${message}${token}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextMessage = `${message.slice(0, start)}${token}${message.slice(end)}`;
    onChange(nextMessage);

    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + token.length, start + token.length);
    });
  };

  return (
    <section className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-cyan-200/80">
            Step 3
          </p>
          <h2 className="text-xl font-bold text-white">Message Composer</h2>
        </div>
        <MessageSquare className="h-6 w-6 text-blue-300" />
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          placeholder="Hello [Name], your offer is ready!"
          className="field min-h-32 w-full resize-y px-4 py-3 text-sm leading-6"
        />
        <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-[#0d1426] px-2 py-1 text-xs font-semibold text-slate-400">
          {characterCount} chars
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-semibold text-slate-300">Quick Insert</span>
        <button
          type="button"
          onClick={() => insertToken('[Name]')}
          className="inline-flex items-center gap-2 rounded-lg border border-blue-400/25 bg-blue-500/10 px-3 py-2 text-sm font-bold text-blue-100 transition hover:border-blue-300/70 hover:bg-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <Plus className="h-4 w-4" />
          [Name]
        </button>
      </div>

      <p className="mt-3 text-sm text-slate-400">
        Use <code className="rounded bg-white/10 px-1.5 py-0.5">[Name]</code> to personalize the
        message for each recipient.
      </p>

      <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-white">Preview for first contact</p>
          <span className="rounded-full border border-amber-300/25 bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-100">
            {smsSegments} SMS {smsSegments === 1 ? 'segment' : 'segments'}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{preview}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <span className="block text-slate-500">Audience</span>
          <strong className="text-white">{contactCount} contacts</strong>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <span className="block text-slate-500">Estimated SMS</span>
          <strong className="text-white">{contactCount * smsSegments}</strong>
        </div>
      </div>
    </section>
  );
}
