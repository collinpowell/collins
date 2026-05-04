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

    const adminPassword = process.env.RAYMITON_PASSWORD || 'Jambmaster11$';
    const employeePassword = process.env.RAYMITON_EMPLOYEE_PASSWORD || '12345678';

    let role = null;
    if (password === adminPassword) {
      role = 'admin';
    } else if (password === employeePassword) {
      role = 'employee';
    }

    if (role) {
      // Set a secure HTTP-only cookie that expires in 30 days
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'raymiton_session',
        value: `authenticated-${role}`,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/raymiton',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return NextResponse.json({ success: true, message: 'Login successful', role });
    }

    return NextResponse.json({ success: false, message: 'Incorrect password' }, { status: 401 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, message: 'Authentication failed' }, { status: 500 });
  }
}
