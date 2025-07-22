// hooks/useAuthRedirectIfNoUsername.ts
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function useAuthRedirectIfNoUsername() {
    const router = useRouter();

    useEffect(() => {
        const check = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;
            if (!user) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .maybeSingle();

            if (!data || !data.username) {
                // Redirect if username is missing or user doesn't exist in table
                router.push('/auth/setup-username');
            }
        };

        check();
    }, []);
}
