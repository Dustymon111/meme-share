export const checkUsernameExists = async (username: string): Promise<boolean> => {
    const res = await fetch('/api/auth/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });

    if (!res.ok) throw new Error('Failed to check username');

    const { exists } = await res.json();
    return exists;
};