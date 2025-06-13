import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCgakQnDEg4FG0vqCk1dBEPIfOy1W0pYZ4",
  authDomain: "currency-converter-8eba1.firebaseapp.com",
  // ...the rest of your config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
