

import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword,
         getAuth, 
         signInWithEmailAndPassword,
         signOut} from "firebase/auth";
import { addDoc,
         collection,
         getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";
const firebaseConfig = {
  apiKey: "AIzaSyAZ2lEgjopxRW78SHF7nMfj6VKixq8NSKY",
  authDomain: "netflix-clone-b2cdb.firebaseapp.com",
  projectId: "netflix-clone-b2cdb"  ,
  storageBucket: "netflix-clone-b2cdb.firebasestorage.app",
  messagingSenderId: "484278766731",
  appId: "1:484278766731:web:0327eac5513bde9065d88e"
};



const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);

const signup=async(name,email,password)=>{
    try{
     const res=await createUserWithEmailAndPassword(auth,email,password);
     const user=res.user;
     await addDoc(collection(db,"user"),{
        uid:user.uid,
        name,
        authProvider:"local",
        email
     })
    }catch(error){
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(" "))
    }
}

const login=async (email,password)=>{
    try{
      await  signInWithEmailAndPassword(auth,email,password)
    }catch(error){
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(" "))
    }
}

const logout=()=>{
    signOut(auth)
}

export {auth,db,login,signup,logout}