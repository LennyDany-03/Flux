'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import Image from 'next/image';

function Copy({ text, small }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1100);
      }}
      className={`rounded-lg border border-white/10 px-2 ${
        small ? 'py-0.5 text-xs' : 'py-1 text-sm'
      } hover:bg-white/5`}
      title="Copy URL"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function LinkList({ items, refresh }) {
  const [qrFor, setQrFor] = useState(null);

  async function toggleActive(code, is_active) {
    await api(`/links/${code}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active }),
    });
    refresh();
  }

  async function updateDest(code, current) {
    const dest = prompt('New destination URL', current);
    if (!dest) return;
    await api(`/links/${code}`, {
      method: 'PATCH',
      body: JSON.stringify({ destination_url: dest }),
    });
    refresh();
  }

  if (!items.length)
    return (
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        No links yet. Create your first one above.
      </div>
    );

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((l) => (
        <div
          key={l.id}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        >
          <div className="absolute inset-0 -z-10 opacity-10 group-hover:opacity-20 transition-opacity bg-[radial-gradient(ellipse_at_top_right,theme(colors.indigo.500/.4),transparent_40%),radial-gradient(ellipse_at_bottom_left,theme(colors.sky.500/.4),transparent_40%)]" />

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{l.title || l.code}</h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  l.is_active
                    ? 'border-emerald-400/30 text-emerald-300 bg-emerald-400/10'
                    : 'border-rose-400/30 text-rose-300 bg-rose-400/10'
                }`}
              >
                {l.is_active ? 'active' : 'inactive'}
              </span>
            </div>
            <p className="text-xs text-slate-300/80 break-all">
              /{l.code} → {l.destination_url}
            </p>
            <p className="text-[11px] text-slate-400/80">
              Updated: {new Date(l.updated_at).toLocaleString()}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <a
              className="underline underline-offset-2 hover:text-sky-300"
              href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/r/${l.code}`}
              target="_blank"
            >
              Open
            </a>
            <span>•</span>
            <button
              className="hover:text-sky-300 underline underline-offset-2"
              onClick={() => setQrFor(l.code)}
            >
              QR
            </button>
            <Copy
              text={`${process.env.NEXT_PUBLIC_API_BASE_URL}/r/${l.code}`}
              small
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              className="inline-flex items-center justify-center rounded-xl px-3 py-2 font-medium border border-white/10 hover:bg-white/10"
              onClick={() => updateDest(l.code, l.destination_url)}
            >
              Update URL
            </button>
            <button
              className={`inline-flex items-center justify-center rounded-xl px-3 py-2 font-medium border border-transparent ${
                l.is_active ? 'bg-rose-600 hover:bg-rose-700' : 'bg-sky-600 hover:bg-sky-700'
              } text-white`}
              onClick={() => toggleActive(l.code, !l.is_active)}
            >
              {l.is_active ? 'Deactivate' : 'Activate'}
            </button>
          </div>

          {/* QR Modal */}
          {qrFor === l.code && (
            <div
              className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
              onClick={() => setQrFor(null)}
            >
              <div
                className="w-full max-w-xs rounded-2xl border border-white/10 bg-slate-900 p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-semibold text-sm">QR for /{l.code}</h4>
                  <button
                    className="text-slate-300 hover:text-white"
                    onClick={() => setQrFor(null)}
                  >
                    ✕
                  </button>
                </div>
                <Image
                  alt={`QR for ${l.code}`}
                  className="mx-auto rounded-xl border border-white/10"
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/qr/${l.code}`}
                  width={200}
                  height={200}
                />
                <div className="mt-3 flex items-center justify-between text-xs">
                  <a
                    className="underline"
                    href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/qr/${l.code}`}
                    target="_blank"
                  >
                    Open image
                  </a>
                  <Copy
                    text={`${process.env.NEXT_PUBLIC_API_BASE_URL}/r/${l.code}`}
                    small
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
