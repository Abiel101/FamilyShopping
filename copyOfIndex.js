/****   Importing Firebase Need   ****/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { animation } from './animation.js'

const appSettings = { databaseURL: "https://beargroceries-default-rtdb.firebaseio.com/" };
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList"); 

/****   Front End Element Selection   ****/

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const errorEl = document.getElementById('error');

// Event Listener For "Add To Cart" Btn.
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    if (inputValue != ''){
        push(shoppingListInDB, inputValue);
        clearInputFieldEl();
        errorEl.classList.remove('active');
    }else{
        errorEl.classList.add('active');
    }
})

//DB Function to update items inside database to the front end
onValue(shoppingListInDB, function(snapshot){

    if(snapshot.exists()){
        //Object.entries -> grabs both object key & values converting them into an array.
        let shoppingListItems = Object.entries(snapshot.val());
        clearShoppingList();
    
        for(let i = 0; i < shoppingListItems.length; i++){
            let currentItem = shoppingListItems[i]; 
            appendItemToShoppingListEl(currentItem);
        }
    }else{
        shoppingListEl.innerHTML = "No items here... yet"   ;
    }
    animation()
})  



// Clears the shopping list
function clearShoppingList(){
    shoppingListEl.innerHTML = '';
}
// Clears the input element
function clearInputFieldEl() {
    inputFieldEl.value = "";
}

// Add input values to the list 
function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];
    let newEl = document.createElement('li');

    newEl.textContent = itemValue;
    newEl.classList.add('items');
    newEl.addEventListener('click', function(){
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);
    })

    shoppingListEl.append(newEl);
}