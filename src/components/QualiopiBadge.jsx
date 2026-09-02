/** Pastille Qualiopi (bande preuve + pied de page). */
export default function QualiopiBadge({ label = 'Qualiopi' }) {
  return (
    <div className="q-badge" aria-hidden="true">
      {label}
    </div>
  );
}
