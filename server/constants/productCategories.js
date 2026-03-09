export const PRODUCT_CATEGORIES = [
  'Footware',
  'Clothing',
  'Cosmetics',
  'Watches',
  'Bags',
  'Accessories'
];

export const DEFAULT_PRODUCT_CATEGORY = 'Accessories';

export const normalizeCategory = (value) => {
  if (!value || typeof value !== 'string') return DEFAULT_PRODUCT_CATEGORY;

  const trimmed = value.trim().toLowerCase();
  const match = PRODUCT_CATEGORIES.find((category) => category.toLowerCase() === trimmed);
  return match || DEFAULT_PRODUCT_CATEGORY;
};
