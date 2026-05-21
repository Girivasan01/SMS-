import { useState } from 'react';
import { Clock3, RefreshCw } from 'lucide-react';

function formatDate(value) {
  if (!value) {
    return 'Just now';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
    .format(new Date(value))
    .replace(',', ' ·');
}

function getStatusClasses(status) {
  if (status === 'completed') {
    return 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100';
  }

  if (status === 'failed') {
    return 'border-red-400/30 bg-red-500/15 text-red-100';
  }

  return 'border-blue-400/30 bg-blue-500/15 text-blue-100';
}

function shortenMessage(message) {
  if (!message) {
    return '';
  }

  return message.length > 60 ? `${message.slice(0, 60)}…` : message;
}

export default function CampaignHistory({ campaigns, onRefresh }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section className="glass-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase text-cyan-200/80">
            Step 4
          </p>
          <h2 className="text-xl font-bold text-white">Campaign History</h2>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="icon-button"
          aria-label="Refresh campaign history"
          title="Refresh campaign history"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Clock3 className="h-7 w-7 text-slate-400" />
          </div>
          <p className="text-base font-semibold text-white">No campaigns yet</p>
        </div>
      ) : (
        <div className="thin-scrollbar max-h-[420px] overflow-y-auto p-3">
          <div className="space-y-3">
            {campaigns.map((campaign) => {
              const total = Number(campaign.total_contacts || 0);
              const sent = Number(campaign.sent_count || 0);
              const failed = Number(campaign.failed_count || 0);
              const processed = Math.min(total, sent + failed);
              const processedPercent = total > 0 ? Math.round((processed / total) * 100) : 0;
              const sentShare = processed > 0 ? (sent / processed) * 100 : 0;
              const failedShare = processed > 0 ? (failed / processed) * 100 : 0;
              const isExpanded = expandedId === campaign.id;
              const isRunning = campaign.status === 'running';

              return (
                <button
                  key={campaign.id}
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : campaign.id)}
                  className={`w-full rounded-xl border bg-white/[0.03] p-4 text-left transition hover:border-blue-300/50 hover:bg-white/[0.06] ${
                    isRunning
                      ? 'animate-pulse border-blue-400/60'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-500">
                        {formatDate(campaign.created_at)}
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-white">
                        {shortenMessage(campaign.message_template)}
                      </p>
                    </div>
                    <span className={`status-badge ${getStatusClasses(campaign.status)}`}>
                      {isRunning && <span className="h-2 w-2 animate-ping rounded-full bg-blue-300" />}
                      {campaign.status}
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="flex h-full overflow-hidden rounded-full transition-all duration-500"
                      style={{ width: `${processedPercent}%` }}
                    >
                      <div className="h-full bg-emerald-400" style={{ width: `${sentShare}%` }} />
                      <div className="h-full bg-red-400" style={{ width: `${failedShare}%` }} />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-semibold text-slate-300">
                      {sent} / {total} sent · {failed} failed
                    </span>
                    <span className="text-slate-500">{processedPercent}% processed</span>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                        {campaign.message_template}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
