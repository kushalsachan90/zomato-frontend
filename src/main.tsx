
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider } from './context/AppContext.tsx';
import { StrictMode } from 'react';
import 'leaflet/dist/leaflet.css'
import { SocketProvider } from './context/socketContext.tsx';
 export const authService='https://auth-service-wfk5.onrender.com'
 export const RestaurantService='https://restaurant-service-3-5ee2.onrender.com'
  export const UtilsService='https://util-service-61e1.onrender.com';
  export const RealtimeService='https://realtimes-service.onrender.com';
  export const RiderService='https://rider-service-qjlr.onrender.com';
    export const AdminService='https://admin-service-2v05.onrender.com';

createRoot(document.getElementById('root')!).render(

  <StrictMode>

    <GoogleOAuthProvider clientId="791179682935-me9hrs03h59d09mn1utka48n5ragnks5.apps.googleusercontent.com">   
      <AppProvider>
       <SocketProvider>
       
        <App />
        </SocketProvider> 
      </AppProvider>
    
    </GoogleOAuthProvider>

        </StrictMode>,
)    
  