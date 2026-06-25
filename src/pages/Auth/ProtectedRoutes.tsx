import  {useAuthStore}  from "../../store/auth.store";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoutes() {

    if (!useAuthStore.getState().token) {
        useAuthStore.getState().logout()// Clear the auth store
        //then navigate to login page
        const navigate = useNavigate();
        navigate('/login');
    }
    else {
        return null; // or return the protected component
    }

}