import { createContext, useContext, useEffect } from 'react';
import { buildHead, applyHead } from './head';

/**
 * Collecte les métadonnées au pré-rendu, les applique à la navigation client.
 * Au rendu serveur le contexte porte un « puits » que la page remplit ;
 * dans le navigateur il vaut null et l'effet met le document à jour.
 */
const HeadSink = createContext(null);

export function HeadProvider({ sink, children }) {
  return <HeadSink.Provider value={sink}>{children}</HeadSink.Provider>;
}

export function useHead(meta) {
  const sink = useContext(HeadSink);
  const head = buildHead(meta);

  // rendu serveur : on dépose le résultat pour le script de pré-rendu
  if (sink) sink.head = head;

  const key = JSON.stringify(head);
  useEffect(() => {
    applyHead(JSON.parse(key));
  }, [key]);
}

export default HeadProvider;
