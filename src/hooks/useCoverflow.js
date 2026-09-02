import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Coverflow 3D — port React du script de la maquette.
 * Amélioration progressive : sans JS ou en `prefers-reduced-motion`,
 * la grille CSS de base reste affichée (la classe `is-cf` n'est jamais posée).
 *
 * Les transformations sont appliquées en impératif sur les nœuds DOM
 * (comme dans l'original) pour éviter un re-render à chaque frame de drag.
 */
export function useCoverflow(count, titles = []) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);

  const posRef = useRef(0);       // position courante (fractionnaire pendant le drag)
  const stepRef = useRef(220);    // décalage horizontal px par carte
  const dragRef = useRef({ dragging: false, startX: 0, startPos: 0, moved: false });

  const [active, setActive] = useState(0);
  const [liveMessage, setLiveMessage] = useState('');

  const reducedMotion = usePrefersReducedMotion();
  const enabled = !reducedMotion && count > 1;

  const setCardRef = useCallback((i) => (node) => {
    cardsRef.current[i] = node;
  }, []);

  /** décalage signé le plus court (gère la boucle) */
  const offsetOf = useCallback(
    (i, pos) => {
      let d = i - pos;
      d = ((d % count) + count) % count;
      if (d > count / 2) d -= count;
      return d;
    },
    [count],
  );

  const measure = useCallback(() => {
    const stage = stageRef.current;
    const cards = cardsRef.current.filter(Boolean);
    if (!stage || !cards.length) return;

    const vpW = stage.clientWidth || 600;
    const cardW = cards[0].offsetWidth || 320;
    stepRef.current = Math.min(cardW * 0.6, vpW * 0.34);

    const maxH = cards.reduce((h, c) => Math.max(h, c.offsetHeight), 0);
    if (maxH) stage.style.setProperty('--cf-h', `${maxH}px`);
  }, []);

  const render = useCallback(() => {
    const pos = posRef.current;
    const step = stepRef.current;

    cardsRef.current.forEach((c, i) => {
      if (!c) return;
      const off = offsetOf(i, pos);
      const a = Math.abs(off);
      const tx = off * step;
      const rot = Math.max(-52, Math.min(52, -off * 34));
      const tz = -a * 150;
      const sc = 1 - Math.min(a, 2) * 0.12;
      const op = a > 1.6 ? 0 : 1 - Math.min(a, 1) * 0.5;

      c.style.transform =
        `translate(-50%,0) translateX(${tx}px) translateZ(${tz}px) rotateY(${rot}deg) scale(${sc})`;
      c.style.opacity = String(op);
      c.style.zIndex = String(100 - Math.round(a * 10));
    });

    setActive(((Math.round(pos) % count) + count) % count);
  }, [count, offsetOf]);

  const snapTo = useCallback(
    (pos, announce) => {
      const next = ((Math.round(pos) % count) + count) % count;
      posRef.current = next;
      render();
      if (announce) {
        setLiveMessage(`Formation ${next + 1} sur ${count} : ${titles[next] ?? ''}`);
      }
    },
    [count, render, titles],
  );

  const go = useCallback((dir) => snapTo(posRef.current + dir, true), [snapTo]);

  /* — activation + mesure initiale + resize + chargement des polices — */
  useEffect(() => {
    if (!enabled) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    root.classList.add('is-cf');
    measure();
    render();

    let rt;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        measure();
        render();
      }, 120);
    };
    const onLoad = () => {
      measure();
      render();
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('load', onLoad);
    if (document.fonts?.ready) document.fonts.ready.then(onLoad);

    return () => {
      clearTimeout(rt);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onLoad);
      root.classList.remove('is-cf');
      cardsRef.current.forEach((c) => {
        if (!c) return;
        c.style.transform = '';
        c.style.opacity = '';
        c.style.zIndex = '';
      });
    };
  }, [enabled, measure, render]);

  /* — clavier — */
  const onKeyDown = useCallback(
    (e) => {
      if (!enabled) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
    },
    [enabled, go],
  );

  /* — drag (souris + tactile) via Pointer Events — */
  const onPointerDown = useCallback(
    (e) => {
      if (!enabled) return;
      if (e.button != null && e.button !== 0) return;
      dragRef.current = { dragging: true, startX: e.clientX, startPos: posRef.current, moved: false };
      rootRef.current?.classList.add('dragging');
      try {
        stageRef.current?.setPointerCapture(e.pointerId);
      } catch (_) { /* ignore */ }
    },
    [enabled],
  );

  const onPointerMove = useCallback(
    (e) => {
      const d = dragRef.current;
      if (!d.dragging) return;
      const dx = e.clientX - d.startX;
      if (Math.abs(dx) > 4) d.moved = true;
      posRef.current = d.startPos - dx / stepRef.current;
      render();
    },
    [render],
  );

  const endDrag = useCallback(() => {
    const d = dragRef.current;
    if (!d.dragging) return;
    d.dragging = false;
    rootRef.current?.classList.remove('dragging');
    snapTo(posRef.current, d.moved);
    // réarme le garde-clic juste après (laisse passer le clic annulé)
    setTimeout(() => {
      d.moved = false;
    }, 0);
  }, [snapTo]);

  /** clic sur une carte latérale = la ramener au centre */
  const onCardClick = useCallback(
    (i) => (e) => {
      if (!enabled) return;
      if (dragRef.current.moved) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (i !== active) {
        e.preventDefault();
        snapTo(i, true);
      }
      // carte active : on laisse le lien `.more` fonctionner normalement
    },
    [enabled, active, snapTo],
  );

  return {
    rootRef,
    active,
    enabled,
    liveMessage,
    go,
    snapTo,
    setCardRef,
    onCardClick,
    stageProps: {
      ref: stageRef,
      tabIndex: 0,
      onKeyDown,
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onPointerLeave: endDrag,
    },
  };
}

export default useCoverflow;
