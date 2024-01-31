"use client"

import { createContext, useState, useEffect, useContext, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const Context = createContext<{
  user: User | null;
  id: string | null;
  email: string | null | undefined;
  name: string | null | undefined;
  picture: string | null | undefined;
  singOut: () => Promise<void>;
} | null>(null);

const Provider = ({ children }: {children: React.ReactNode}) => {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null | undefined>(null);
    const [name, setName] = useState<string | null | undefined>(null);
    const [picture, setPicture] = useState<string | null | undefined>('');

    const supabaseClient = createClientComponentClient();

    const getCurrentSession = async () => {
        const res = await supabaseClient.auth.getSession();
        if (res && res.data.session) {
            return res.data.session;
        }
        console.log(res.data.session)
        clearUser()
        return null
    }

    const getCurrentUser = async () => {
        if (id) return
        
        const res = await supabaseClient.auth.getUser()
        if (res && res.data.user) {
            
            const theUser = res.data.user;
            console.log(theUser)
            setUser(theUser);
            setId(theUser.id);
            setEmail(theUser.email);
            setName(theUser.identities![0].identity_data!.name)
            setPicture(theUser.identities![0].identity_data!.picture)
        }
    }


    useEffect(() => {
        const isUser = async () => {
            const currentSession = await getCurrentSession();
            if (currentSession) await getCurrentUser();
        }
        isUser();
    }, [])
    
    const singOut = async () => {
        await supabaseClient.auth.signOut();
        clearUser();
        router.push('/')
    }

    const clearUser = () => {
        setUser(null);
        setId(null);
        setEmail(null);
        setName(null);
        setPicture(null);

    }

    const exposed = { user, id, email, name, picture, singOut };

    return <Context.Provider value={exposed}>{children}</Context.Provider>
}

export const useUser = () => useContext(Context);

export default Provider;