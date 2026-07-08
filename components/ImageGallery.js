import { useCallback, useEffect, useState } from 'react';
import { PLACEHOLDER_IMG } from '@/lib/format';

function onImgError(e) {
  if (e.currentTarget.src.endsWith(PLACEHOLDER_IMG)) return;
  e.currentTarget.src = PLACEHOLDER_IMG;
}

export default function ImageGallery({ images = [], title = 'Property' }) {
  const pics = images.length ? images : [PLACEHOLDER_IMG];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = useCallback(
    () => setActive((i) => (i - 1 + pics.length) % pics.length),
    [pics.length]
  );
  const next = useCallback(
    () => setActive((i) => (i + 1) % pics.length),
    [pics.length]
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, prev, next]);

  return (
    <div>
      <img
        src={pics[active]}
        alt={`${title} — photo ${active + 1}`}
        className="gallery-main shadow-sm"
        onClick={() => setLightbox(true)}
        onError={onImgError}
      />
      {pics.length > 1 && (
        <div className="row g-2 mt-1">
          {pics.map((src, i) => (
            <div className="col-3 col-md-2" key={i}>
              <img
                src={src}
                alt={`${title} — thumbnail ${i + 1}`}
                className={`gallery-thumb ${i === active ? 'active' : ''}`}
                onClick={() => setActive(i)}
                onError={onImgError}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="lightbox-backdrop" onClick={() => setLightbox(false)}>
          <button
            className="lightbox-close"
            aria-label="Close gallery"
            onClick={() => setLightbox(false)}
          >
            <i className="bi bi-x-lg" />
          </button>
          {pics.length > 1 && (
            <button
              className="lightbox-btn"
              style={{ left: 24 }}
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              <i className="bi bi-chevron-left" />
            </button>
          )}
          <img
            src={pics[active]}
            alt={`${title} — photo ${active + 1} enlarged`}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
            onError={onImgError}
          />
          {pics.length > 1 && (
            <button
              className="lightbox-btn"
              style={{ right: 24 }}
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              <i className="bi bi-chevron-right" />
            </button>
          )}
          <div
            className="position-absolute bottom-0 start-50 translate-middle-x text-white small pb-3"
            style={{ opacity: 0.8 }}
          >
            {active + 1} / {pics.length}
          </div>
        </div>
      )}
    </div>
  );
}
