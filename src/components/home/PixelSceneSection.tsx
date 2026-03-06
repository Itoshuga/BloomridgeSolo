const FARM_SCENE_OVERLAY =
  'data:image/png;base64,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';

function PixelSceneSection() {
  return (
    <section className="section scene-section">
      <article className="scene-frame">
        <img
          className="scene-frame__base"
          src="/landing/farm.gif"
          alt="Large pixel farm scene with crops, animals and workers"
          width={1400}
          height={560}
          loading="lazy"
          decoding="async"
        />
        <img
          className="scene-frame__overlay"
          src={FARM_SCENE_OVERLAY}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      </article>
    </section>
  );
}

export default PixelSceneSection;
