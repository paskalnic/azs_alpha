import Button from './Button';
import Reveal from './Reveal';

export default function FinalCta({ finalCta }) {
  return (
    <section className="final" id={finalCta.id}>
      <div className="wrap">
        <Reveal className="final-card">
          {finalCta.decor?.map((d, i) => (
            <span key={i} className="deco" style={d.style} aria-hidden="true" />
          ))}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2>{finalCta.title}</h2>
            <p>{finalCta.text}</p>
            <div className="final-actions">
              {finalCta.actions.map((a) => (
                <Button key={a.label} {...a} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
