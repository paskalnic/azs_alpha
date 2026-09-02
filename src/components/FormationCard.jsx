import { forwardRef } from 'react';

/** Carte "domaine de formation". La ref est requise par le coverflow. */
const FormationCard = forwardRef(function FormationCard(
  { formation, index, isActive, coverflowEnabled, onClick },
  ref,
) {
  return (
    <article
      ref={ref}
      className={`dom ${formation.modifier}${coverflowEnabled && isActive ? ' is-active' : ''}`}
      data-i={index}
      onClick={onClick}
      aria-hidden={coverflowEnabled ? String(!isActive) : undefined}
    >
      <div className="tag" aria-hidden="true">
        {formation.icon}
      </div>
      <h3>{formation.title}</h3>
      <p>{formation.description}</p>
      <ul>
        {formation.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <a
        href={formation.cta.href}
        className="more"
        tabIndex={coverflowEnabled && !isActive ? -1 : 0}
      >
        {formation.cta.label}
      </a>
    </article>
  );
});

export default FormationCard;
