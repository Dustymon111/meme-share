// lib/hooks/useAuthRedirect.ts
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const useAuthRedirect = () => {
    const router = useRouter()

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) router.push('/auth/login')
        }

        checkSession()
    }, [])
}