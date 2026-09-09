import { useState } from 'react';
import MediaSlot from './MediaSlot';

/**
 * Jeu de cartes du hero.
 *
 * Les cartes sont empilées l'une derrière l'autre comme un paquet de cartes à
 * jouer. Au survol — ou au focus clavier, ou en permanence sur écran tactile —
 * elles s'éventent sur le côté et découvrent le métier inscrit dans leur coin
 * supérieur droit. Cliquer une carte éventée la ramène devant.
 *
 * Comme partout ailleurs, le visuel de chaque carte est un emplacement piloté
 * par les données : une carte sans `src` reste un cadre vide, prêt à recevoir
 * sa photo depuis le back-office (voir MediaSlot.jsx).
 */
export default function CardDeck({ cards = [], label = 'Métiers de l’accueil' }) {
  const [active, setActive] = useState(0);
  if (!cards.length) return null;

  /* La pile ne garde pas la carte choisie : dès qu'on la quitte, elle se
     referme dans son ordre d'origine. Au doigt, en revanche, il n'y a pas de
     « sortie » — le choix reste, sans quoi l'image reviendrait en arrière. */
  const rest = () => setActive(0);

  return (
    <div
      className="card-deck"
      role="group"
      aria-label={label}
      onPointerLeave={(e) => e.pointerType !== 'touch' && rest()}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && rest()}
    >
      {cards.map((card, i) => {
        /* Rang dans la pile : 0 devant, les suivants éventés vers la droite.
           Le décalage tourne avec la carte choisie, sans réordonner le DOM. */
        const pos = (i - active + cards.length) % cards.length;

        return (
          <div className="deck-card" data-pos={pos} key={card.id ?? i}>
            <span className="deck-card-role">{card.role}</span>

            <div className="frame">
              <MediaSlot media={card.media} />
            </div>

            {/* Zone cliquable posée sur la carte : garde un balisage valide
                (le média n'a pas à vivre dans un <button>) et le focus visible. */}
            <button
              type="button"
              className="deck-card-hit"
              aria-label={card.role}
              aria-pressed={pos === 0}
              onClick={() => setActive(i)}
            />
          </div>
        );
      })}
    </div>
  );
}
