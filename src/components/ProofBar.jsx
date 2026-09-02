import QualiopiBadge from './QualiopiBadge';
import Reveal from './Reveal';
import RichText from './RichText';

export default function ProofBar({ proof }) {
  return (
    <section className="proof">
      <div className="wrap">
        <Reveal className="proof-inner">
          <div className="proof-qualiopi">
            <QualiopiBadge label={proof.qualiopi.badge} />
            <RichText as="p" html={proof.qualiopi.textHtml} />
          </div>
          <div className="proof-stats">
            {proof.stats.map((s) => (
              <div className="s" key={s.label}>
                <RichText as="div" className="n" html={s.valueHtml} />
                <div className="t">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
