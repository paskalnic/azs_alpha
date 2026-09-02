import { useReveal } from '../hooks/useReveal';

/** Enveloppe un bloc avec l'animation d'apparition au scroll. */
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`${className} reveal`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
