import { Link } from 'react-router-dom';
import MediaSlot from './MediaSlot';

/**
 * Carte de formation cliquable, utilisée sur les pages catégorie et catalogue.
 * Reprend le style `.dom` de la page d'accueil, sans le carrousel 3D.
 */
export default function FormationCardLink({ formation: f, categoryModifier }) {
  return (
    <article className={`dom ${categoryModifier}`}>
      {/* Vignette optionnelle : aucun bloc n'est réservé tant qu'aucune
          vignette n'est définie, pour ne pas alourdir les grilles. */}
      {f.thumbnail && <MediaSlot media={f.thumbnail} className="mb-5 rounded-[18px]" />}
      <h3 className="mb-2">
        <Link to={f.path} className="after:absolute after:inset-0 after:content-['']">
          {f.shortTitle}
        </Link>
      </h3>
      <p>{f.summary}</p>
      <ul>
        <li>{f.duration.label}</li>
        {f.price && <li>{f.price.label}</li>}
        <li>{f.modes.join(' · ')}</li>
      </ul>
      <span className="more">Voir la fiche →</span>
    </article>
  );
}
