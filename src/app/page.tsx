'use client'

import { EditorView } from "@/components/ui/editor";
import {useUser} from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";


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
