import  {useAuthStore}  from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProtectedRoutes() {


    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);

    
        useEffect(() => {
            // if there no token, user is not authenticated, so redirect to login page
            if (!token) {
                navigate('/');
            }
        }, [token , navigate]);
        
        //if authiticated then rerender the children components
        return null;
    }
    
