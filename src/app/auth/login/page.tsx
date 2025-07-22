'use client';

import { supabase } from '@/lib/supabase'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    })
    if (error) console.error(error)
}

export default function Login() {
    const router = useRouter()

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                router.push('/'); // User is logged in, redirect to home

            }
        };

        checkSession();
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome to MemeShare 🎉</h1>
                <p className="mb-6 text-gray-500">Log in to create and explore memes</p>
                <button
                    onClick={handleLogin}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
