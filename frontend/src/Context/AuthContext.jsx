import React, { createContext, useState } from 'react'
export const Auth=createContext();
const AuthContext = ({children}) => {
    const [authUser,setAuthUser]=useState(null);
  return (
    <Auth.Provider value={{authUser,setAuthUser}}>{children}</Auth.Provider>
  )
}

export default AuthContext
