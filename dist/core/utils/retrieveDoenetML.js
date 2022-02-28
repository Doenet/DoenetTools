import { CIDFromDoenetML } from "./cid.js";

export function retrieveDoenetMLForCID(CID) {

  return new Promise((resolve, reject) => {

    // immediately start trying to retrieve from IPFS
    let resultIPFS = retrieveDoenetMLFromIPFS(CID);

    let promiseIPFS = resultIPFS.promise;
    let controllerIPFS = resultIPFS.controller;

    let controllerServer;

    let rejectedIPFS = false;
    let rejectedServer = false;

    let timeoutId;

    promiseIPFS
      .then(res => {
        // if successfully retrieve from IPFS
        // then cancel timer (for either starting the server request or waiting 5 seconds at end)
        // and abort the server request if it is in progress
        clearTimeout(timeoutId);
        if (controllerServer && !rejectedServer) {
          controllerServer.abort();
        }
        resolve(res);
      })
      .catch(e => {
        rejectedIPFS = true;
        if (rejectedServer) {
          // rejected from both server and IPFS
          // so cancel the 5 second wait at the end and reject
          clearTimeout(timeoutId);
          reject(e);
        }
      })


    timeoutId = setTimeout(() => {

      // if the timer wasn't cleared then IPFS has not yet retrieved
      // so start retrieving from the server
      let resultServer = retrieveDoenetMLFromServer(CID);

      let promiseServer = resultServer.promise;
      controllerServer = resultServer.controller;

      promiseServer
        .then(res => {
          if (!rejectedIPFS) {
            controllerIPFS.abort();
          }
          resolve(res);
        })
        .catch(e => {
          rejectedServer = true;

          if (rejectedIPFS) {
            reject(e);
          } else {
            // give IPFS server 5 more seconds to retrieve
            timeoutId = setTimeout(() => {
              controllerIPFS.abort();
              reject(e)
            }, 5000)

          }

        })


    }, 100);


  })

}


function retrieveDoenetMLFromIPFS(CID) {

  let controller = new AbortController();
  let signal = controller.signal;

  let retrieveFromIPFS = async function () {
    try {
      let response = await fetch(`https://${CID}.ipfs.dweb.link/`, { signal });

      if (response.ok) {
        let doenetML = await response.text();

        let CIDRetrieved = await CIDFromDoenetML(doenetML);

        if (CIDRetrieved === CID) {
          return doenetML;
        } else {
          return Promise.reject(new Error("CID mismatch"));
        }
      } else {
        return Promise.reject(new Error(`CID not found: ${CID}`));
      }
    }
    catch (e) {
      return Promise.reject(new Error(`CID not found: ${CID}`));
    }
  }


  let promise = retrieveFromIPFS();

  return { promise, controller };


}


function retrieveDoenetMLFromServer(CID) {


  let controller = new AbortController();
  let signal = controller.signal;


  let retrieveFromServer = async function () {
    try {
      let response = await fetch(`/media/${CID}.doenet`, { signal });

      if (response.ok) {
        let doenetML = await response.text();

        let CIDRetrieved = await CIDFromDoenetML(doenetML);

        if (CIDRetrieved === CID) {
          return doenetML;
        } else {
          return Promise.reject(new Error("CID mismatch"));
        }
      } else {
        return Promise.reject(new Error(`CID not found: ${CID}`));
      }
    }
    catch (e) {
      return Promise.reject(new Error(`CID not found: ${CID}`));
    }
  }


  let promise = retrieveFromServer();

  return { promise, controller };

}