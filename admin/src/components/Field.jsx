import MediaField from './MediaField';
import DocumentField from './DocumentField';

/**
 * Rendu récursif d'un champ, d'après sa déclaration au schéma.
 * Les types composés (objet, liste) se rendent en s'appelant eux-mêmes.
 */
export default function Field({ field, value, onChange, client, idPath = field.name }) {
  const set = (v) => onChange(v);
  const id = `champ-${idPath.replace(/[^a-z0-9_-]/gi, '-')}`;

  const label = (
    <label htmlFor={id} className="mb-1.5 block text-[.8rem] font-bold text-ink">
      {field.label}
      {field.optional && <span className="ml-2 font-normal text-muted">facultatif</span>}
    </label>
  );
  const help = field.help && <p className="mt-1.5 text-[.78rem] text-muted">{field.help}</p>;

  const input =
    'w-full rounded-[12px] border border-rule bg-paper px-3 py-2 text-[.92rem] text-ink ' +
    'focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/25 disabled:bg-cream-2 disabled:text-muted';

  switch (field.type) {
    case 'textarea':
    case 'markdown': {
      const length = (value ?? '').length;
      const over = field.max && length > field.max;
      return (
        <div>
          {label}
          <textarea
            id={id}
            className={`${input} ${field.type === 'markdown' ? 'font-mono text-[.85rem] leading-relaxed' : ''}`}
            rows={field.type === 'markdown' ? 26 : (field.rows ?? 3)}
            value={value ?? ''}
            onChange={(e) => set(e.target.value)}
          />
          {field.max && (
            <p className={`mt-1.5 text-[.78rem] ${over ? 'font-semibold text-[#c0392b]' : 'text-muted'}`}>
              {length} / {field.max} caractères{over ? ' — au-delà, le texte sera tronqué dans les résultats de recherche' : ''}
            </p>
          )}
          {help}
        </div>
      );
    }

    case 'number':
      return (
        <div>
          {label}
          <input
            id={id}
            type="number"
            className={input}
            value={value ?? ''}
            onChange={(e) => set(e.target.value === '' ? null : Number(e.target.value))}
          />
          {help}
        </div>
      );

    case 'toggle':
      return (
        <div className="rounded-[14px] border border-rule bg-paper p-4">
          <label htmlFor={id} className="flex items-center gap-3 text-[.9rem] font-bold text-ink">
            <input
              id={id}
              type="checkbox"
              className="size-[1.1rem] accent-coral"
              checked={Boolean(value)}
              onChange={(e) => set(e.target.checked)}
            />
            {field.label}
          </label>
          {help}
        </div>
      );

    case 'select':
      return (
        <div>
          {label}
          <select id={id} className={input} value={value ?? ''} onChange={(e) => set(e.target.value)}>
            {field.options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          {help}
        </div>
      );

    case 'media':
      return <MediaField field={field} value={value} onChange={set} client={client} />;

    case 'document':
      return <DocumentField field={field} value={value} onChange={set} client={client} />;

    case 'object': {
      const empty = field.nullable && (value === null || value === undefined);
      return (
        <fieldset className="rounded-[16px] border border-rule bg-cream-2/40 p-4">
          <legend className="px-2 text-[.8rem] font-bold text-ink">{field.label}</legend>
          {field.nullable && (
            <label className="mb-3 flex items-center gap-2 text-[.82rem] text-muted">
              <input
                type="checkbox"
                checked={!empty}
                onChange={(e) =>
                  set(e.target.checked ? Object.fromEntries(field.fields.map((f) => [f.name, null])) : null)
                }
              />
              Renseigner ce bloc
            </label>
          )}
          {!empty && (
            <div className="flex flex-col gap-4">
              {field.fields.map((sub) => (
                <Field
                  key={sub.name}
                  field={sub}
                  value={value?.[sub.name]}
                  onChange={(v) => set({
                    ...(value ?? {}),
                    [sub.name]: v,
                    ...(sub.type === 'media' && v
                      ? { kind: /\.(mp4|webm)$/i.test(v) ? 'video' : 'image' }
                      : {}),
                  })}
                  client={client}
                  idPath={`${idPath}-${sub.name}`}
                />
              ))}
            </div>
          )}
          {help}
        </fieldset>
      );
    }

    case 'list': {
      const items = Array.isArray(value) ? value : [];
      const replace = (i, v) => set(items.map((item, j) => (j === i ? v : item)));
      const remove = (i) => set(items.filter((_, j) => j !== i));
      const move = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const next = [...items];
        [next[i], next[j]] = [next[j], next[i]];
        set(next);
      };
      const blank = field.of.type === 'object'
        ? Object.fromEntries(field.of.fields.map((f) => [f.name, f.type === 'list' ? [] : '']))
        : '';

      return (
        <div>
          {label}
          <ul className="flex flex-col gap-2">
            {items.map((item, i) => (
              <li key={i} className="rounded-[12px] border border-rule bg-paper p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[.75rem] font-semibold uppercase tracking-wider text-muted">
                    {field.of.type === 'object' && field.of.titleField
                      ? item?.[field.of.titleField] || `Élément ${i + 1}`
                      : `Élément ${i + 1}`}
                  </span>
                  <span className="flex gap-1">
                    <Small onClick={() => move(i, -1)} disabled={i === 0} label="Monter">↑</Small>
                    <Small onClick={() => move(i, 1)} disabled={i === items.length - 1} label="Descendre">↓</Small>
                    <Small onClick={() => remove(i)} label="Supprimer" danger>✕</Small>
                  </span>
                </div>
                {field.of.type === 'object' ? (
                  <div className="flex flex-col gap-3">
                    {field.of.fields.map((sub) => (
                      <Field
                        key={sub.name}
                        field={sub}
                        value={item?.[sub.name]}
                        onChange={(v) => replace(i, { ...(item ?? {}), [sub.name]: v })}
                        client={client}
                        idPath={`${idPath}-${i}-${sub.name}`}
                      />
                    ))}
                  </div>
                ) : (
                  <input
                    className={input}
                    value={item ?? ''}
                    onChange={(e) => replace(i, e.target.value)}
                    aria-label={`${field.label} — élément ${i + 1}`}
                  />
                )}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => set([...items, blank])}
            className="mt-2 rounded-full border-2 border-coral px-4 py-1.5 text-[.85rem] font-bold text-coral-ink hover:border-teal hover:text-teal"
          >
            + Ajouter
          </button>
          {help}
        </div>
      );
    }

    default:
      return (
        <div>
          {label}
          <input
            id={id}
            className={input}
            value={value ?? ''}
            readOnly={field.readOnly}
            disabled={field.readOnly}
            onChange={(e) => set(e.target.value)}
          />
          {help}
        </div>
      );
  }
}

function Small({ onClick, disabled, label, danger, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`grid size-7 place-items-center rounded-md border border-rule text-[.8rem] disabled:opacity-30 ${
        danger ? 'text-[#c0392b] hover:border-[#c0392b]' : 'text-muted hover:border-teal hover:text-teal'
      }`}
    >
      {children}
    </button>
  );
}
