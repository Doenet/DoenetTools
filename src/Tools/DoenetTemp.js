import React from 'react';
import {
  useQuery,
  useQueryCache,
  QueryCache,
  ReactQueryCacheProvider,
} from 'react-query'
import { ReactQueryDevtools } from 'react-query-devtools'

export default function app() {
return <>
<Demo />
</>
};

function Demo(){
  return "Demo"
}
