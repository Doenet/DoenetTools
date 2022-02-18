import { CIDFromDoenetML } from "./cid";

export async function retrieveDoenetMLForCID(CID) {

  try {
    return await retrieveDoenetMLFromIPFS(CID);
  } catch (e) {
    // if there is an error other than CID not found,
    // then there is no need to try to get CID from media
    // as it indicates something wrong with the CID
    if (e.message.substring(0, 15) !== "CID not found: ") {
      throw e;
    }
  };


  return retrieveDoenetMLFromServer(CID);

}


function retrieveDoenetMLFromIPFS(CID) {

  return new Promise((resolve, reject) => {

    let timeoutId;

    let request = new XMLHttpRequest();
    request.open("GET", `https://${CID}.ipfs.dweb.link/`, true);

    request.onload = async function () {

      clearTimeout(timeoutId);

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

    request.send();

    // If the IPFS gateway cannot find the CID,
    // it hangs for a long time before timing out.
    // To avoid the long wait, stop the request and send failure after 1 second.
    timeoutId = setTimeout(() => {
      if (request.status === 0) {
        request.abort();
        reject(new Error(`CID not found: ${CID}`));
      }
    }, 1000)

  })


}


function retrieveDoenetMLFromServer(CID) {

  return new Promise((resolve, reject) => {

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

    request.send();

  })


}