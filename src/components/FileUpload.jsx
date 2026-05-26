import { useRef, useState } from 'react';
import axios from 'axios';
import { FileSpreadsheet, Loader2, Trash2, Upload } from 'lucide-react';

export default function FileUpload({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const inputRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);
    setStatus(null);

    try {
      const { data } = await axios.post('/api/contacts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setStatus({
        type: 'success',
        message: `✅ ${data.count} contacts loaded`
      });
      onUploadSuccess(data.contacts, data.count);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || 'Upload failed. Please check the file format.'
      });
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    uploadFile(event.dataTransfer.files?.[0]);
  };

  const clearContacts = async () => {
    setStatus(null);

    try {
      await axios.delete('/api/contacts');
      setStatus({
        type: 'success',
        message: 'Contacts cleared'
      });
      onUploadSuccess([], 0);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || 'Failed to clear contacts.'
      });
    }
  };

  return (
    <section className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-cyan-200/80">
            Step 1
          </p>
          <h2 className="text-xl font-bold text-white">Upload Contacts</h2>
        </div>
        <FileSpreadsheet className="h-6 w-6 text-cyan-300" />
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-5 py-8 text-center transition ${
          isDragging
            ? 'border-cyan-300 bg-cyan-400/10'
            : 'border-white/15 bg-white/[0.03] hover:border-blue-400/70 hover:bg-blue-500/10'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(event) => uploadFile(event.target.files?.[0])}
        />
        {isUploading ? (
          <Loader2 className="mb-3 h-9 w-9 animate-spin text-blue-300" />
        ) : (
          <Upload className="mb-3 h-9 w-9 text-blue-300" />
        )}
        <span className="text-base font-semibold text-white">
          Drop your Excel or CSV file here
        </span>
        <span className="mt-1 text-sm text-slate-400">or click to browse</span>
      </button>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          Columns required: <code className="rounded bg-white/10 px-1.5 py-0.5">Full Name</code>{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5">Cell Phone</code>
        </p>
        <button
          type="button"
          onClick={clearContacts}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-100 transition hover:border-red-300/60 hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500/30"
        >
          <Trash2 className="h-4 w-4" />
          Clear Contacts
        </button>
      </div>

      {status?.message && (
        <div
          className={`mt-4 rounded-lg border px-3 py-2 text-sm font-semibold ${
            status.type === 'success'
              ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200'
              : 'border-red-400/25 bg-red-500/10 text-red-200'
          }`}
        >
          {status.message}
        </div>
      )}
    </section>
  );
}
