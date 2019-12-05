import nanoid from 'nanoid';

export function createUniqueName(componentType) {
  // choose componentIndex randomly using nanoid
  // for now, make name be as: __componentType_ + componentIndex
  // but could change this to remove the prefix

  let componentIndex = nanoid(12);
  
  return `__${componentType}_${componentIndex}`;

}