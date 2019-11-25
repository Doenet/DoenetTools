const DATABASE_NAME = 'DOENET_DATABASE';
const DATABASE_VERSION = 1;

export default class IndexedDB {

  openDB(callback=(()=>{})) {
    if (!window.indexedDB) {
      callback({ message: 'Unsupported indexedDB' });
    }
    let request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onsuccess = e => {
      this.db = request.result;
      callback(e);
    };
    request.onerror = e => callback(e.target.error);
    request.onupgradeneeded = e => {
      this.db = e.target.result;

      switch(e.oldVersion) {
        case 0:
          // do initial schema creation
          this.db.createObjectStore('header_store', { keyPath: "type" });
      }

      this.db.onabort = e2 => callback(e2.target.error);
      this.db.error = e2 => callback(e2.target.error);
    };
    request.oncomplete = e => {
      this.db.close();
    }
  }

  deleteDB() {
    if (window.indexedDB) {
      window.indexedDB.deleteDatabase(this.dbName);
    }
  }

  deleteStore(storeName, callback=(()=>{})) {
    if (this.db) {
      this.db.deleteObjectStore();
      this.db.oncomplete = e => callback(e.target.result);
      this.db.onabort = e => callback(e.target.error);
      this.db.error = e => callback(e.target.error);
    }
  }

  insert(storeName, data, callback=(()=>{})) {
    if (this.db && data) {
      let transaction = this.db.transaction([storeName], "readwrite");
      transaction.onabort = te => callback(te.target.error);
      transaction.onerror = te => callback(te.target.error);

      let request = transaction.objectStore(storeName).put(data);
      request.onerror = e => callback(e.target.error);
      request.onsuccess = e => callback(e.target.result);
    }
  }

  get(storeName, key, callback=(()=>{})) {
    if (this.db && key) {
      let request = this.db.transaction([storeName]).objectStore(storeName).get(key)
      request.onerror = e => callback(e.target.error);
      request.onsuccess = e => callback(e.target.result);
    }
  }

  getAll(storeName, callback=(()=>{})) {
    if (this.db) {
      let request = this.db.transaction(storeName).objectStore(storeName).openCursor(null, "next");
      let results = [];
      request.onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
          console.log("Key:" + cursor.key + " Value:" + cursor.value);
          results.push({ [cursor.key]: cursor.value });
          cursor.continue();
        } else {
          callback(results);
        }
      };
      request.onerror = e => callback(e.target.error);
    }
  }

  remove(storeName, key, callback=(()=>{})) {
    if (this.db) {
      let request = this.db.transaction([storeName], "readwrite").objectStore(storeName).delete(key);
      request.onerror = e => callback(e.target.error);
      request.onsuccess = e => callback(e.target.result);
    }
  }

  clear(storeName, callback=(()=>{})) {
    if (this.db) {
      let request = this.db.transaction([storeName], "read").objectStore(storeName).clear();
      request.onerror = e => callback(e.target.error);
      request.onsuccess = e => callback(e.target.result);
    }
  }

  count(storeName, callback=(()=>{})) {
    if (this.db) {
      let request = this.db.transaction([storeName]).objectStore(storeName).count();
      request.onerror = e => callback(e.target.error);
      request.onsuccess = e => callback(e.target.result);
    }
  }
}