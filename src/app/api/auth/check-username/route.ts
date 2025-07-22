import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!)

export async function POST(req: NextRequest) {
    const { username } = await req.json()

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

    if (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ exists: !!data })

}