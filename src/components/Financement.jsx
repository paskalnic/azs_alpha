import Reveal from './Reveal';
import SectionHead from './SectionHead';

/**
 * Bloc financement — mise en forme en utilitaires Tailwind.
 * Les classes d'accent sont écrites en toutes lettres : le scanner Tailwind
 * lit le source, une classe construite dynamiquement ne serait pas générée.
 */
const ACCENT = {
  coral: 'border-t-coral',
  teal: 'border-t-teal',
  sun: 'border-t-sun',
};

export default function Financement({ financement }) {
  return (
    <section className="sec" id={financement.id}>
      <div className="wrap">
        <SectionHead
          eyebrow={financement.eyebrow}
          title={financement.title}
          description={financement.description}
        />
        <div className="grid gap-[1.3rem] foot:grid-cols-3">
          {financement.items.map((f) => (
            <Reveal
              key={f.id}
              className={`border-t-[3px] pt-[1.2rem] ${ACCENT[f.accent] ?? ACCENT.coral}`}
            >
              <h3 className="text-[1.15rem] mb-[.4rem]">{f.title}</h3>
              <p className="text-[.93rem] text-muted">{f.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
