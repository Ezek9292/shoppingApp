export const PRODUCT_CATEGORIES = [
  { value: 'Footware', label: 'Footware' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Cosmetics', label: 'Cosmetics' },
  { value: 'Watches', label: 'Watches' },
  { value: 'Bags', label: 'Bags' },
  { value: 'Accessories', label: 'Accessories' }
];

export const ALL_CATEGORY = 'All';

const CATEGORY_ALIASES = {
  footwear: 'Footware',
  footware: 'Footware',
  clothing: 'Clothing',
  cosmetics: 'Cosmetics',
  watches: 'Watches',
  bags: 'Bags',
  accessories: 'Accessories'
};

export const normalizeCategory = (value) => {
  if (!value || typeof value !== 'string') return ALL_CATEGORY;
  const normalized = CATEGORY_ALIASES[value.trim().toLowerCase()];
  return normalized || ALL_CATEGORY;
};
