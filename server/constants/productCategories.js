export const PRODUCT_CATEGORIES = [
  'Footware',
  'Clothing',
  'Cosmetics',
  'Watches',
  'Bags',
  'Accessories'
];

export const DEFAULT_PRODUCT_CATEGORY = 'Accessories';

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
  if (!value || typeof value !== 'string') return DEFAULT_PRODUCT_CATEGORY;

  const trimmed = value.trim().toLowerCase();
  const aliased = CATEGORY_ALIASES[trimmed] || trimmed;
  const match = PRODUCT_CATEGORIES.find((category) => category.toLowerCase() === aliased.toLowerCase());
  return match || DEFAULT_PRODUCT_CATEGORY;
};
