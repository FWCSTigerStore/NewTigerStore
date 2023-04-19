import { async } from '@firebase/util';
import { loadStudents, loadOrders, updateStudentTigerBucksTeacher, clearOrders, addStudent, getItems, addItem, editItem, deleteItem, deleteOrder } from '../firebase.js';

const ORDER_TABLE = document.getElementById('orderTable');
const CLEAR_ORDERS = document.getElementById('clear-orders');

const SIXTH_GRADE = document.getElementById('sixthGrade');
const SEVENTH_GRADE = document.getElementById('seventhGrade');
const EIGHTH_GRADE = document.getElementById('eigthGrade');
const ADD_STUDENT = document.getElementById('add-student');
const SHOW_ADD_STUDENT_PROMPT = document.getElementById('show-add-student-prompt');

const ITEMS_TABLE = document.getElementById('itemsTable');
const SHOW_ADD_ITEM_PROMPT = document.getElementById('show-add-item-prompt');
const ADD_ITEM = document.getElementById('add-item');
const EDIT_ITEM_PROMPT = document.getElementById('edit-item-prompt');
const EDIT_ITEM = document.getElementById('edit-item');

const TABS_BUTTONS = document.querySelectorAll('.tablink');

let items = [];

//Wait for firebase to load
window.addEventListener('load', async function() {
    //Load the students
    let students = await loadStudents();
    //Load the orders
    let orders = await loadOrders();
    //Load the items
    items = await getItems();
    console.log(students,"students");
    console.log(orders,"orders");
    console.log(items,"items");

    load_orders(orders);
    
    load_students(students);

    load_items();

});

function load_orders(orders) {
    //Loop through the orders
    for (let i = 0; i < orders.length; i++) {
        //Get the order
        let order = orders[i];
        //Create a row
        let row = ORDER_TABLE.insertRow(-1);
        //Create the cells
        let timeCell = row.insertCell(0);
        let nameCell = row.insertCell(1);
        let facilitatorCell = row.insertCell(2);
        let itemOneCell = row.insertCell(3);
        let itemTwoCell = row.insertCell(4);
        let itemThreeCell = row.insertCell(5);
        let buttonsCell = row.insertCell(6);

        //Create the buttons
        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Delete";
        deleteButton.classList.add('action-btn');
        deleteButton.setAttribute('data-order-id', order.orderId);
        deleteButton.addEventListener('click', deleteOrderHandler);
        buttonsCell.appendChild(deleteButton);

        //Fill the cells
        timeCell.innerHTML = order.orderTimestamp;
        nameCell.innerHTML = order.orderName;
        facilitatorCell.innerHTML = order.orderFacilitator;
        itemOneCell.innerHTML = (order.orderItems[0]) ? order.orderItems[0].itemName : "None";
        itemTwoCell.innerHTML = (order.orderItems[1]) ? order.orderItems[1].itemName : "None";
        itemThreeCell.innerHTML = (order.orderItems[2]) ? order.orderItems[2].itemName : "None";
    
    }
}

function load_students(students){
    //Loop through the students map
    for (let i = 0; i < students.length; i++) {
        //Get the student
        let student = students[i];
        console.log(student, "student");
       
        const tigerInputElement = document.createElement('input');
        tigerInputElement.setAttribute('data-email', student.Email);
        tigerInputElement.setAttribute('type', 'number');
        tigerInputElement.setAttribute('value', student.TigerBucks);
        tigerInputElement.setAttribute('min', '0');
        console.log(tigerInputElement, "tigerInputElement");
        tigerInputElement.addEventListener('change', async function() {
            //Get the new tiger bucks value
            let newTigerBucks = tigerInputElement.value;
            //Get the student email
            let studentEmail = tigerInputElement.getAttribute('data-email');
            //Update the student
            await updateStudentTigerBucksTeacher(studentEmail, newTigerBucks);
        });

        //Check grade level
        if (student.Grade == "6") {
            //Create a row
            let row = SIXTH_GRADE.insertRow(-1);
            //Create the cells
            let nameCell = row.insertCell(0);
            let tigerBucksCell = row.insertCell(1);
            //Fill the cells
            nameCell.innerHTML = student.Name;
            tigerBucksCell.appendChild(tigerInputElement);
        }
        else if (student.Grade == "7") {
            //Create a row
            let row = SEVENTH_GRADE.insertRow(-1);
            //Create the cells
            let nameCell = row.insertCell(0);
            let tigerBucksCell = row.insertCell(1);
            //Fill the cells
            nameCell.innerHTML = student.Name;
            tigerBucksCell.appendChild(tigerInputElement);
        }
        else if (student.Grade == "8") {
            //Create a row
            let row = EIGHTH_GRADE.insertRow(-1);
            //Create the cells
            let nameCell = row.insertCell(0);
            let tigerBucksCell = row.insertCell(1);
            //Fill the cells
            nameCell.innerHTML = student.Name;
            //Add the input element
            tigerBucksCell.appendChild(tigerInputElement);
        }
    }
}

