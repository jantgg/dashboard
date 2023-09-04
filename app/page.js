"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import "./page.css";
import fondo from "./images/fondo.jpg";
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';


export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
    
  useEffect(() => {
      setIsMounted(true);
  }, []);

  let router;
  if (isMounted) {
      router = useRouter();
  }
 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  

  const handleLogin = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: username,
                password: password,
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token); 
            toast(data.message, { type: 'success' });
            router.push('/resumen');
        } else {
            throw new Error(data.message);
        }

    } catch (error) {
        toast(error.message, { type: 'error' });
        console.error("Error logging in:", error);
    }
};


  return (
    <main className="home-login">
      <Image
        src={fondo}
        alt="Background Image sand"
        fill
        quality={70}
        className="image-background"
      />
      <Toaster /> {/* Asegúrate de incluir Toaster en tu componente */}
      <div className="parent-login">
        <div className="tittle-login">Login </div>
        <input 
          type="text" 
          placeholder="Usuario" 
          className="input-login" 
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          className="input-login" 
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="btn-login" onClick={handleLogin}>Enviar</button>
      </div>
    </main>
  );
}
