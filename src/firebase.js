// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    onSnapshot,getFirestore, doc, query,getDoc,setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField, getDocs, where,arrayUnion
}
from "firebase/firestore"

import {
    signInWithPopup,GoogleAuthProvider,getAuth,reauthenticateWithCredential,EmailAuthProvider,updatePassword, signOut, createUserWithEmailAndPassword, setPersistence, onAuthStateChanged ,signInWithEmailAndPassword, browserSessionPersistence, browserLocalPersistence,updateProfile
} from "firebase/auth";

import { getStorage, ref,getDownloadURL, uploadBytes } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGakOpa3iYRNad0Mc1QSbtv4RTPV0Qqow",
  authDomain: "tigerstore-365021.firebaseapp.com",
  projectId: "tigerstore-365021",
  storageBucket: "tigerstore-365021.appspot.com",
  messagingSenderId: "121005583930",
  appId: "1:121005583930:web:a80e1271bafe05d67f8f03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
let loggedIn = 0;
let user = null;
let loggingIn = false;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log('user logged in: ', user);
        user = user;
        //Check if on login page
        if(window.location.href.includes("SignIn") && !loggingIn){
            let isTeacher = await checkIfTeacher();
            if(isTeacher){
                console.log("Go to teacher page")
                window.location.href = "/NewTigerStore/Teacher/"
            } else {
                console.log("Go to student page")
                window.location.href = "/NewTigerStore/"
            }
        }
        loggedIn = 1;
       
       
        
        
    } else {
        console.log('user logged out');
        //Redirect to login page
        if(!window.location.href.includes("SignIn")){
            window.location.href =  "/NewTigerStore/SignIn/"
        }
        loggedIn = 0;
    }
})

export async function checkIfTeacher(){
    const auth = getAuth();
   //Check if user is in teacher collection
    const teacherRef = collection(db, "Teachers");
    const teacherQuery = query(teacherRef, where("Name", "==", auth.currentUser.displayName));
    const teacherSnapshot = await getDocs(teacherQuery);
    if(teacherSnapshot.empty){
        console.log("User is not a teacher")
        return false
    }
    console.log("User is a teacher")
    return true
  
}

export async function createUser(email, password, onLogin){
    const auth = getAuth();
    loggingIn = true;
    console.log("Emal: " + email + " Password: " + password)
    await createUserWithEmailAndPassword(auth,email, password)
    .then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        updateProfile(auth.currentUser, {
            displayName: email
          }).then(() => {
            // Profile updated!
           
            console.log("Account Created Successfully" + auth.currentUser.displayName)
            onLogin();
            loggingIn = false;
    
        
            
            
          }).catch((error) => {
            // An error occurred
            alert("Error when updating profile. Look in console for more info.")
            console.log("Recieved error: " + error.message + " with error code " + error.code + " when updating profile.")
          });
       
        
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Error when registering account. Look in console for more info.")
        console.log("Recieved error: " + errorMessage + " with error code " + errorCode + " when registering account.")
    });
    
}

export async function signIn(email, password, onLogin){
    const auth = getAuth();
    loggingIn = true;
    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Signed in successfully")
        setPersistence(auth, browserLocalPersistence)
        .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        onLogin()
        loggingIn = false;
        return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });
        
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Error when signing in. Look in console for more info.")
        console.log("Recieved error: " + errorMessage + " with error code " + errorCode + " when signing in.")
    });
}

export async function signInWithGoogle(){
    const auth = getAuth();
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("Signed in with google successfully, user: ", user)
        // IdP data available using getAdditionalUserInfo(result)
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log("Recieved error: " + errorMessage + " with error code " + errorCode + " when signing in with google with email " + email + ".")
    
        // ...
    });
}

export async function signOutUser(){
    const auth = getAuth();
    await signOut(auth).then(() => {
        // Sign-out successful.
        console.log("Signed out successfully")
        
      }).catch((error) => {
        // An error happened.
        alert("Error when signing out. Look in console for more info.")
        console.log("Recieved error: " + error.message + " with error code " + error.code + " when signing out.")
      });
}

export async function getItems() {
    const items = new Map()
    const querySnapshot = await getDocs(collection(db, "Items"));
    for await (const doc of querySnapshot.docs){
        let item = doc.data()
        let id = item.Name
        items.set(id, item)
        //Replace image name spaces with underscores

        let imageName = item.Name.replace(/\s/g, '_');
        //Get item image from storage
        const storageRef = ref(storage, "ItemImages/" + imageName + ".png");
        let imageSrc = await getDownloadURL(storageRef)
        item.Image = imageSrc

        
    };
    console.log(items);
    return items;
}

export async function getItemTypes() {
    const items = new Map()
    const querySnapshot = await getDocs(collection(db, "ItemTypes"));
    querySnapshot.forEach((doc) => {
        let item = doc.data()
        let id = item.Type
        items.set(id, item)
    });
    console.log(items);
    return items;
}

