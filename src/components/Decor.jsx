/**
 * Décor organique : blobs SVG et anneaux, entièrement pilotés par les données
 * (`{ type, fill, opacity, path, style }`).
 */
export default function Decor({ items = [] }) {
  return items.map((d, i) => {
    if (d.type === 'ring') {
      return <span key={i} className="deco-ring" style={d.style} aria-hidden="true" />;
    }
    return (
      <svg key={i} className="blob" style={d.style} viewBox="0 0 200 200" aria-hidden="true">
        <path fill={d.fill} opacity={d.opacity} d={d.path} transform="translate(100 100)" />
      </svg>
    );
  });
}
