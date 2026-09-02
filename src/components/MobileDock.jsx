import Button from './Button';

/** Barre d'actions fixe en bas d'écran, masquée au-delà du point de rupture `nav` (860px). */
export default function MobileDock({ dock }) {
  return (
    <div
      role="navigation"
      aria-label={dock.ariaLabel}
      className="fixed inset-x-0 bottom-0 z-[60] grid grid-cols-2 gap-[.6rem]
                 border-t border-rule bg-cream/92 backdrop-blur-[10px]
                 px-[clamp(1rem,4vw,1.25rem)] pt-[.6rem]
                 pb-[max(.6rem,env(safe-area-inset-bottom))] nav:hidden"
    >
      {dock.actions.map((a) => (
        <Button key={a.label} {...a} className="min-h-12 justify-center px-4 text-[.92rem]" />
      ))}
    </div>
  );
}
