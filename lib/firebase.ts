import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

// Exception Rule Applied: Using Firebase Cloud Messaging (FCM) exclusively for notifications.
// All other services (DB, Storage, Hosting) use Cloudflare.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only on the client side
export const initFirebaseApp = () => {
  if (typeof window !== "undefined" && !getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return null;
};

export const requestFCMToken = async () => {
  try {
    const app = initFirebaseApp();
    if (!app) return null;

    const messagingSupported = await isSupported();
    if (!messagingSupported) {
      console.warn("FCM is not supported in this browser.");
      return null;
    }

    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      const currentToken = await getToken(messaging, { 
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY 
      });
      if (currentToken) {
        // Send this token to the Cloudflare Worker API to store in Cloudflare D1
        console.log("FCM Token registered:", currentToken);
        return currentToken;
      } else {
        console.warn("No FCM registration token available.");
      }
    }
  } catch (err) {
    console.error("An error occurred while retrieving token.", err);
  }
  return null;
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    const app = initFirebaseApp();
    if (!app) return;
    
    isSupported().then((supported) => {
      if (supported) {
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
          resolve(payload);
        });
      }
    });
  });
};
