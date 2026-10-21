import { useRef, useState } from 'react';

/** Taille au-delà de laquelle le dépôt via l'API GitHub devient hasardeux. */
const MAX_BYTES = 4 * 1024 * 1024;
const MEDIA_DIR = 'public/media';
const ACCEPTED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
]);

const slugify = (name) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * Dépôt d'une image ou d'un GIF.
 *
 * Le fichier est versionné avec le contenu, dans `public/media/`, et servi
 * tel quel depuis /media/ : aucune conversion n'est faite à la volée. D'où la
 * limite de 4 Mo, et l'invitation à compresser l'image avant de la déposer.
 *
 * (Une version antérieure de ce commentaire parlait d'un redimensionnement
 * par l'Image CDN de Netlify. Aucun code ne l'a jamais appelé.)
 */
export default function MediaField({ field, value, onChange, client }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const video = /\.(mp4|webm)$/i.test(value || '');

  const upload = async (file) => {
    setError(null);
    if (!ACCEPTED_TYPES.has(file.type)) {
      setError('Format non accepté. Utilisez JPG, PNG, WebP, GIF, MP4 ou WebM.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(
        `Ce fichier fait ${(file.size / 1024 / 1024).toFixed(1)} Mo. Au-delà de 4 Mo, le dépôt échoue : compressez l'image avant de la déposer.`,
      );
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
      const path = `${MEDIA_DIR}/${name}`;
      await client.writeBinary({ path, base64, message: `Dépôt du média ${name}` });
      onChange(`/media/${name}`);
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
        <div className="flex items-center gap-4 rounded-[12px] border border-rule bg-paper p-3">
          {video ? (
            <video src={value} className="size-20 rounded-lg object-cover" muted playsInline />
          ) : (
            <img src={value} alt="" className="size-20 rounded-lg object-cover" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[.85rem] text-ink">{value}</p>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="mt-1 text-[.8rem] font-semibold text-[#c0392b] hover:underline"
            >
              Retirer
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-[12px] border border-dashed border-rule bg-cream-2/50 p-5 text-center">
          <p className="mb-3 text-[.85rem] text-muted">Aucun fichier. La zone reste vide sur le site.</p>
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="rounded-full border-2 border-coral px-4 py-1.5 text-[.85rem] font-bold text-coral-ink disabled:opacity-50"
          >
            {busy ? 'Dépôt en cours…' : 'Choisir un fichier'}
          </button>
        </div>
      )}

      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
        hidden
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
      {error && <p className="mt-2 text-[.8rem] font-semibold text-[#c0392b]">{error}</p>}
      <p className="mt-1.5 text-[.78rem] text-muted">
        Images, GIF ou vidéos courtes, 4 Mo au maximum. Le fichier est déposé immédiatement ; la fiche
        n'est enregistrée qu'au clic sur « Enregistrer ».
      </p>
    </div>
  );
}
