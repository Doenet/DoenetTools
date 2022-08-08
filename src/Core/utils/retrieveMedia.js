import axios from "axios";
import { cidFromArrayBuffer } from "./cid";

export async function retrieveMediaForCid(cid, mimeType) {

  try {
    return await retrieveMediaFromIPFS(cid);
  } catch (e) {
    // if have error from IPFS, fallback to retrieving from server
  };

  //Only if doenetML tag is not providing mimeType and not on IPFS
  //look up in database
  if (!mimeType) {
    let { data } = await axios.get('/api/getMimeType.php', {
      params: { cid: cid }
    });
    mimeType = data['mime-type'];
  }

  return retrieveMediaFromServer(cid, mimeType);

}


async function retrieveMediaFromIPFS(cid) {


  let controller = new AbortController();
  let signal = controller.signal;

  // If the IPFS gateway cannot find the cid,
  // it hangs for a long time before timing out.
  // To avoid the long wait, abort the request after 1 second.
  let timeoutId = setTimeout(() => {
    controller.abort();
  }, 1000)


  try {
    let response = await fetch(`https://${cid}.ipfs.dweb.link/`, { signal });

    // if got a response, then we won't abort
    clearTimeout(timeoutId);

    if (response.ok) {
      let mediaBlob = await response.blob();

      let CidRetrieved = await cidFromArrayBuffer(await mediaBlob.arrayBuffer());

      if (CidRetrieved === cid) {
        let mediaURL = URL.createObjectURL(mediaBlob);
        return { mediaBlob, mediaURL };
      } else {
        return Promise.reject(new Error("cid mismatch"));
      }
    } else {
      return Promise.reject(new Error(`cid not found: ${cid}`))
    }

  }
  catch (e) {
    return Promise.reject(new Error(`cid not found: ${cid}`))
  }


}


async function retrieveMediaFromServer(cid, mimeType) {

  try {
    let extension = extensionFromMimeType(mimeType)

    let response = await fetch(`/media/${cid}.${extension}`);

    if (response.ok) {
      let mediaBlob = await response.blob();

      let CidRetrieved = await cidFromArrayBuffer(await mediaBlob.arrayBuffer());

      if (CidRetrieved === cid) {
        let mediaURL = URL.createObjectURL(mediaBlob);
        return { mediaBlob, mediaURL };
      } else {
        return Promise.reject(new Error("cid mismatch"));
      }
    } else {
      return Promise.reject(new Error(`cid not found: ${cid}`));
    }
  }
  catch (e) {
    return Promise.reject(new Error(`cid not found: ${cid}`));
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