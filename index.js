/***********************************************
* Importing Firebase things needed to connect, reference and push to database
***********************************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { animation } from './animation.js'

//Application settings, also can be called "fireBaseConfig"
const appSettings = {
    databaseURL: "https://beargroceries-default-rtdb.firebaseio.com/" //link to firebase db
}


const app = initializeApp(appSettings); //Initialize firebase app
const database = getDatabase(app); //Function to get the database  
const shoppingListInDB = ref(database, "shoppingList"); //Reference the database and gives it the name "shoppingList". 


/***********************************************
* My Code
***********************************************/
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const listItem = document.querySelector("li");

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    
    push(shoppingListInDB, inputValue);
    clearInputFieldEl();
    animation();
    // appendItemToShoppingListEl(inputValue);  //Since we are updating the data on the data base there is no need to append it again since we are getting all the data from the database.4
})

//Pulls the data that is currently in the data base
onValue(shoppingListInDB, function(snapshot){

    if(snapshot.exists()){
        //Grabs the entries and returns them as an array [0]Key/ID, [1]Value
        let shoppingListItems = Object.entries(snapshot.val());
        
        clearShoppingList();
    
        for(let i = 0; i < shoppingListItems.length; i++){
            let currentItem = shoppingListItems[i]; 
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];
    
            appendItemToShoppingListEl(currentItem);
        }
    }else{
        shoppingListEl.innerHTML = "No items here... yet"   ;
    }

})  



// Clears the shopping list to fully refresh list
function clearShoppingList(){
    shoppingListEl.innerHTML = '';
}
// Clears the input
function clearInputFieldEl() {
    inputFieldEl.value = "";
}

// Add input values to the list 
function appendItemToShoppingListEl(item) {
    // shoppingListEl.innerHTML += `<li class="items">${item}</li>`;

    //Here we are using create Element instead of innerHTML simply because it allows for us to add more.

    let itemID = item[0]; //Item id
    let itemValue = item[1]; //Item value

    let newEl = document.createElement('li'); //create element

    newEl.textContent = itemValue; //setting the text of the element to be the value
    newEl.classList.add('items'); //setting class for animations

    //This give each item in the DB an event listener that once it has been doubleclicked it will delete the item with the specific ID. ****NOT WORKING****
    newEl.addEventListener('click', function(){
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

        remove(exactLocationOfItemInDB);
        animation();
    })

    shoppingListEl.append(newEl); //Finally appending the new element into the list.

}