export async function getStudent(){
    //Get current user id
    const auth = getAuth();
    const user = auth.currentUser;
    //Get email of current user
    const email = user.email;
    const docRef = doc(db, "Students", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return docSnap.data();
    }
    else {
        console.log("No such document!");
        return null;
    }

}

export async function addOrder(order){
    //Add Order to Orders collection, which is located in the database
    const docRef = await addDoc(collection(db, "Orders"), order);
    console.log("Document written with ID: ", docRef.id);
    


}

export async function updateStudentTigerBucks(newTigerBucks){
    //Get current user id
    const auth = getAuth();
    const user = auth.currentUser;
    //Get email of current user
    const email = user.email;
    const docRef = doc(db, "Students", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        await updateDoc(docRef, {
            TigerBucks: newTigerBucks
        });
    }
    else {
        console.log("No such document!");
        
    }


    
}

export async function updateItemSupply(itemName, itemCount){
    //Get current user id
    const docRef = doc(db, "Items", itemName);
    const docSnap = await getDoc(docRef);
   
    console.log(itemName)
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
         //Get past supply
         let pastSupply = docSnap.data().InventoryAmount;
         let newSupply = pastSupply - itemCount;
        await updateDoc(docRef, {
            InventoryAmount: newSupply
        });
        console.log("Updated item supply")
    }
    else {
        console.log("No such document!");
        
    }
   
}

export async function loadStudents(){
    const students =[]
    const querySnapshot = await getDocs(collection(db, "Students"));
    querySnapshot.forEach((doc) => {
        let student = doc.data()
        students.push(student)
    });
    console.log(students);
    return students;
}

export async function loadOrders(){
    const orders = []
    const querySnapshot = await getDocs(collection(db, "Orders"));
    querySnapshot.forEach((doc) => {
        let order = doc.data()
        order.orderId = doc.id
        orders.push(order)
    });
    console.log(orders);
    return orders;
}

export async function updateStudentTigerBucksTeacher(email, newTigerBucks){


    const docRef = doc(db, "Students", email);
    const docSnap = await getDoc(docRef);
    console.log(email)
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        await updateDoc(docRef, {
            TigerBucks: newTigerBucks
        });
    }
    else {
        console.log("No such document!");
        
    }

}

export async function clearOrders(){
    const querySnapshot = await getDocs(collection(db, "Orders"));


    for await (const doc of querySnapshot.docs){
        await deleteDoc(doc.ref);
        

    };

    
    console.log("Orders cleared")
}

export async function addStudent(addStudent){
   
    //Create doc with email as id
    const docRef = doc(db, "Students", addStudent.Email);
    //Check if doc exists
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        alert("Student already exists")
    }
    else {
        console.log("No such document!");
        //Add student to Students collection, which is located in the database
        await setDoc(doc(db, "Students", addStudent.Email), addStudent);
        console.log("Document written with ID: ", addStudent.Email);
        alert("Student added successfully")
    }

}

export async function addItem(item, itemImage){
    //Create doc with name as id
    const docRef = doc(db, "Items", item.Name);
    //Check if doc exists
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        alert("Item already exists")
    }
    else {
        console.log("No such document!");
        //Add item to Items collection, which is located in the database
        await setDoc(doc(db, "Items", item.Name), item);
        console.log("Document written with ID: ", item.Name);
        alert("Item added successfully")
        //Replace image name spaces with underscores
        let imageName = item.Name.replace(/\s/g, '_');
        //Add item image to storage
        const storageRef = ref(storage, "ItemImages/" + imageName + ".png");
        await uploadBytes(storageRef, itemImage);
    }

}

export async function editItem(item, itemImage, changedImage){
    //Create doc with name as id
    const docRef = doc(db, "Items", item.Name);
    //Check if doc exists
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        if(changedImage){
            //Replace image name spaces with underscores
            let imageName = item.Name.replace(/\s/g, '_');
            //Add item image to storage
            const storageRef = ref(storage, "ItemImages/" + imageName + ".png");
            await uploadBytes(storageRef, itemImage);
        }
        await updateDoc(docRef, item);
        alert("Item updated successfully")
    }
    else {
        console.log("No such document!");
        alert("Item does not exist")
    }

}

export async function deleteItem(itemName){
    //Create doc with name as id
    const docRef = doc(db, "Items", itemName);
    //Check if doc exists
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        await deleteDoc(docRef);
        alert("Item deleted successfully")
    }
    else {
        console.log("No such document!");
        alert("Item does not exist")
    }

}

export async function deleteOrder(orderId){
    //Create doc with name as id
    const docRef = doc(db, "Orders", orderId);
    //Check if doc exists
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        await deleteDoc(docRef);
        alert("Order deleted successfully")
    }
    else {
        console.log("No such document!");
        alert("Order does not exist")
    }

}