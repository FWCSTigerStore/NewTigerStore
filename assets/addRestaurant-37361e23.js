import{c,u as i,d as s}from"./firebase-b3471a88.js";/* empty css              */let n=null,m=JSON.parse(localStorage.getItem("student")),a={orderItems:null,orderTimestamp:localStorage.getItem("date"),orderName:m.Name,orderFacilitator:m.HalftimeFacilitator};localStorage.getItem("order")!=null?(n=JSON.parse(localStorage.getItem("order")),a.orderItems=n,console.log(a),u()):window.location.href="/";function u(){const d=document.getElementById("shop-cart");n.forEach(t=>{for(let l=0;l<t.itemCount;l++){let e=document.createElement("tr"),r=document.createElement("td");r.textContent=t.itemName;let o=document.createElement("td");o.textContent=t.itemPrice,d.appendChild(e),e.appendChild(r),e.appendChild(o)}})}const p=document.getElementById("submit-order");p.addEventListener("click",async()=>{await c(a),await i(m.TigerBucks);var d=new Promise((t,l)=>{a.orderItems.forEach(async(e,r,o)=>{await s(e.itemName,e.itemCount),r===o.length-1&&t()})});d.then(()=>{localStorage.removeItem("order"),localStorage.removeItem("student"),localStorage.removeItem("date"),window.location.href="/"})});
