import {useState, createRef, useEffect} from "react";
import ResizeObserver from "resize-observer-polyfill";

const useResize = () => {
  const [rect,setRect] = useState({});
  const elementRef = createRef(null);

  useEffect(() => {
    const ro = new ResizeObserver((entries, observer) => {
      for(const entry of entries ){
        if(entry.target === elementRef.current){
          setRect(entry.contentRect);
        }
      }
    });
    ro.observe(elementRef.current);
    return () =>{
      ro.disconnect();
    };
  },[]);
  return [rect, {ref:elementRef}];
}
export default useResize;