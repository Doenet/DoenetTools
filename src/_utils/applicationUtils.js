import axios from "axios";


export async function clearUsersInformationFromTheBrowser(){
  // console.log("clearUsersInformationFromTheBrowser")
  localStorage.clear(); //Clear out the profile of the last exam taker
  // console.log("localStorage")
  await axios.get('/api/signOut.php')
  // console.log("signOut.php")

  const promiseForDelete = new Promise((resolve,reject)=>{
    const DBDeleteRequest = indexedDB.deleteDatabase('keyval-store'); //Clear out the profile of the last exam taker
    // console.log("DBDeleteRequest",DBDeleteRequest)
    DBDeleteRequest.onerror = (event) => {
      // console.log("onerror")
      resolve(false);
      console.error("Error deleting database.");
    };
    DBDeleteRequest.onblocked = (event) => {
      console.log("onblocked")
      resolve(false);
      console.error("Error: blocked from deleting database.");
    };
  
    DBDeleteRequest.onsuccess = (event) => {
      // console.log("onsuccess")
// 
      resolve(true);
      // console.log("Database deleted successfully");
    };

  });

  return promiseForDelete;
}


export async function checkIfUserClearedOut(){
  let messageArray = [];

  //Check for indexedDB
  let indexedDBRemoved = !(await window.indexedDB.databases()).map(db => db.name).includes('keyval-store');
  if (!indexedDBRemoved){
    messageArray.push("IndexedDB not removed");
  }
  //Check for local storage
  //TODO: find something is stored in localStorage and test if this clears it
  let localStorageRemoved = localStorage.length == 0;
  localStorageRemoved = false; //remove me
  if(!localStorageRemoved){
    messageArray.push("local storage not removed");
  }

  //Check for cookie
  const vanillaCookies = document.cookie.split(';');
  let cookieRemoved = vanillaCookies.length === 1 && vanillaCookies[0] === ''
  cookieRemoved = false; //remove me
  if(!cookieRemoved){
    messageArray.push("cookie not removed");
  }

  let userInformationIsCompletelyRemoved = false;
  if (indexedDBRemoved && localStorageRemoved && cookieRemoved){
    userInformationIsCompletelyRemoved = true;
  }
  return {userInformationIsCompletelyRemoved,messageArray};
}