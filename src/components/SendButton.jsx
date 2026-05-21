import { ArrowRight, Loader2, Send } from 'lucide-react';

export default function SendButton({ onSend, isSending, contactCount, message }) {
  const disabled = contactCount === 0 || message.trim() === '' || isSending;

  return (
    <div className="glass-card p-5">
      <button
        type="button"
        onClick={onSend}
        disabled={disabled}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-500 px-5 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
      >
        {isSending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending campaign…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Send to {contactCount} Contacts
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-sm text-amber-100/80">
        ⚡ Messages will be sent via Twilio in parallel batches of 10.
      </p>
    </div>
  );
}
