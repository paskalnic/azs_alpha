import Reveal from './Reveal';

export default function Testimonial({ testimonial }) {
  return (
    <section className="sec testi">
      <div className="wrap">
        <Reveal className="testi-card">
          <span className="deco" aria-hidden="true" />
          <span className="mark" aria-hidden="true">
            “
          </span>
          <blockquote>{testimonial.quote}</blockquote>
          <cite>
            <span className="av" aria-hidden="true">
              {testimonial.author.initial}
            </span>
            <span>
              <b>{testimonial.author.name}</b>
              <span>{testimonial.author.role}</span>
            </span>
          </cite>
        </Reveal>
      </div>
    </section>
  );
}
