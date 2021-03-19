import { useRef, useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'


function debounce(func, wait, immediate) {
  // 'private' variable for instance
  // The returned function will be able to reference this due to closure.
  // Each call to the returned function will share this common timer.
  var timeout;

  // Calling debounce returns a new anonymous function
  return function() {
    // reference the context and args for the setTimeout function
    var context = this,
      args = arguments;

    // Should the function be called now? If immediate is true
    //   and not already in a timeout then the answer is: Yes
    var callNow = immediate && !timeout;

    // This is the basic debounce behaviour where you can call this 
    //   function several times, but it will only execute once 
    //   [before or after imposing a delay]. 
    //   Each time the returned function is called, the timer starts over.
    clearTimeout(timeout);

    // Set the new timeout
    timeout = setTimeout(function() {

      // Inside the timeout function, clear the timeout variable
      // which will let the next execution run when in 'immediate' mode
      timeout = null;

      // Check if the function already ran with the immediate flag
      if (!immediate) {
        // Call the original function with apply
        // apply lets you define the 'this' object as well as the arguments 
        //    (both captured before setTimeout)
        func.apply(context, args);
      }
    }, wait);

    // Immediate mode and no wait timer? Execute the function..
    if (callNow) func.apply(context, args);
  }
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
