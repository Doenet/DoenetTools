import axios from "axios";


export async function clearUsersInformationFromTheBrowser(){
  localStorage.clear(); //Clear out the profile of the last exam taker
  await axios.get('/api/signOut.php')

  const promiseForDelete = new Promise((resolve,reject)=>{
    const DBDeleteRequest = indexedDB.deleteDatabase('keyval-store'); //Clear out the profile of the last exam taker
    DBDeleteRequest.onerror = (event) => {
      resolve(false);
      console.error("Error deleting database.");
    };
  
    DBDeleteRequest.onsuccess = (event) => {
      resolve(true);
      // console.log("Database deleted successfully");
    };

  });

  return promiseForDelete;
}