function load_items() {
    //Loop through the items
    items.forEach((item) => {
        
        //Create a row
        let row = ITEMS_TABLE.insertRow(-1);
        //Create the cells
        let nameCell = row.insertCell(0);
        let priceCell = row.insertCell(1);
        let quantityCell = row.insertCell(2);
        let typeCell = row.insertCell(3);
        let imageCell = row.insertCell(4);
        let editCell = row.insertCell(5);
        //Fill the cells
        nameCell.innerHTML = item.Name;
        priceCell.innerHTML = item.Price;
        quantityCell.innerHTML = item.InventoryAmount;
        typeCell.innerHTML = item.ItemType;
        let image = document.createElement('img');
        image.setAttribute('src', item.Image);
        image.setAttribute('width', '100px');
        imageCell.appendChild(image);
        let editButton = document.createElement('button');
        editButton.innerHTML = "Edit";
        editButton.classList.add('action-btn');
        editButton.setAttribute('data-item-id', item.Name);
        editButton.addEventListener('click', editItemHandler);
        editCell.appendChild(editButton);
        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Delete";
        deleteButton.classList.add('action-btn');
        deleteButton.setAttribute('data-item-id', item.Name);
        deleteButton.addEventListener('click', deleteItemHandler);
        editCell.appendChild(deleteButton);
        

    })
}

CLEAR_ORDERS.addEventListener('click', async function() {
    await clearOrders();
    location.reload();
});

ADD_STUDENT.addEventListener('click', async function() {
    console.log("Add Student");
    //Get the student name
    let studentName = document.getElementById('student-name').value;
    //Get the student email
    let studentEmail = document.getElementById('student-email').value;
    //Get the student grade
    let studentGrade = document.getElementById('student-grade').value;
    //Get the student halftime facilitator
    let studentFacilitator = document.getElementById('student-facilitator').value;
    //Get if the student has trust card
    let studentTrustCard = document.getElementById('student-trust-card').checked;
    //Get the student tiger bucks
    let studentTigerBucks = document.getElementById('student-bucks').value;

    //Create the student object
    let student = {
        Name: studentName,
        Email: studentEmail,
        Grade: studentGrade,
        HalftimeFacilitator: studentFacilitator,
        TigerBucks: studentTigerBucks,
        hasTrustCard: studentTrustCard
    };
    console.log(student, "student");

    //Check that none of the fields are empty
    if (studentName == "" || studentEmail == "" || studentGrade == "" || studentFacilitator == "" || studentTigerBucks == "") {
        alert("Please fill out all fields");
        return;
    }

    //Add the student to the database
    await addStudent(student);
    //Reload the page
    location.reload();
});

SHOW_ADD_STUDENT_PROMPT.addEventListener('click', function() {
    //Show the add student prompt
    document.getElementById('add-student-prompt').classList.remove('inactive');
    document.getElementById('add-student-prompt').classList.add('active');
    //if has hidden class, remove it
    if (document.getElementById('add-student-prompt').classList.contains('hidden')) {
        document.getElementById('add-student-prompt').classList.remove('hidden');
    }
});

SHOW_ADD_ITEM_PROMPT.addEventListener('click', function() {
    //Show the add item prompt
    document.getElementById('add-item-prompt').classList.remove('inactive');
    document.getElementById('add-item-prompt').classList.add('active');
    //if has hidden class, remove it
    if (document.getElementById('add-item-prompt').classList.contains('hidden')) {
        document.getElementById('add-item-prompt').classList.remove('hidden');
    }
})  

