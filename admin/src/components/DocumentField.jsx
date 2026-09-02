import { useRef, useState } from 'react';

const MAX_BYTES = 8 * 1024 * 1024;
const DOCUMENT_DIR = 'public/documents';

const slugify = (name) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-|-$/g, '');

export default function DocumentField({ field, value, onChange, client }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const upload = async (file) => {
    setError(null);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Seuls les documents PDF sont acceptés.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`Ce fichier fait ${(file.size / 1024 / 1024).toFixed(1)} Mo. La limite est de 8 Mo.`);
      return;
    }

    const signature = new TextDecoder().decode(await file.slice(0, 5).arrayBuffer());
    if (signature !== '%PDF-') {
      setError('Ce fichier ne semble pas être un PDF valide.');
      return;
    }

    setBusy(true);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1]);
        reader.onerror = () => reject(new Error('Lecture du fichier impossible.'));
        reader.readAsDataURL(file);
      });
      const name = `${Date.now()}-${slugify(file.name)}`;
      await client.writeBinary({
        path: `${DOCUMENT_DIR}/${name}`,
        base64,
        message: `Dépôt du certificat ${name}`,
      });
      onChange(`/documents/${name}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-[.8rem] font-bold text-ink">{field.label}</span>
      {value ? (
        <div className="flex flex-wrap items-center gap-3 rounded-[12px] border border-rule bg-paper p-3">
          <span aria-hidden="true" className="grid size-12 place-items-center rounded-lg bg-cream-2 font-bold text-coral-ink">
            PDF
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[.85rem] text-ink">{value}</p>
            <div className="mt-1 flex gap-3 text-[.8rem] font-semibold">
              <a href={value} target="_blank" rel="noreferrer" className="text-teal hover:underline">
                Ouvrir
              </a>
              <button type="button" onClick={() => onChange(null)} className="text-[#c0392b] hover:underline">
                Retirer du site
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[12px] border border-dashed border-rule bg-cream-2/50 p-5 text-center">
          <p className="mb-3 text-[.85rem] text-muted">Aucun certificat publié.</p>
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="rounded-full border-2 border-coral px-4 py-1.5 text-[.85rem] font-bold text-coral-ink disabled:opacity-50"
          >
            {busy ? 'Dépôt en cours…' : 'Choisir le certificat PDF'}
          </button>
        </div>
      )}
      <input
        ref={input}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
      {error && <p className="mt-2 text-[.8rem] font-semibold text-[#c0392b]">{error}</p>}
      <p className="mt-1.5 text-[.78rem] text-muted">
        PDF officiel, 8 Mo au maximum. Le document sera proposé sur l’accueil et la page Qualité.
      </p>
    </div>
  );
}
