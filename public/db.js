// set var for all the db's
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;
// open budget
let db;
const request = indexedDB.open("budget", 1);
// check for onupgrade
request.onupgradeneeded = ({ target }) => {
  let db = target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};
// check for onsucess
request.onsuccess = ({ target }) => {
  db = target.result;

  // check if app is online 
  if (navigator.onLine) {
    checkDatabase();
  }
};
// if not online, throw error
request.onerror = function(event) {
  console.log("Woopsy Daisy! " + event.target.errorCode);
};

// save record
function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
// store record
  store.add(record);
}

// circle back and check database
function checkDatabase() {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();
// if onsucess, grab all the things
  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        // return a json response 
      .then(response => {        
        return response.json();
      })
      .then(() => {
        // delete all the records if successful
        const transaction = db.transaction(["pending"], "readwrite");
        const store = transaction.objectStore("pending");
        store.clear();
      });
    }
  };
}

// listen for app to be online
window.addEventListener("online", checkDatabase);