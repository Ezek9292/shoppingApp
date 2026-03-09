export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size'];

export const PRODUCT_COLORS = [
  'Black',
  'White',
  'Gray',
  'Brown',
  'Blue',
  'Navy',
  'Red',
  'Green',
  'Yellow',
  'Orange',
  'Purple',
  'Pink',
  'Gold',
  'Silver',
  'Beige'
];

const normalizeList = (input) => (Array.isArray(input) ? input : []);

const normalizeByEnum = (input, enumList) => {
  const map = new Map(enumList.map((value) => [value.toLowerCase(), value]));
  const normalized = normalizeList(input)
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean)
    .map((value) => map.get(value.toLowerCase()))
    .filter(Boolean);

  return [...new Set(normalized)];
};

export const normalizeSizes = (sizes) => normalizeByEnum(sizes, PRODUCT_SIZES);
export const normalizeColors = (colors) => normalizeByEnum(colors, PRODUCT_COLORS);
