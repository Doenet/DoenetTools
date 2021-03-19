import { useRef, useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'



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
  const [ro] = useState(() => new ResizeObserver(([entry]) => set(entry.contentRect)))
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
