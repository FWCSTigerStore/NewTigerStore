import { signOutUser, getItems, getItemTypes, getStudent } from "./firebase.js";

//Get when l key is pressed
document.addEventListener('keydown', (event) => {
    if(event.key == 'l'){
        signOutUser();
    }
});
const items = document.querySelectorAll('.shopItem')
let student = {
    Name: "",
    halftimeFacilitator: "",
    tigerBucks: 0
}
const bucksCountlbl = document.getElementById('bucks-count')

//Delay until firebase is loaded
setTimeout(async() => {

    student = await getStudent();
    console.log(student, "student")
    bucksCountlbl.textContent = `${student.TigerBucks} Tiger Bucks`
}, 1000);
let itemMaxes = [{type: "", max: 0}]

let itemList = new Map()

async function fillVariables(){
    itemMaxes = await getItemTypes();
    itemList = await getItems();
    loadShop();
}
fillVariables()
let rafflesBought = 0
let snacksBought = 0
let schoolBought = 0
const date = new Date();
const fullDate = date.toLocaleDateString();
console.log(fullDate)
let currentTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
currentTime = militaryToStandardTime(currentTime)
let timestamp = fullDate + " - " + currentTime;
function militaryToStandardTime(mTime) {
    let time = mTime.split(':'); // convert to array

    // fetch
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    var seconds = Number(time[2]);

    // calculate
    var timeValue;

    if (hours > 0 && hours <= 12) {
    timeValue= "" + hours;
    } else if (hours > 12) {
    timeValue= "" + (hours - 12);
    } else if (hours == 0) {
    timeValue= "12";
    }
    
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
    timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds;  // get seconds
    timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM
    return timeValue
}
let orderItems = []
let numOfItemsBought = 0

function loadShop(){
    console.log(itemList, "item list")
    itemList.forEach((item) => {
        const itemS = document.createElement('section');
        itemS.classList.add('shopItem');
        const itemImageDiv = document.createElement('div');
        itemImageDiv.classList.add('imageDiv');
        const itemImage = document.createElement('img');
        itemImage.classList.add('itemImage');
        itemImage.src = item.Image;
        itemImageDiv.appendChild(itemImage);
        const itemName = document.createElement('label');
        itemName.classList.add('itemName');
        itemName.textContent = item.Name;
        const break1 = document.createElement('br');
        const itemPrice = document.createElement('label');
        itemPrice.classList.add('itemPrice');
        itemPrice.textContent = `${item.Price} Tiger Bucks`;
        const break2 = document.createElement('br');
        const addToCart = document.createElement('button');
        addToCart.classList.add('addToCart');
        addToCart.id = item.Name;
        addToCart.textContent = "Add to Cart";
        addToCart.dataset.type = item.ItemType;
        addToCart.addEventListener('click', (e) => {
            let item = itemList.get(e.target.id)
            let itemType = item.ItemType;
            let itemPrice = item.Price;
           
            console.log(snacksBought)
            
            if(parseInt(itemPrice) > parseInt(student.TigerBucks)){
                alert("You only have " + student.TigerBucks + " tiger bucks and you need " + itemPrice + " tiger bucks") 
                return
            }
            //Check if trust card
            if(item.Name == "Trust Card"){
                orderItems = []
                let itemOrder = {
                    itemName: item.Name,
                    itemCount: 1
                }
                orderItems.push(itemOrder)
                numOfItemsBought = 1
                student.TigerBucks -= itemPrice
                bucksCountlbl.textContent = `${student.TigerBucks} Tiger Bucks`
                alert("You bought " + item.Name + " for " + itemPrice + " tiger bucks!")
                document.getElementById('store').remove()
                document.getElementById('cart').style.visibility = 'visible';
                loadShopCart()
                return
            }

            let itemSupply = item.InventoryAmount
            if(parseInt(itemSupply) <= 0){
                alert("Sorry, we are out of " + item.Name)
                return
            }
            if(itemType == "School"){
                if(schoolBought >= itemMaxes.get("School").Max){
                    alert("You have bought the max number of school items!")
                    return
                }
                schoolBought++
            } else if(itemType == "Snacks"){
                if(snacksBought >= itemMaxes.get("Snacks").Max){
                    alert("You have bought the max number of snacks!")
                    return
                }
            snacksBought++
            } else if(itemType == "Raffle"){
                if(rafflesBought >= itemMaxes.get("Raffle").Max){
                    alert("You have bought the max number of raffle tickets!")
                    return
                }
                rafflesBought++
            }
            
            
            item.InventoryAmount -= 1
            console.log(itemPrice, "item price")
            student.TigerBucks -= itemPrice
            numOfItemsBought++;
            let itemOrder = {
                itemName: item.Name,
                itemCount: 1,
                itemPrice: itemPrice,
            }
            //Check if item is already in order
            let itemInOrder = false
            orderItems.forEach((item) => {
                if(item.itemName == itemOrder.itemName){
                    item.itemCount++
                    itemInOrder = true
                }
            })
            if(!itemInOrder){
                orderItems.push(itemOrder)
            }
            bucksCountlbl.textContent = `${student.TigerBucks} Tiger Bucks`
            alert("You bought " + item.Name + " for " + itemPrice + " tiger bucks!")
            console.log(orderItems)

        })
        itemS.appendChild(itemImageDiv);
        itemS.appendChild(itemName);
        itemS.appendChild(break1);
        itemS.appendChild(itemPrice);
        itemS.appendChild(break2);
        itemS.appendChild(addToCart);
        console.log(item, "item")
        console.log(item.ItemType)
        document.getElementById(item.ItemType).appendChild(itemS);
    })

    // items.forEach((itemO) => {
    //     let itemPriceLabel = itemO.querySelector('.itemPrice')
    //     let item = itemO.querySelector('.addToCart')
    //     console.log(item.id, "item id")
    //     let itemPrice = 0
    //     //check if item is in itemList
    //     if(itemList.get(item.id) != undefined){
    //         itemPrice = itemList.get(item.id).Price
    //         itemPriceLabel.textContent = `${itemPrice} Tiger Bucks`
    //         //Load item image
    //         let itemImage = itemO.querySelector('.itemImage')
    //         itemImage.src = itemList.get(item.id).Image 
            
    //     }
        
    // })
}


//Get when review order button is pressed
const reviewOrderBtn = document.getElementById('reviewOrderBtn');
reviewOrderBtn.addEventListener('click', () => {
    //Save order to local storage
    localStorage.setItem('order', JSON.stringify(orderItems));
    localStorage.setItem('student', JSON.stringify(student));
    localStorage.setItem('date', timestamp);
    window.location.href = '/NewTigerStore/ReviewOrder/';
});