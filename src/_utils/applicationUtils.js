import axios from "axios";
import { clear as idb_clear, keys as idb_keys } from 'idb-keyval';



export async function clearUsersInformationFromTheBrowser(){
  localStorage.clear(); //Clear out the profile of the last exam taker
  await axios.get('/api/signOut.php')
  await idb_clear();
  return true;
}


export async function checkIfUserClearedOut(){
  let messageArray = [];

  //Check for indexedDB
  let indexedDBKeysArray = await idb_keys()
  let indexedDBRemoved = indexedDBKeysArray.length == 0;
  if (!indexedDBRemoved){
    messageArray.push("IndexedDB not removed");
  }
  //Check for local storage
  //TODO: find something is stored in localStorage and test if this clears it
  let localStorageRemoved = localStorage.length == 0;
  if(!localStorageRemoved){
    messageArray.push("local storage not removed");
  }

  //Check for cookie
  const vanillaCookies = document.cookie.split(';');
  let cookieRemoved = vanillaCookies.length === 1 && vanillaCookies[0] === ''
  if(!cookieRemoved){
    messageArray.push("cookie not removed");
  }

  let userInformationIsCompletelyRemoved = false;
  if (indexedDBRemoved && localStorageRemoved && cookieRemoved){
    userInformationIsCompletelyRemoved = true;
  }
  return {userInformationIsCompletelyRemoved,messageArray};
}