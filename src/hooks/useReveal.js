import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Révélation au scroll : équivalent React de l'IntersectionObserver du HTML.
 * Retourne une ref à poser sur l'élément portant la classe `reveal`.
 */
export function useReveal() {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      el.classList.add('in');
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  return ref;
}

export default useReveal;
