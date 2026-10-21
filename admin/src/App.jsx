import { useCallback, useEffect, useState } from 'react';
import { COLLECTIONS } from './schema';
import { createClient } from './github';
import { getToken, clearToken, login } from './auth';
import { parse, serialize, merge } from './format';
import Field from './components/Field';

const REPO = {
  owner: import.meta.env.VITE_GITHUB_OWNER?.trim(),
  repo: import.meta.env.VITE_GITHUB_REPO?.trim(),
  branch: import.meta.env.VITE_GITHUB_BRANCH || 'main',
};

export default function App() {
  if (!REPO.owner || !REPO.repo) return <ConfigurationError />;
  return <ConfiguredApp />;
}

function ConfiguredApp() {
  const [token, setToken] = useState(getToken);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const client = token ? createClient({ token, ...REPO }) : null;

  useEffect(() => {
    if (!client) return;
    client.me().then(setUser).catch((e) => {
      setError(e.message);
      clearToken();
      setToken(null);
    });
  }, [token]);

  const disconnect = () => {
    clearToken();
    setToken(null);
    setUser(null);
  };

  if (!token) return <Login onToken={setToken} error={error} setError={setError} />;

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-rule bg-cream/90 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="size-7 rounded-[50%_50%_50%_12px] bg-gradient-to-br from-coral to-sun" />
          <div>
            <p className="font-display text-[1.02rem] font-bold leading-tight">Contenus du site</p>
            <p className="text-[.72rem] uppercase tracking-[.08em] text-muted">
              {REPO.owner}/{REPO.repo} · {REPO.branch}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[.85rem]">
          {user && <span className="text-muted">Connectée en tant que <b className="text-ink">{user.login}</b></span>}
          <button onClick={disconnect} className="font-semibold text-teal hover:underline">Se déconnecter</button>
        </div>
      </header>
      <Workspace client={client} />
    </div>
  );
}

function ConfigurationError() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-6">
      <div className="w-full max-w-[34rem] rounded-[26px] border border-[#e0b4ae] bg-paper p-9">
        <h1 className="mb-3 font-display text-[1.5rem] font-bold">Back-office non configuré</h1>
        <p className="text-[.9rem] text-muted">
          Les variables <code>VITE_GITHUB_OWNER</code> et <code>VITE_GITHUB_REPO</code> doivent être
          définies dans le projet Cloudflare Pages, puis le site doit être redéployé.
        </p>
      </div>
    </main>
  );
}

