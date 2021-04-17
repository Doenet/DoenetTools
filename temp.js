

export default function Mine(){
  let a = other(2);
  console.log("Mine",a)
  return 'this is mine'+a;
}

function other(x){
  return x*2;
}