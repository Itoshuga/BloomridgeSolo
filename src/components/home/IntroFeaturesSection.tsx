const LIFE_FEATURES = [
  {
    id: 'farm',
    iconSrc: '/landing/items/watering_can.png',
    title: 'Cultive ta parcelle',
    description:
      'Prepare le sol, plante tes premieres graines et transforme un terrain en friche en vrai petit domaine vivant.',
  },
  {
    id: 'grow',
    iconSrc: '/landing/items/pickaxe.png',
    title: 'Fais grandir ton village',
    description:
      'Debloque de nouveaux ateliers, accueille des voisins et donne un vrai rythme a la place du marche.',
  },
  {
    id: 'trade',
    iconSrc: '/landing/items/log.png',
    title: 'Vends au marche local',
    description:
      'Echange tes recoltes, cuisine des recettes maison et trouve les meilleures commandes de la semaine.',
  },
  {
    id: 'explore',
    iconSrc: '/landing/items/net.png',
    title: 'Explore la vallee',
    description:
      'Pars vers la foret, le lac et les collines pour trouver des materiaux rares et des histoires de saison.',
  },
];

const VALLEY_BEATS = [
  'Remets la vieille serre en etat avant l arrivee de l ete.',
  'Aide les voisins pendant les foires de village et les evenements de saison.',
  'Developpe ta ferme a ton rythme, sans pression ni chronometre.',
];

function IntroFeaturesSection() {
  return (
    <section className="section intro-story-section" id="features">
      <div className="home-container">
        <div className="intro-story-top">
          <header className="intro-story-copy">
            <p className="intro-story-kicker">NOUVEAU DEPART</p>
            <h2>Vous venez vivre a la campagne, avec juste quelques graines en poche.</h2>
            <p className="intro-story-lead">
              Installez-vous a Bloomridge Valley, renovez une petite ferme abandonnee et
              retrouvez une vie simple: cultiver, echanger et construire un coin paisible avec la
              communaute.
            </p>
          </header>

          <aside className="pixel-card intro-story-lore" aria-label="Lore de la vallee">
            <p className="intro-story-lore__label">Chronique de la vallee</p>
            <h3>Le village vous attend au lever du soleil</h3>
            <p>
              Chaque matin, la brume se leve sur les champs. Les habitants ouvrent leurs echoppes,
              les sentiers se remplissent et votre ferme devient le nouveau coeur du hameau.
            </p>

            <ul className="intro-story-lore__list">
              {VALLEY_BEATS.map((beat) => (
                <li key={beat}>{beat}</li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="intro-story-grid" role="list" aria-label="Gameplay principal">
          {LIFE_FEATURES.map((feature) => (
            <article className="pixel-card intro-story-card" key={feature.id} role="listitem">
              <span className="intro-story-card__icon" aria-hidden>
                <img src={feature.iconSrc} alt="" loading="lazy" decoding="async" />
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default IntroFeaturesSection;
