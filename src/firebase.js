import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, getFirestore, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyAZ2lEgjopxRW78SHF7nMfj6VKixq8NSKY",
  authDomain: "netflix-clone-b2cdb.firebaseapp.com",
  projectId: "netflix-clone-b2cdb",
  storageBucket: "netflix-clone-b2cdb.firebasestorage.app",
  messagingSenderId: "484278766731",
  appId: "1:484278766731:web:0327eac5513bde9065d88e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    const user = res.user
    await addDoc(collection(db, "user"), {
      uid: user.uid, name, authProvider: "local", email
    })
  } catch (error) {
    toast.error(error.code.split('/')[1].split('-').join(" "))
  }
}

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    toast.error(error.code.split('/')[1].split('-').join(" "))
  }
}

const logout = () => signOut(auth)

// Add to watchlist
const addToWatchlist = async (userId, movie) => {
  try {
    await addDoc(collection(db, "watchlist"), {
      userId,
      movieId: movie.id,
      title: movie.title || movie.name,
      poster: movie.backdrop_path || movie.poster_path,
      overview: movie.overview,
      addedAt: new Date()
    })
    toast.success("Added to watchlist!")
  } catch (error) {
    toast.error("Failed to add to watchlist")
  }
}

// Get watchlist
const getWatchlist = async (userId) => {
  try {
    const q = query(collection(db, "watchlist"), where("userId", "==", userId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }))
  } catch (error) {
    return []
  }
}

// Remove from watchlist
const removeFromWatchlist = async (docId) => {
  try {
    await deleteDoc(doc(db, "watchlist", docId))
    toast.info("Removed from watchlist")
  } catch (error) {
    toast.error("Failed to remove")
  }
}

// Check if in watchlist
const isInWatchlist = async (userId, movieId) => {
  try {
    const q = query(collection(db, "watchlist"),
      where("userId", "==", userId),
      where("movieId", "==", movieId))
    const snapshot = await getDocs(q)
    return !snapshot.empty ? snapshot.docs[0].id : null
  } catch {
    return null
  }
}

export { auth, db, login, signup, logout, addToWatchlist, getWatchlist, removeFromWatchlist, isInWatchlist }