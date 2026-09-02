import { useMemo } from 'react';
import FormationCard from './FormationCard';
import SectionHead from './SectionHead';
import { useCoverflow } from '../hooks/useCoverflow';

/**
 * Section formations : grille de base (SEO / sans JS / reduced-motion),
 * enrichie en carrousel coverflow 3D quand c'est possible.
 */
export default function Formations({ formations }) {
  const titles = useMemo(() => formations.items.map((f) => f.title), [formations.items]);
  const cf = useCoverflow(formations.items.length, titles);

  return (
    <section className="sec" id={formations.id}>
      <div className="wrap">
        <SectionHead
          eyebrow={formations.eyebrow}
          title={formations.title}
          description={formations.description}
        />

        <div className="cf" ref={cf.rootRef}>
          <div
            className="dom-grid"
            role="group"
            aria-roledescription="carrousel"
            aria-label={formations.carouselLabel}
            {...cf.stageProps}
          >
            {formations.items.map((f, i) => (
              <FormationCard
                key={f.id}
                ref={cf.setCardRef(i)}
                formation={f}
                index={i}
                isActive={cf.active === i}
                coverflowEnabled={cf.enabled}
                onClick={cf.onCardClick(i)}
              />
            ))}
          </div>

          <div className="cf-ctrl">
            <button
              type="button"
              className="cf-arrow cf-prev"
              aria-label={formations.controls.prev}
              onClick={() => cf.go(-1)}
            >
              ‹
            </button>
            <div className="cf-dots" role="group" aria-label={formations.controls.dots}>
              {formations.items.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  className={`cf-dot${cf.active === i ? ' on' : ''}`}
                  aria-label={f.title}
                  onClick={() => cf.snapTo(i, true)}
                />
              ))}
            </div>
            <button
              type="button"
              className="cf-arrow cf-next"
              aria-label={formations.controls.next}
              onClick={() => cf.go(1)}
            >
              ›
            </button>
          </div>

          <p className="cf-hint" aria-hidden="true">
            {formations.hint}
          </p>
          <span className="sr-only" aria-live="polite">
            {cf.liveMessage}
          </span>
        </div>
      </div>
    </section>
  );
}
