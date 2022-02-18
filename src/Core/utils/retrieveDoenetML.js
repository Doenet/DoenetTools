import { CIDFromDoenetML } from "./cid";

export function retrieveDoenetMLForCID(CID) {

  return new Promise((resolve, reject) => {

    // immediately start trying to retrieve from IPFS
    let resultIPFS = retrieveDoenetMLFromIPFS(CID);

    let promiseIPFS = resultIPFS.promise;
    let requestIPFS = resultIPFS.request;

    let requestServer;

    let rejectedIPFS = false;
    let rejectedServer = false;

    let timerId;

    promiseIPFS
      .then(res => {
        // if successfully retrieve from IPFS
        // then cancel timer (for either starting the server request or waiting 5 seconds at end)
        // and abort the server request if it is in progress
        clearTimeout(timerId);
        if (requestServer && !rejectedServer) {
          requestServer.abort();
        }
        resolve(res);
      })
      .catch(e => {
        rejectedIPFS = true;
        if(rejectedServer) {
          // rejected from both server and IPFS
          // so cancel the 5 second wait at the end and reject
          clearTimeout(timerId);
          reject(e);
        }
      })


    timerId = setTimeout(() => {

      // if the timer wasn't cleared then IPFS has not yet retrieved
      // so start retrieving from the server
      let resultServer = retrieveDoenetMLFromServer(CID);

      let promiseServer = resultServer.promise;
      requestServer = resultServer.request;

      promiseServer
      .then(res => {
        if (!rejectedIPFS) {
          requestIPFS.abort();
        }
        resolve(res);
      })
      .catch(e => {
        rejectedServer = true;

        if(rejectedIPFS) {
          reject(e);
        } else {
          // give IPFS server 5 more seconds to retrieve
          timerId = setTimeout(() => {
            requestIPFS.abort();
            reject(e)
          }, 5000)

        }

      })
  

    }, 100);


  })

}


function retrieveDoenetMLFromIPFS(CID) {

  let request;

  let promise = new Promise((resolve, reject) => {

    request = new XMLHttpRequest();
    request.open("GET", `https://${CID}.ipfs.dweb.link/`, true);

    request.onload = async function () {

      if (request.status === 200) {
        if (request.getResponseHeader('content-type').substring(0, 10) === "text/plain") {
          // have a text response

          let doenetML = request.responseText;

          let CIDRetrieved = await CIDFromDoenetML(doenetML);

          if (CIDRetrieved === CID) {
            resolve(doenetML)
          } else {
            reject(new Error("CID mismatch"));
          }
        } else {
            reject(new Error(`CID does not return text: ${CID}`));
        }

        return;
      }

      // got a response other than success
      reject(new Error(`CID not found: ${CID}`));

    }

    request.onabort = () => reject(new Error("Request aborted"));

    request.error = () => reject(new Error(`Error in retrieving CID ${CID}`));

    request.send();

  })

  return { promise, request };


}


function retrieveDoenetMLFromServer(CID) {

  let request;

  let promise = new Promise((resolve, reject) => {

    let request = new XMLHttpRequest();
    request.open("GET", `/media/${CID}.doenet`, true);

    request.onload = async function () {
      if (request.status === 200) {

        let doenetML = request.responseText;

        let CIDRetrieved = await CIDFromDoenetML(doenetML);

        if (CIDRetrieved === CID) {
          resolve(doenetML);
        } else {
          reject(new Error("CID mismatch"));
        }

        return;

      }

      // got a response other than success
      reject(new Error(`CID not found: ${CID}`));

    }

    request.onabort = () => reject(new Error("Request aborted"));

    request.error = () => reject(new Error(`Error in retrieving CID ${CID}`))

    request.send();

  })

  return { promise, request };

}