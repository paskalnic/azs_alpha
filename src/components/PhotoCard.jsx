import { useState } from 'react';

/** Carte photo flottante du hero, avec repli visuel si l'image ne charge pas. */
export default function PhotoCard({ photo, caption, chips = [] }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="photo-card">
      {chips
        .filter((c) => c.position === 'tl')
        .map((c, i) => (
          <Chip key={`tl-${i}`} {...c} />
        ))}

      <div className={`frame${failed ? ' noimg' : ''}`}>
        {!failed && (
          <img
            src={photo.src}
            alt={photo.alt}
            loading="eager"
            width={photo.width}
            height={photo.height}
            onError={() => setFailed(true)}
          />
        )}
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
