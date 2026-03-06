export type FeatureBlock = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type CollectionCard = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type MarketItem = {
  id: string;
  title: string;
  price: string;
  image: string;
  cta: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
};

export type MapZone = {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
};

export const CORE_FEATURES: FeatureBlock[] = [
  {
    id: 'farm',
    icon: 'F',
    title: 'Farm',
    description: 'Prepare ton terrain, pose des parcelles et automatise tes recoltes.',
  },
  {
    id: 'grow',
    icon: 'G',
    title: 'Grow',
    description: 'Fais evoluer tes cultures avec meteo, outils et bonus de saison.',
  },
  {
    id: 'trade',
    icon: 'T',
    title: 'Trade',
    description: 'Echange tes resources au marche et optimise tes routes de vente.',
  },
  {
    id: 'explore',
    icon: 'E',
    title: 'Explore',
    description: 'Decouvre des biomes rares, mini-donjons et secrets cooperatifs.',
  },
];

export const COLLECTION_FEATURES: CollectionCard[] = [
  {
    id: 'pets',
    icon: 'P',
    title: 'Companions',
    description: 'Des mascottes pixel qui boostent vitesse, craft et loot.',
  },
  {
    id: 'decor',
    icon: 'D',
    title: 'Farm Decor',
    description: 'Collection de batiments, clotures et themes de ferme.',
  },
  {
    id: 'craft',
    icon: 'C',
    title: 'Crafting Set',
    description: 'Ateliers specialises, recettes rares et evolution de village.',
  },
  {
    id: 'quests',
    icon: 'Q',
    title: 'Quest Ledger',
    description: 'Suite de missions journalieres avec objectifs coop.',
  },
  {
    id: 'weather',
    icon: 'W',
    title: 'Weather Events',
    description: 'Pluie dor, tempetes magiques et festivals saisonniers.',
  },
  {
    id: 'guild',
    icon: 'H',
    title: 'Guild Hall',
    description: 'Hub communautaire pour alliances, events et competition.',
  },
];

export const MARKET_ITEMS: MarketItem[] = [
  {
    id: 'turnip-seeds',
    title: 'Turnip Seeds',
    price: '18 BRG',
    image: '/landing/items/item-turnip.svg',
    cta: 'Buy pack',
  },
  {
    id: 'blueberry-jam',
    title: 'Blueberry Jam',
    price: '42 BRG',
    image: '/landing/items/item-blueberry-jam.svg',
    cta: 'Add to cart',
  },
  {
    id: 'iron-hoe',
    title: 'Iron Hoe',
    price: '95 BRG',
    image: '/landing/items/item-iron-hoe.svg',
    cta: 'Unlock tool',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'ava',
    name: 'Ava Kim',
    role: 'World Designer',
    image: '/landing/avatars/avatar-ava.svg',
  },
  {
    id: 'lio',
    name: 'Lio Park',
    role: 'Gameplay Engineer',
    image: '/landing/avatars/avatar-lio.svg',
  },
  {
    id: 'noa',
    name: 'Noa Reed',
    role: 'Pixel Artist',
    image: '/landing/avatars/avatar-noa.svg',
  },
  {
    id: 'sam',
    name: 'Sam Diaz',
    role: 'Community Lead',
    image: '/landing/avatars/avatar-sam.svg',
  },
];

export const WORLD_ZONES: MapZone[] = [
  {
    id: 'forest',
    name: 'Forest',
    description: 'Foraging, honey farms and hidden ruins.',
    x: 22,
    y: 34,
  },
  {
    id: 'desert',
    name: 'Desert',
    description: 'Dry crops, relic hunting and heat events.',
    x: 72,
    y: 42,
  },
  {
    id: 'volcano',
    name: 'Volcano',
    description: 'High-risk ore nodes and forge upgrades.',
    x: 62,
    y: 21,
  },
  {
    id: 'lake',
    name: 'Lake',
    description: 'Fishing tournaments and floating markets.',
    x: 46,
    y: 60,
  },
];

export const START_STEPS = [
  'Connect your account and reserve your first farmland tile.',
  'Pick a starter crop pack and place your first production loop.',
  'Join the market, trade items and expand to new islands.',
];
