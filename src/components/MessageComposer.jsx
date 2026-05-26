import { useEffect, useRef, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import axios from 'axios';

axios.defaults.baseURL = 'https://darkblue-pig-554261.hostingersite.com';

export default function MessageComposer({
  message,
  onChange,
  contactCount,
  setImageUrl
}) {
  const textareaRef = useRef(null);

  const [templates, setTemplates] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateMessage, setTemplateMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const characterCount = message.length;

  const smsSegments =
    characterCount === 0
      ? 0
      : Math.ceil(characterCount / 160);

  const preview = (
    message ||
    'Hello [Name], your offer is ready!'
  ).replace(/\[name\]/gi, 'John');

  const loadTemplates = async () => {
    try {
      const res = await axios.get('/api/templates-get');

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setTemplates(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const createTemplate = async () => {
    if (
      !templateName.trim() ||
      !templateMessage.trim()
    ) {
      alert('Name aur message required hai');
      return;
    }

    try {
      setLoading(true);

      await axios.post('/api/templates', {
        name: templateName,
        content: templateMessage
      });

      setTemplateName('');
      setTemplateMessage('');
      setShowCreate(false);

      loadTemplates();

      alert('Template saved ✅');
    } catch (err) {
      console.log(err);
      alert('Error saving template');
    } finally {
      setLoading(false);
    }
  };

  const selectTemplate = (tpl) => {
    onChange(tpl.content);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );

    try {
      const formData = new FormData();

      formData.append('image', file);

      const res = await axios.post(
        '/api/upload-image',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data'
          }
        }
      );

      setImageUrl(res.data.imageUrl);

      console.log(
        'IMAGE URL:',
        res.data.imageUrl
      );

    } catch (err) {
      console.log(err);
      alert('Image upload failed');
    }
  };

  return (
    <section className="glass-card p-5">

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          Message Composer
        </h2>

        <MessageSquare className="text-blue-300" />
      </div>

      <button
        onClick={() => setShowCreate(true)}
        className="mb-3 rounded bg-green-500/20 px-3 py-2 text-sm text-green-200"
      >
        + Create Template
      </button>

      <select
        onChange={(e) => {
          const tpl = templates.find(
            (t) =>
              String(t.id) ===
              String(e.target.value)
          );

          if (tpl) selectTemplate(tpl);
        }}
        className="mb-4 w-full rounded bg-white/10 px-3 py-2 text-sm text-white"
      >
        <option value="" style={{ color: '#0b1220', background: '#ffffff' }}>
          Select Template
        </option>

        {templates.map((t) => (
          <option
            key={t.id}
            value={t.id}
            style={{ color: '#0b1220', background: '#ffffff' }}
          >
            {t.name}
          </option>
        ))}
      </select>

      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) =>
          onChange(e.target.value)
        }
        rows={5}
        placeholder="Hello [Name], your offer is ready!"
        className="w-full rounded bg-black/30 p-3 text-white"
      />

      <button
        onClick={() =>
          onChange(message + '[Name]')
        }
        className="mt-2 rounded bg-blue-500/20 px-3 py-1 text-sm text-blue-200"
      >
        + Name
      </button>

      <div className="mt-4">

        <label className="mb-2 block text-sm text-white">
          Upload Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full rounded bg-black/30 p-2 text-white"
        />

        {imagePreview && (
          <div className="mt-3">
            <img
              src={imagePreview}
              alt="preview"
              className="max-h-60 rounded-lg border border-white/10"
            />
          </div>
        )}

      </div>

      <div className="mt-4 rounded bg-white/5 p-3 text-sm text-white">
        {preview}
      </div>

      <div className="mt-4 flex justify-between text-sm text-white">
        <span>
          Contacts: {contactCount}
        </span>

        <span>
          SMS: {contactCount * smsSegments}
        </span>
      </div>

      {showCreate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">

          <div className="w-[400px] rounded-lg bg-[#111827] p-5">

            <h3 className="mb-3 font-bold text-white">
              Create Template
            </h3>

            <input
              value={templateName}
              onChange={(e) =>
                setTemplateName(
                  e.target.value
                )
              }
              placeholder="Template Name"
              className="mb-3 w-full rounded bg-black/40 p-2 text-white"
            />

            <textarea
              value={templateMessage}
              onChange={(e) =>
                setTemplateMessage(
                  e.target.value
                )
              }
              placeholder="Template Message"
              className="mb-3 w-full rounded bg-black/40 p-2 text-white"
              rows={5}
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={() =>
                  setShowCreate(false)
                }
                className="rounded bg-red-500/30 px-3 py-2 text-red-200"
              >
                Cancel
              </button>

              <button
                onClick={createTemplate}
                disabled={loading}
                className="rounded bg-blue-500 px-3 py-2 text-white"
              >
                {loading
                  ? 'Saving...'
                  : 'Save'}
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}
