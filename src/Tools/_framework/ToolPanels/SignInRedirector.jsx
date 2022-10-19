import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';


export default function SignInRedirector() {
      axios.get(`/api/umn/shibToJWT.php`)
      .then(({data})=>{
        console.log("data",data);
        //TODO: need to set the profile in local storage
      })

    return null;
}
 