  // import DoenetViewer from '../Tools/DoenetViewer';

import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  RecoilRoot,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import Drive from '../imports/Drive'
import AddItem from '../imports/AddItem'



export default function app() {
return <RecoilRoot>
    <Demo />
</RecoilRoot>
};


function Demo(){
  console.log("=== Demo")

  return <>

  <AddItem />
  {/* <Drive types={['course']} /> */}
  <Drive driveId='ZLHh5s8BWM2azTVFhazIH' />

  </>
}