ADD_ITEM.addEventListener('click', async function() {
    //Get the item name
    let itemName = document.getElementById('item-name').value;
    //Get the item price
    let itemPrice = document.getElementById('item-price').value;
    //Get the item quantity
    let itemQuantity = document.getElementById('item-quantity').value;
    //Get the item type
    let itemType = document.getElementById('item-type').value;
    //Get the item image
    let itemImage = document.getElementById('item-image').files[0];

    //Check that none of the fields are empty
    if (itemName == "" || itemPrice == "" || itemQuantity == "" || itemImage == "") {
        alert("Please fill out all fields");
        return;
    }

    //Create the item object
    let item = {
        Name: itemName,
        Price: itemPrice,
        InventoryAmount: itemQuantity,
        ItemType: itemType
    };

    //Add the item to the database
    await addItem(item, itemImage);
    //Reload the page
    location.reload();
})

function showEditItemPrompt() {
    //Show the edit item prompt
    EDIT_ITEM_PROMPT.classList.remove('inactive');
    EDIT_ITEM_PROMPT.classList.add('active');
    //if has hidden class, remove it
    if (EDIT_ITEM_PROMPT.classList.contains('hidden')) {
        EDIT_ITEM_PROMPT.classList.remove('hidden');
    }
}

EDIT_ITEM.addEventListener('click', async function() {
    //Get the item name
    let itemName = document.getElementById('edit-item-name').value;
    //Get the item price
    let itemPrice = document.getElementById('edit-item-price').value;
    //Get the item quantity
    let itemQuantity = document.getElementById('edit-item-quantity').value;
    //Get the item type
    let itemType = document.getElementById('edit-item-type').value;
    //Get the item image
    let itemImage = document.getElementById('edit-item-image').files[0];

    //Check that none of the fields are empty
    if (itemName == "" || itemPrice == "" || itemQuantity == "") {
        alert("Please fill out all fields");
        return;
    }

    //Create the item object
    let item = {
        Name: itemName,
        Price: itemPrice,
        InventoryAmount: itemQuantity,
        ItemType: itemType
    };

    let changedImage = false;
    if (itemImage != undefined) {
        changedImage = true;
        console.log("changed image");
    }

    //Add the item to the database
    await editItem(item, itemImage, changedImage);
    //Reload the page
    location.reload();
})

async function editItemHandler(e){
    //Get the item id
    let itemId = e.target.getAttribute('data-item-id');
    //Get the item
    let item = items.get(itemId);
    console.log(item, "item");
    //Set the item name
    document.getElementById('edit-item-name').value = item.Name;
    //Set the item price
    document.getElementById('edit-item-price').value = item.Price;
    //Set the item quantity
    document.getElementById('edit-item-quantity').value = item.InventoryAmount;
    //Set the item type
    document.getElementById('edit-item-type').value = item.ItemType;
    

    //Show the edit item prompt
    showEditItemPrompt();
}

async function deleteItemHandler(e){
    //Get the item id
    let itemId = e.target.getAttribute('data-item-id');
    //Delete the item
    await deleteItem(itemId);
    //Reload the page
    location.reload();
}

async function deleteOrderHandler(e){
    //Get the order id
    let orderId = e.target.getAttribute('data-order-id');
    //Delete the order
    await deleteOrder(orderId);
    //Reload the page
    location.reload();
}

TABS_BUTTONS.forEach(button => {
    button.addEventListener('click', function() {
        console.log(button.getAttribute('data-tab'));
        //Remove active class from all buttons
        TABS_BUTTONS.forEach(button => {
            button.classList.remove('selected');
        });
        //Add active class to the clicked button
        button.classList.add('selected');

       document.querySelectorAll('.tab').forEach(tab => {
            if(tab.classList.contains('visible')){
              tab.classList.remove('visible');
              tab.classList.add('invisible');
            }

         });
        //Add active class to the clicked tab
        document.querySelector("." + button.getAttribute('data-tab')).classList.add('visible');
        document.querySelector("." + button.getAttribute('data-tab')).classList.remove('invisible');
    })
})