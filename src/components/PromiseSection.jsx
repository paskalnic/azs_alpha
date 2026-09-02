import Decor from './Decor';
import Reveal from './Reveal';
import RichText from './RichText';

export default function PromiseSection({ promise }) {
  return (
    <section className="sec promise">
      <Decor items={promise.decor} />
      <div className="wrap promise-grid">
        <Reveal>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>
            {promise.eyebrow}
          </span>
          <RichText as="blockquote" html={promise.quoteHtml} />
        </Reveal>
        <Reveal className="answer">
          {promise.paragraphsHtml.map((html, i) => (
            <RichText as="p" key={i} html={html} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
