import QualiopiBadge from './QualiopiBadge';
import Reveal from './Reveal';
import RichText from './RichText';
import { SITE } from '../site.config';

export default function ProofBar({ proof }) {
  return (
    <section className="proof">
      <div className="wrap">
        <Reveal className="proof-inner">
          <div className="proof-qualiopi">
            <QualiopiBadge label={proof.qualiopi.badge} />
            <div>
              <RichText as="p" html={proof.qualiopi.textHtml} />
              {SITE.certification.document && (
                <a
                  href={SITE.certification.document}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-block text-[.78rem] font-bold text-coral-ink hover:underline"
                >
                  Voir le certificat officiel →
                </a>
              )}
            </div>
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
