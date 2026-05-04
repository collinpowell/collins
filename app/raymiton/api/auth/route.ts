import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { password, action } = await req.json();

    if (action === 'logout') {
      const cookieStore = await cookies();
      cookieStore.delete('raymiton_session');
      return NextResponse.json({ success: true, message: 'Logged out successfully' });
    }

    const correctPassword = process.env.RAYMITON_PASSWORD || 'Jambmaster11$';

    if (password === correctPassword) {
      // Set a secure HTTP-only cookie that expires in 30 days
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'raymiton_session',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/raymiton',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return NextResponse.json({ success: true, message: 'Login successful' });
    }

    return NextResponse.json({ success: false, message: 'Incorrect password' }, { status: 401 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, message: 'Authentication failed' }, { status: 500 });
  }
}
