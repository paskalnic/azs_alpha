/**
 * Rend un fragment de texte pouvant contenir un balisage inline simple
 * (<b>, <em>, <br>) fourni par l'objet `data`.
 * Le contenu vient de nos données statiques, jamais d'une saisie utilisateur.
 */
export default function RichText({ as: Tag = 'span', html, ...rest }) {
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: html }} />;
}
