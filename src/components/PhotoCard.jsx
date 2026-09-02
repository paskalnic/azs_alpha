import MediaSlot from './MediaSlot';

/** Carte photo flottante du hero. Le visuel est un emplacement piloté par les données. */
export default function PhotoCard({ media, caption, chips = [] }) {
  return (
    <div className="photo-card">
      {chips
        .filter((c) => c.position === 'tl')
        .map((c, i) => (
          <Chip key={`tl-${i}`} {...c} />
        ))}

      <div className="frame">
        <MediaSlot media={media} />
      </div>

      <div className="caption">
        <b>{caption.name}</b>
        <span>{caption.role}</span>
      </div>

      {chips
        .filter((c) => c.position === 'br')
        .map((c, i) => (
          <Chip key={`br-${i}`} {...c} />
        ))}
    </div>
  );
}

function Chip({ position, num, label }) {
  return (
    <div className={`chip ${position}`}>
      <span className="num">{num}</span>
      <span className="lbl">{label}</span>
    </div>
  );
}
