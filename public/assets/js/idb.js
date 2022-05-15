// creates a variable to hold db connection 
let db; 

// establish connection to IndexedDB called 'pizza_hunt' and set it to version 1 
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes 
request.onupgradeneeded = function(event) {
    // this save a reference to the database
    const db = event.target.result;
    
    // creates an object store (table) called 'new_pizza'
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a successful 
request.onsuccess = function(event) {
     // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
     db = event.target.result;

     // check if app is online, if yes run uploadPizza() to send al local db data to api
     if (navigator.onLine) {
        uploadPizza();
     }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// this function will be executed if we attempt to submit a new pizza and there is no internet
function saveRecord(record) {
    // open a new transaction with the database with read and writee permission 
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with add method
    pizzaObjectStore.add(record)
};

function uploadPizza() {
    // open transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from the store and set to a variable 
    const getAll = pizzaObjectStore.getAll();

    getAll.onsuccess = function() {
        // if there was a data in indexedDB store, let send it to the api server 
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
    
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse)
                }
                // open one more transcation 
                const transcation = db.transaction(['new_pizza', 'readwrite']);
                // access the new_pizza object store
                const pizzaObjectStore = transcation.objectStore('new_pizza');
                // clear item in your store
                pizzaObjectStore.clear();

                alert('All saved pizza has been submited')
            }).catch(err => {
                console.log(err)
            })
        }
    }

}

window.addEventListener('online', uploadPizza)