import Decor from './Decor';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

export default function WhyBento({ why }) {
  const { feature } = why;

  return (
    <section className="sec why" id={why.id}>
      <Decor items={why.decor} />
      <div className="wrap">
        <SectionHead eyebrow={why.eyebrow} title={why.title} />

        <div className="bento">
          <Reveal className="tile feat">
            <div>
              <div className="ic" aria-hidden="true">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
            <div className="who">
              <span className="av" aria-hidden="true">
                {feature.person.initial}
              </span>
              <span>
                <b>{feature.person.name}</b>
                <span>{feature.person.role}</span>
              </span>
            </div>
          </Reveal>

          {why.tiles.map((t) => (
            <Reveal className={`tile ${t.id}`} key={t.id}>
              <div className="ic" aria-hidden="true">
                {t.icon}
              </div>
              <h3>{t.title}</h3>
              <p>{t.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
