import nanoid from 'nanoid';
import format from 'nanoid/format';

export function createUniqueName(componentType, rng) {
  // choose componentIndex randomly using nanoid
  // for now, make name be as: __componentType_ + componentIndex
  // but could change this to remove the prefix

  // let componentIndex = nanoid(12);

  function randomArray (size) {
    const result = []
    for (let i = 0; i < size; i++) {
      result.push(rng.random_int31())
    }
    return result
  }

  let componentIndex = format(randomArray, "abcdefghijklmnopqrtstuvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-",12)
  return `__${componentType}_${componentIndex}`;

}