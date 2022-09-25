import { atom } from 'recoil';

export const pageVariantInfoAtom = atom({
  key: 'pageVariantInfoAtom',
  default: { index: 1 },
});

export const pageVariantPanelAtom = atom({
  key: 'pageVariantPanelAtom',
  default: { index: 1, allPossibleVariants: [], variantIndicesToIgnore: [] },
});

export const activityVariantPanelAtom = atom({
  key: 'activityVariantPanelAtom',
  default: { index: 1, numberOfVariants: 0 },
});
