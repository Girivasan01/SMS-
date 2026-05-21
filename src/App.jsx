import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Activity, Database } from 'lucide-react';
import CampaignHistory from './components/CampaignHistory.jsx';
import ContactsTable from './components/ContactsTable.jsx';
import FileUpload from './components/FileUpload.jsx';
import MessageComposer from './components/MessageComposer.jsx';
import SendButton from './components/SendButton.jsx';
import StatusToast from './components/StatusToast.jsx';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaignId, setActiveCampaignId] = useState(null);
  const [toast, setToast] = useState(null);
  const pollTimers = useRef({});

  const fetchContacts = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/contacts');
      setContacts(data);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.error || 'Unable to load contacts.'
      });
    }
  }, []);

  const fetchCampaigns = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/sms/campaigns');
      setCampaigns(data);
      return data;
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.error || 'Unable to load campaigns.'
      });
      return [];
    }
  }, []);

  const stopPolling = useCallback((id) => {
    if (pollTimers.current[id]) {
      window.clearInterval(pollTimers.current[id]);
      delete pollTimers.current[id];
    }
  }, []);

  const pollCampaignStatus = useCallback(
    (id) => {
      if (!id || pollTimers.current[id]) {
        return;
      }

      const poll = async () => {
        try {
          const { data } = await axios.get(`/api/sms/campaigns/${id}/status`);

          setCampaigns((previousCampaigns) =>
            previousCampaigns.map((campaign) =>
              campaign.id === id
                ? {
                    ...campaign,
                    status: data.status,
                    sent_count: data.sent_count,
                    failed_count: data.failed_count,
                    total_contacts: data.total_contacts
                  }
                : campaign
            )
          );

          if (data.status === 'completed' || data.status === 'failed') {
            stopPolling(id);
            setIsSending(false);
            setActiveCampaignId(null);
            fetchCampaigns();
            setToast({
              type: data.status === 'completed' ? 'success' : 'error',
              message:
                data.status === 'completed'
                  ? 'Campaign completed.'
                  : 'Campaign failed. Check campaign history.'
            });
          }
        } catch (error) {
          stopPolling(id);
          setIsSending(false);
          setActiveCampaignId(null);
          setToast({
            type: 'error',
            message: error.response?.data?.error || 'Campaign polling stopped.'
          });
        }
      };

      poll();
      pollTimers.current[id] = window.setInterval(poll, 2000);
    },
    [fetchCampaigns, stopPolling]
  );

  const handleSend = async () => {
    if (contacts.length === 0) {
      setToast({ type: 'error', message: 'Upload contacts before sending.' });
      return;
    }

    if (!message.trim()) {
      setToast({ type: 'error', message: 'Message template is required.' });
      return;
    }

    setIsSending(true);

    try {
      const { data } = await axios.post('/api/sms/send', { message });
      setActiveCampaignId(data.campaignId);
      setToast({
        type: 'info',
        message: `Campaign started for ${data.totalContacts} contacts.`
      });
      await fetchCampaigns();
      pollCampaignStatus(data.campaignId);
    } catch (error) {
      setIsSending(false);
      setToast({
        type: 'error',
        message: error.response?.data?.error || 'Failed to start campaign.'
      });
    }
  };

  const handleUploadSuccess = useCallback(
    async (previewContacts, count) => {
      setContacts(previewContacts);
      await fetchContacts();

      if (typeof count === 'number') {
        setToast({
          type: 'success',
          message: count === 0 ? 'Contacts cleared.' : `${count} contacts loaded.`
        });
      }
    },
    [fetchContacts]
  );

  useEffect(() => {
    async function bootstrap() {
      await Promise.all([fetchContacts(), fetchCampaigns()]);
    }

    bootstrap();

    return () => {
      Object.values(pollTimers.current).forEach((timer) => window.clearInterval(timer));
      pollTimers.current = {};
    };
  }, [fetchContacts, fetchCampaigns]);

  useEffect(() => {
    campaigns
      .filter((campaign) => campaign.status === 'running')
      .forEach((campaign) => pollCampaignStatus(campaign.id));
  }, [campaigns, pollCampaignStatus]);

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="glass-card flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">⚡ BulkSMS Pro</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-sm font-bold text-emerald-100">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
              API Ready
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-300">
              <Database className="h-4 w-4 text-cyan-300" />
              {contacts.length} contacts
            </div>
            {activeCampaignId && (
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-100">
                <Activity className="h-4 w-4" />
                Campaign #{activeCampaignId}
              </div>
            )}
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,55fr)_minmax(360px,45fr)]">
          <div className="space-y-5">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            <ContactsTable contacts={contacts} />
          </div>

          <div className="space-y-5">
            <MessageComposer
              message={message}
              onChange={setMessage}
              contactCount={contacts.length}
            />
            <SendButton
              onSend={handleSend}
              isSending={isSending}
              contactCount={contacts.length}
              message={message}
            />
            <CampaignHistory campaigns={campaigns} onRefresh={fetchCampaigns} />
          </div>
        </div>
      </div>

      <StatusToast toast={toast} />
    </main>
  );
}
