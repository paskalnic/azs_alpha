import Reveal from './Reveal';

/** En-tête de section : eyebrow + titre + chapô optionnel. */
export default function SectionHead({ eyebrow, title, description, reveal = true }) {
  const head = (
    <>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </>
  );

  return reveal ? (
    <Reveal className="sec-head">{head}</Reveal>
  ) : (
    <div className="sec-head">{head}</div>
  );
}
