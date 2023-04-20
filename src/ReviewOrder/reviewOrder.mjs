import { addOrder, updateStudentTigerBucks, updateItemSupply } from "../firebase.js";
let orderItems = null
let student = JSON.parse(localStorage.getItem('student'))
let order = {
    orderItems: null,
    orderTimestamp: localStorage.getItem('date'),
    orderName: student.Name,
    orderFacilitator: student.HalftimeFacilitator

}
//Get order from local storage
if(localStorage.getItem('order') != null){
    orderItems = JSON.parse(localStorage.getItem('order'))
    order.orderItems = orderItems
    console.log(order)
    loadShopCart()
} else{
    window.location.href = "/NewTigerStore/"
}

function loadShopCart(){
    const table = document.getElementById('shop-cart')
    orderItems.forEach(item => {
       
        for (let index = 0; index < item.itemCount; index++) {
            let newEntry = document.createElement('tr')
            let orderItemName = document.createElement('td')
            orderItemName.textContent = item.itemName
            let orderItemCost = document.createElement('td')
            orderItemCost.textContent = item.itemPrice
            table.appendChild(newEntry)
            newEntry.appendChild(orderItemName)
            newEntry.appendChild(orderItemCost)
            
        }
        
    });
}

const submitOrderBtn = document.getElementById('submit-order');
submitOrderBtn.addEventListener('click', async () => {
    await addOrder(order)
    await updateStudentTigerBucks(student.TigerBucks);
     //Update inventory
    var updateSupplies = new Promise((resolve, reject) => {
        order.orderItems.forEach(async (item, index, array) => {
            await updateItemSupply(item.itemName, item.itemCount)
            if(index === array.length -1 ){
                resolve()
            }
        })
    })
    updateSupplies.then(() => {
        localStorage.removeItem('order')
        localStorage.removeItem('student')
        localStorage.removeItem('date')
        window.location.href = "/NewTigerStore/"
    })

   
})