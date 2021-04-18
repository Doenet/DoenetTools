
// import * as serial from './src/Core/utils/serializedStateProcessing';
import { serializedComponentsReviver } from './src/Core/utils/serializedStateProcessing';

export default function Mine(){
  console.log(">>>serial",serializedComponentsReviver)
  let a = other(2);
  console.log("Mine",a)
  return 'this is mine'+a;
}

export function other(x){
  return x*2;
}