'use client'
import api from "@/services/api";
import AuthContext from "@/src/Context";
import { LoginCredentials } from "@/src/types/auth";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react"

type AuthProviderProps = {
    children: ReactNode
}

type AuthState = {
    token: string;
    user_id?: number;
}

const AuthProvider = ({children}: AuthProviderProps) => {
  const pathname = usePathname();  
  const searchParams = useSearchParams(); 
  const router = useRouter();
  const [origin, setOrigin] = useState("/");  
  const [data, setData] = useState<AuthState | undefined>(() => {
    if (typeof window === "undefined") return {} as AuthState;
    const token = localStorage.getItem("@finsys:token");
    const user_id = localStorage.getItem("@finsys:user_id");
    if (token && user_id) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token };
    }
  });  
  useEffect (() => {
    if (
      !data?.token && 
      pathname !== "/signin" && //verificar
      pathname !== "/signup"
    ) {
        setOrigin(pathname);
        router.replace("/signin");
    }
  }, [data, pathname]);
  const login = useCallback(
    async ({ username, password }: LoginCredentials) => {
      const response = await api.post("/login", {
        username, 
        password,
      });
      const {token, user_id} = response.data;
      localStorage.setItem("@finsys:token", token);
      localStorage.setItem("@finsys:user_id", user_id);
      api.defaults.headers.authorization = `Bearer ${token}`;
      router.replace(origin);
      if(!token) {
        setData(undefined);
      }
      setData({ token, user_id });
    }, 
    [origin, pathname]
  );
  const logout = useCallback(() => {
    localStorage.removeItem("@finsys:token");
    localStorage.removeItem("@finsys:user_id");
    delete api.defaults.headers.authorization;
    setData(undefined);
  },[]);

  return (
    <AuthContext.Provider value={{ login, logout }}> 
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;