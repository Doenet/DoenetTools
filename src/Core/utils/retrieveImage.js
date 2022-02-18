import { CIDFromArrayBuffer } from "./cid";

export async function retrieveMediaForCID(CID, mimeType) {

  try {
    return await retrieveMediaFromIPFS(CID);
  } catch (e) {
    // if there is an error other than CID not found,
    // then there is no need to try to get CID from media
    // as it indicates something wrong with the CID
    if (e.message.substring(0, 15) !== "CID not found: ") {
      throw e;
    }
  };


  return retrieveMediaFromServer(CID, mimeType);

}


function retrieveMediaFromIPFS(CID) {

  return new Promise((resolve, reject) => {

    let timeoutId;

    let request = new XMLHttpRequest();
    request.open("GET", `https://${CID}.ipfs.dweb.link/`, true);

    request.onload = async function () {

      clearTimeout(timeoutId);

      if (request.status === 200) {

        let mediaBlob = request.response;

        let CIDRetrieved = await CIDFromArrayBuffer(await mediaBlob.arrayBuffer());



        if (CIDRetrieved === CID) {
          let mediaURL = URL.createObjectURL(request.response);
          resolve({ mediaBlob, mediaURL })
        } else {
          reject(new Error("CID mismatch"));
        }

        return;
      }

      // got a response other than success

      reject(new Error(`CID not found: ${CID}`));

    }

    request.responseType = "blob";
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


function retrieveMediaFromServer(CID, mimeType) {

  return new Promise((resolve, reject) => {

    let extension = extensionFromMimeType(mimeType)

    let request = new XMLHttpRequest();
    request.open("GET", `/media/${CID}.${extension}`, true);

    request.onload = async function () {
      if (request.status === 200) {

        let mediaBlob = request.response;

        let CIDRetrieved = await CIDFromArrayBuffer(await mediaBlob.arrayBuffer());

        if (CIDRetrieved === CID) {
          let mediaURL = URL.createObjectURL(request.response);
          resolve({ mediaBlob, mediaURL })
        } else {
          reject(new Error("CID mismatch"));
        }

        return;

      }

      // got a response other than success

      reject(new Error(`CID not found: ${CID}`));

    }

    request.responseType = "blob";
    request.send();

  })


}


function extensionFromMimeType(mimeType) {
  if (mimeType === "image/png") {
    return "png";
  } else if (mimeType === "image/jpeg") {
    return "jpg";
  } else if (mimeType === "text/csv") {
    return "csv";
  } else {
    return "txt";
  }
}