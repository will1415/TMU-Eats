import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  getDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYa6kBVdSja_AgTSzVzekC0Pul7u-7NvE",
  authDomain: "tmu-eats.firebaseapp.com",
  projectId: "tmu-eats",
  storageBucket: "tmu-eats.appspot.com",
  messagingSenderId: "875772432483",
  appId: "1:875772432483:web:f8dea098c129eff6fbe856",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error("This is an error: " + err);
    alert(err.message);
  }
};

const getUserOrderHistory = async () => {
  const user = getAuth().currentUser;

  try {
    const q = query(
      collection(db, "orderhistory"),
      where("uid", "==", user.uid)
    );
    const docs = await getDocs(q);
    return docs.docs;
  } catch (err) {
    alert(err.message);
  }
};

const addOrderHistory = async (foodArray, restaurant, totalPrice) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    await addDoc(collection(db, "orderhistory"), {
      uid: user.uid,
      itemsOrdered: foodArray,
      email: user.email,
      restaurant: restaurant,
      totalPrice: totalPrice,
      date: new Date().toLocaleDateString(),
    });
  } catch (err) {
    console.error("This is an error: " + err);
    alert(err.message);
  }
};

const getRest = async (restName) => {
  const data = doc(db, "restaurants", restName);
  const snap = await getDoc(data);
  console.log(snap.data());
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = async () => {
  await signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getRest,
  addOrderHistory,
  getUserOrderHistory,
};
