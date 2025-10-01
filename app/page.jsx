'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import LinkForm from '../components/LinkForm';
import LinkList from '../components/LinkList';

export default function Page() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setError(null);
    try {
      const data = await api('/links');
      setLinks(data);
    } catch (e) {
      setError(e?.message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <LinkForm onCreated={load} />
      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          Loading…
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-white/10 bg-rose-500/10 p-6 text-sm text-rose-200">
          {error}
        </div>
      ) : (
        <LinkList items={links} refresh={load} />
      )}
    </div>
  );
}
