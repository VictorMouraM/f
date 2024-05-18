'use client'
import { useContext } from "react";
import { AuthContextData } from "../types/auth"
import AuthContext from "../Context";


const useLogin = (): AuthContextData => {
    const context = useContext(AuthContext);
    return context;
};

export default useLogin;