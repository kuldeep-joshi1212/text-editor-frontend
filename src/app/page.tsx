'use client'

import {useUser} from "@clerk/nextjs";
import {useEffect} from "react";


export default function Home() {
  const {user}=useUser();
  

  useEffect(()=>{
    window.location.href="/home";
  },[user?.id])

  
  return (
    <div>
      

       </div>
    
  );
}