function Login({ onToken, error, setError }) {
  const [busy, setBusy] = useState(false);
  const start = async () => {
    setBusy(true);
    setError(null);
    try {
      onToken(await login());
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-6">
      <div className="w-full max-w-[26rem] rounded-[26px] border border-rule bg-paper p-9 text-center shadow-[0_24px_60px_-28px_rgba(18,62,92,.38)]">
        <span className="mx-auto mb-5 block size-11 rounded-[50%_50%_50%_12px] bg-gradient-to-br from-coral to-sun" />
        <h1 className="mb-2 font-display text-[1.5rem] font-bold">Contenus du site</h1>
        <p className="mb-7 text-[.9rem] text-muted">
          Connectez-vous avec votre compte GitHub pour modifier les textes, les tarifs et les images.
        </p>
        <button
          onClick={start}
          disabled={busy}
          className="w-full rounded-full border-2 border-teal-deep bg-gradient-to-br from-coral to-sun px-6 py-3 font-bold text-white disabled:opacity-60"
        >
          {busy ? 'Connexion…' : 'Se connecter avec GitHub'}
        </button>
        {error && <p className="mt-4 text-[.85rem] font-semibold text-[#c0392b]">{error}</p>}
      </div>
    </main>
  );
}

function Workspace({ client }) {
  const [collectionId, setCollectionId] = useState(COLLECTIONS[0].id);
  const [entryPath, setEntryPath] = useState(null);
  const [dirty, setDirty] = useState(false);
  const collection = COLLECTIONS.find((c) => c.id === collectionId);

  const canLeave = () =>
    !dirty || window.confirm('Des modifications ne sont pas enregistrées. Voulez-vous vraiment les abandonner ?');

  const selectCollection = (id) => {
    if (id === collectionId || !canLeave()) return;
    setDirty(false);
    setCollectionId(id);
  };

  useEffect(() => {
    setEntryPath(collection.type === 'file' ? collection.path : null);
  }, [collectionId]);

  return (
    <div className="mx-auto grid max-w-[80rem] gap-8 px-6 py-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
      <nav aria-label="Sections" className="lg:sticky lg:top-24">
        <ul className="flex flex-wrap gap-1 lg:flex-col">
          {COLLECTIONS.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => selectCollection(c.id)}
                aria-current={c.id === collectionId ? 'true' : undefined}
                className={`w-full rounded-[12px] px-3 py-2 text-left text-[.92rem] font-semibold ${
                  c.id === collectionId ? 'bg-teal text-white' : 'text-muted hover:bg-cream-2 hover:text-ink'
                }`}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section>
        {collection.description && (
          <p className="mb-6 rounded-[14px] border border-rule bg-paper p-4 text-[.86rem] text-muted">
            {collection.description}
          </p>
        )}
        {collection.type === 'folder' && !entryPath ? (
          <EntryList client={client} collection={collection} onOpen={setEntryPath} />
        ) : (
          <Editor
            client={client}
            collection={collection}
            path={entryPath}
            onBack={collection.type === 'folder' ? () => {
              if (canLeave()) {
                setDirty(false);
                setEntryPath(null);
              }
            } : null}
            onDirtyChange={setDirty}
          />
        )}
      </section>
    </div>
  );
}

function EntryList({ client, collection, onOpen }) {
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    client
      .list(collection.path)
      .then(async (files) => {
        const readable = files.filter((f) => f.type === 'file');
        const withTitles = await Promise.all(
          readable.map(async (f) => {
            const file = await client.read(f.path);
            const data = parse(file.text, collection.format);
            return { path: f.path, name: f.name, title: data[collection.titleField] || f.name, order: data.order ?? 0 };
          }),
        );
        if (!cancelled) setEntries(withTitles.sort((a, b) => a.order - b.order));
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => { cancelled = true; };
  }, [collection.path]);

  if (error) return <Message tone="error">{error}</Message>;
  if (!entries) return <Message>Chargement…</Message>;

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {entries.map((e) => (
        <li key={e.path}>
          <button
            onClick={() => onOpen(e.path)}
            className="w-full rounded-[14px] border border-rule bg-paper p-4 text-left transition-colors hover:border-coral"
          >
            <span className="block font-display font-semibold text-ink">{e.title}</span>
            <span className="mt-1 block text-[.78rem] text-muted">{e.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function Editor({ client, collection, path, onBack, onDirtyChange }) {
  const [state, setState] = useState({ status: 'loading' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const file = await client.read(path);
      if (!file) throw new Error('Fichier introuvable.');
      setState({ status: 'ready', data: parse(file.text, collection.format), sha: file.sha, original: parse(file.text, collection.format) });
    } catch (e) {
      setState({ status: 'error', message: e.message });
    }
  }, [path, collection.format]);

  useEffect(() => { load(); }, [load]);

  const dirty = state.status === 'ready' && JSON.stringify(state.data) !== JSON.stringify(state.original);

  useEffect(() => {
    onDirtyChange?.(dirty);
    return () => onDirtyChange?.(false);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (state.status === 'loading') return <Message>Chargement…</Message>;
  if (state.status === 'error') return <Message tone="error">{state.message}</Message>;

  const update = (name, value) =>
    setState((s) => ({ ...s, data: { ...s.data, [name]: value } }));

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(null);
    try {
      const merged = merge(state.original, state.data);
      const result = await client.write({
        path,
        text: serialize(merged, collection.format),
        sha: state.sha,
        message: `Contenu : ${state.data[collection.titleField] || collection.label}`,
      });
      setState((s) => ({ ...s, sha: result.content.sha, original: merged }));
      setSaved(result.commit?.html_url ?? true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {onBack && (
        <button onClick={onBack} className="mb-5 text-[.86rem] font-semibold text-teal hover:underline">
          ← Toutes les {collection.label.toLowerCase()}
        </button>
      )}

      <form onSubmit={(e) => { e.preventDefault(); save(); }} className="flex flex-col gap-5">
        {collection.fields.map((field) => (
          <Field
            key={field.name}
            field={field}
            value={state.data[field.name]}
            onChange={(v) => update(field.name, v)}
            client={client}
          />
        ))}

        <div className="sticky bottom-0 -mx-2 flex flex-wrap items-center gap-4 border-t border-rule bg-cream/95 px-2 py-4 backdrop-blur">
          <button
            type="submit"
            disabled={saving || !dirty}
            className="rounded-full border-2 border-teal-deep bg-gradient-to-br from-coral to-sun px-6 py-2.5 font-bold text-white disabled:opacity-60"
          >
            {saving ? 'Enregistrement…' : dirty ? 'Enregistrer' : 'Enregistré'}
          </button>
          {saved && (
            <p className="text-[.85rem] text-muted">
              Enregistré. Le site se reconstruit, comptez une à deux minutes.
              {typeof saved === 'string' && (
                <>{' '}<a href={saved} target="_blank" rel="noreferrer" className="font-semibold text-teal hover:underline">Voir la modification</a></>
              )}
            </p>
          )}
          {error && <p className="text-[.85rem] font-semibold text-[#c0392b]">{error}</p>}
        </div>
      </form>
    </div>
  );
}

function Message({ children, tone }) {
  return (
    <p className={`rounded-[14px] border p-4 text-[.9rem] ${
      tone === 'error' ? 'border-[#e0b4ae] bg-[#fdf3f2] font-semibold text-[#c0392b]' : 'border-rule bg-paper text-muted'
    }`}>
      {children}
    </p>
  );
}
