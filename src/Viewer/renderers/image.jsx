import React, {useEffect, useState} from 'react';
import { retrieveMediaForCid } from '../../Core/utils/retrieveMedia';
import useDoenetRender from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';

export default React.memo(function Image(props) {
  let { name, SVs } = useDoenetRender(props,false);
  let [url, setUrl] = useState(null)

  useEffect(()=>{
    if (SVs.cid){
        retrieveMediaForCid(SVs.cid,SVs.mimeType).then(result => {
        // console.log('retrieved media')
        // console.log(result)
        setUrl(result.mediaURL);
      })
      .catch((e)=>{
        //Ignore errors for now
      })
    }
  },[])

  if (SVs.hidden) return null;

  return (
    <div style={{ margin: "12px 0" }}>
      <a name={name} />
      {
        url || SVs.source ?
        <img 
          id={name} 
          src={url ? url : SVs.source ? SVs.source : ""} 
          style={{
            display:"flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth:'850px'
          }}
          width={sizeToCSS(SVs.width)} 
          height={sizeToCSS(SVs.height)} 
          alt={SVs.description} 
        /> 
        : 
        <div 
          id={name} 
          style={{
            display:"flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth:'850px',
            width:sizeToCSS(SVs.width),
            height:sizeToCSS(SVs.height),
            border: "var(--mainBorder)",
          }}
        >
          {SVs.description}
        </div>
      }
    </div>
  )


// if (url){

//   return (
//   <React.Fragment>
//       <a name={name} />
//       <img 
//       id={name} 
//       src={url} 
//       style={{maxWidth:'850px'}}
//       width={sizeToCSS(SVs.width)} 
//       height={sizeToCSS(SVs.height)} 
//       alt={SVs.description} />
//     </React.Fragment>

// }else if (!SVs.cid && SVs.source) {

//   let src = SVs.source;
  
  //TODO: Is this possible?
  // if (SVs.asFileName){
  //   src = src + `?filename=${SVs.asFileName}`;
  // }
    
  // }else if(SVs.height && SVs.width){
  //   <a name={name} />
  //   //Show preview
  //   return <React.Fragment>
  //   <a name={name} />
  //   <div 
  //   id={name} 
  //   style={{
  //     display:"inline-block",
  //     maxWidth:'850px',
  //     width:sizeToCSS(SVs.width),
  //     height:sizeToCSS(SVs.height),
  //     border: "solid black 1px",
  //   }}
  //    >{SVs.description}</div>
  // </React.Fragment>
  // }

  // return null;

})
