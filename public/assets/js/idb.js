// create variable to hold db connection
let db; 

//establish a connection to indexDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes 
request.onupgradeneeded = function(event) {
    // save reference to the database
    const db = event.target.result;

    // create an object store called new_pizza set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a successful 
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above ) or simply established a connection, save reference to db on global variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
        // we havent created this yet, but we will soon, so lets comment it out for now 
        uploadPizza()
    }
};

request.onerror = function(event) {
    // log error here 
    console.log(event.target.errorCode)
};

// this function will be executed if we attempt to submit a new pizza and there's no internet connecton 
function saveRecord(record) {
    // open a new transaction with the database with read and write permission 
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with add method 
    pizzaObjectStore.add(record)
};

function uploadPizza() {
    
    // open a transaction to db 
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all the records from index
    const getAll = pizzaObjectStore.getAll(); 
    
    getAll.onsuccess = function() {
        // if there was a data in indexedDb's store, let's send it to the api server 
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'Post',
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
                // open one more transaction 
                const transaction = db.transaction(['new_pizza'], 'readwrite');

                // access the new_pizza object store 

                const pizzaObjectStore = transaction.objectStore('new_pizza');

                // clear all items in store
                pizzaObjectStore.clear();

                alert('All saved pizzas has been submitted')
            })
            .catch(err => {
                console.log(err);
            })
        }
    }
};

// listen for app coming back online 
window.addEventListener('online', uploadPizza)