'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function LinkForm({ onCreated }) {
  const [code, setCode] = useState('demo123');
  const [url, setUrl] = useState('https://staging.example.com');
  const [title, setTitle] = useState('Demo Link');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api('/links', {
        method: 'POST',
        body: JSON.stringify({ code, destination_url: url, title }),
      });
      setCode('');
      setUrl('');
      setTitle('');
      onCreated();
    } catch (err) {
      setError(err?.message ?? 'Failed to create link');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
    >
      <div className="absolute inset-0 -z-10 opacity-20 bg-[conic-gradient(at_top_left,theme(colors.indigo.500/.25),theme(colors.sky.500/.25),transparent)]" />
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Create new link</h2>
        <span className="text-[10px] px-2 py-1 rounded-full border border-white/10 text-slate-300">
          /r/&lt;code&gt;
        </span>
      </div>

      {error && <div className="mb-3 text-sm text-rose-300">{error}</div>}

      <div className="grid gap-3 md:grid-cols-3">
        <input
          className="w-full rounded-xl border border-white/10 bg-white/10 backdrop-blur px-3 py-2 outline-none placeholder:text-slate-300/60 focus:ring-4 focus:ring-sky-600/30"
          placeholder="code (e.g., demo123)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <input
          className="w-full rounded-xl border border-white/10 bg-white/10 backdrop-blur px-3 py-2 outline-none placeholder:text-slate-300/60 focus:ring-4 focus:ring-sky-600/30 md:col-span-2"
          placeholder="destination URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <input
          className="w-full rounded-xl border border-white/10 bg-white/10 backdrop-blur px-3 py-2 outline-none placeholder:text-slate-300/60 focus:ring-4 focus:ring-sky-600/30 md:col-span-2"
          placeholder="title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex gap-3 md:justify-end">
          <button
            className={`inline-flex items-center justify-center rounded-xl px-3 py-2 font-medium border border-transparent bg-sky-600 text-white hover:bg-sky-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating…' : 'Create link'}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl px-3 py-2 font-medium border border-white/10 hover:bg-white/10"
            onClick={() => {
              setCode('');
              setUrl('');
              setTitle('');
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}
