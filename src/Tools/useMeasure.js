import { useRef, useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'


function debounce(func, wait, immediate) {
  var timeout;

  return function () {
    var context = this,
      args = arguments;

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);

    if (callNow) func.apply(context, args);
  };
}
const getColumns = (width) => {
    if(width > 1500){return 5;}
    else if(width > 1000){return 4;}
    else if(width > 600){return 3;}
    else if(width > 400){return 2;}
    else if(width > 200){return 1;}
    else{return 1;}
  }
export default function useMeasure() {
  const ref = useRef()
  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 })
  const [ro] = useState(() => new ResizeObserver(debounce(([entry]) => set(entry.contentRect))));
  useEffect(() => {
    console.log("ref", ref.current);
    
    ro.observe(ref.current)
    ro.disconnect
  }, []) 
  const columns = getColumns(bounds.width)
  //set({...bounds,columns})
  //(ro.observe(ref.current), ro.disconnect), [])
  return [{ ref }, bounds,columns]
}
