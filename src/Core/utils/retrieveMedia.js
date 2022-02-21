import axios from "axios";
import { CIDFromArrayBuffer } from "./cid";

export async function retrieveMediaForCID(CID,mimeType) {

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

  //Only if doenetML tag is not providing mimeType and not on IPFS
  //look up in database
  if (!mimeType){
    let {data} = await axios.get('/api/getMimeType.php',{
      params:{cid:CID}
      });
    mimeType = data['mime-type'];
  }

  return retrieveMediaFromServer(CID, mimeType);

}


async function retrieveMediaFromIPFS(CID) {


  let controller = new AbortController();
  let signal = controller.signal;

  // If the IPFS gateway cannot find the CID,
  // it hangs for a long time before timing out.
  // To avoid the long wait, abort the request after 1 second.
  let timeoutId = setTimeout(() => {
    controller.abort();
  }, 1000)


  try {
    let response = await fetch(`https://${CID}.ipfs.dweb.link/`, { signal });

    // if got a response, then we won't abort
    clearTimeout(timeoutId);

    if (response.ok) {
      let mediaBlob = await response.blob();

      let CIDRetrieved = await CIDFromArrayBuffer(await mediaBlob.arrayBuffer());

      if (CIDRetrieved === CID) {
        let mediaURL = URL.createObjectURL(mediaBlob);
        return { mediaBlob, mediaURL };
      } else {
        return Promise.reject(new Error("CID mismatch"));
      }
    } else {
      return Promise.reject(new Error(`CID not found: ${CID}`))
    }

  }
  catch (e) {
    return Promise.reject(new Error(`CID not found: ${CID}`))
  }


}


async function retrieveMediaFromServer(CID, mimeType) {

  try {
    let extension = extensionFromMimeType(mimeType)

    let response = await fetch(`/media/${CID}.${extension}`);

    if (response.ok) {
      let mediaBlob = await response.blob();

      let CIDRetrieved = await CIDFromArrayBuffer(await mediaBlob.arrayBuffer());

      if (CIDRetrieved === CID) {
        let mediaURL = URL.createObjectURL(mediaBlob);
        return { mediaBlob, mediaURL };
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