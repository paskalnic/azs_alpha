/**
 * Bandeau des informations clés d'une formation (durée, tarif, effectif, modalités).
 * Les entrées vides sont retirées : une fiche sans effectif défini n'affiche pas
 * de ligne vide.
 */
export default function FactList({ facts }) {
  const rows = facts.filter((f) => f && f.value);
  if (!rows.length) return null;

  return (
    <dl className="grid gap-x-8 gap-y-5 rounded-[var(--radius)] border border-rule bg-paper p-6 sm:grid-cols-2 lg:grid-cols-4">
      {rows.map((f) => (
        <div key={f.label}>
          <dt className="mb-1 text-[.72rem] font-bold uppercase tracking-[.13em] text-coral-ink">
            {f.label}
          </dt>
          <dd className="font-display text-[1.05rem] font-semibold leading-snug text-ink">
            {f.value}
          </dd>
          {f.note && <dd className="mt-1 text-[.82rem] text-muted">{f.note}</dd>}
        </div>
      ))}
    </dl>
  );
}
