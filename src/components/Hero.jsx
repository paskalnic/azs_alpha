import Button from './Button';
import Decor from './Decor';
import PhotoCard from './PhotoCard';
import Reveal from './Reveal';

/**
 * Hero. `disposition` :
 *  - 'split'       → deux colonnes (texte + carte photo), la maquette d'origine
 *  - 'full-screen' → une colonne centrée, pleine hauteur, sans visuel
 */
export default function Hero({ hero, disposition = 'split' }) {
  const showVisual = disposition !== 'full-screen';

  return (
    <section className={`hero hero--${disposition}`}>
      <Decor items={hero.decor} />

      <div className="wrap hero-grid">
        <Reveal className="hero-copy">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>
            {hero.title.map((part, i) =>
              part.highlight ? (
                <span className="u" key={i}>
                  {part.text}
                </span>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </h1>
          <p className="lead">{hero.lead}</p>
          <div className="hero-actions">
            {hero.actions.map((a) => (
              <Button key={a.label} {...a} />
            ))}
          </div>
        </Reveal>

        {showVisual && (
          <Reveal className="hero-visual">
            <PhotoCard media={hero.media} caption={hero.caption} chips={hero.chips} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
