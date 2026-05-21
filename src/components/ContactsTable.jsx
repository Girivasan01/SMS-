import { Users } from 'lucide-react';

export default function ContactsTable({ contacts }) {
  return (
    <section className="glass-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase text-cyan-200/80">
            Step 2
          </p>
          <h2 className="text-xl font-bold text-white">Contacts</h2>
        </div>
        <span className="rounded-full border border-blue-400/25 bg-blue-500/15 px-3 py-1 text-sm font-bold text-blue-100">
          👥 {contacts.length} Contacts
        </span>
      </div>

      {contacts.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Users className="h-7 w-7 text-slate-400" />
          </div>
          <p className="text-base font-semibold text-white">No contacts loaded yet</p>
        </div>
      ) : (
        <div className="thin-scrollbar max-h-[300px] overflow-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-[#10172a]/95 text-xs uppercase text-slate-400 backdrop-blur">
              <tr>
                <th className="w-16 px-5 py-3 font-semibold">#</th>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr
                  key={contact.id || `${contact.phone_number}-${index}`}
                  className={index % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}
                >
                  <td className="px-5 py-3 text-slate-500">{index + 1}</td>
                  <td className="px-5 py-3 font-semibold text-white">{contact.name}</td>
                  <td className="px-5 py-3 font-mono text-cyan-100">{contact.phone_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
