'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkUsernameExists } from '@/lib/api/user';
import { supabase } from '@/lib/supabase';

export default function SetupUsername() {
    const [username, setUsername] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (avatarFile) {
            const url = URL.createObjectURL(avatarFile);
            setAvatarPreview(url);
            return () => URL.revokeObjectURL(url); // Cleanup
        } else {
            setAvatarPreview(null);
        }
    }, [avatarFile]);

    const handleChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        setIsLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;
            if (!user) {
                setError('Not logged in');
                return;
            }

            const exists = await checkUsernameExists(username);
            if (exists) {
                setError('Username is already taken');
                return;
            }

            let avatarUrl = '';

            if (avatarFile) {
                const filePath = `${user.id}-${Date.now()}`;
                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, avatarFile, {
                        cacheControl: '3600',
                        upsert: true,
                    });

                if (uploadError) {
                    console.error(uploadError);
                    setError('Failed to upload avatar');
                    return;
                }

                const { data: publicData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                avatarUrl = publicData?.publicUrl || '';
            }

            const { error: dbError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    username,
                    avatar_url: avatarUrl,
                });

            if (dbError) {
                console.error(dbError);
                setError('Failed to save user profile');
                return;
            }

            router.push('/');
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded">
            <h2 className="text-xl font-semibold mb-4">Choose your username</h2>

            {/* Avatar upload + preview */}
            <div className="flex justify-center mb-4">
                <label htmlFor="avatar-input" className="cursor-pointer">
                    <div className="w-24 h-24 rounded-full overflow-hidden border hover:ring-2 hover:ring-blue-400 transition">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                                <img src="/image-placeholder.png" alt="placeholder" />
                            </div>
                        )}
                    </div>
                </label>
                <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    className="hidden"
                />
            </div>


            <form onSubmit={handleChange}>
                <input
                    type="text"
                    placeholder="your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />


                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
}
