import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '../../lib/mongodb';
import InventoryItem from '../../lib/InventoryItem';

async function getAuthRole() {
  const cookieStore = await cookies();
  const session = cookieStore.get('raymiton_session');
  if (!session?.value) return null;
  if (session.value === 'authenticated-admin') return 'admin';
  if (session.value === 'authenticated-employee') return 'employee';
  return null;
}

// GET all inventory items
export async function GET() {
  try {
    const role = await getAuthRole();
    if (!role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const items = await InventoryItem.find({}).sort({ name: 1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('GET /api/inventory error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

// POST - add new inventory item (Admin only)
export async function POST(request: NextRequest) {
  try {
    if ((await getAuthRole()) !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    await connectDB();
    
    const newItem = await InventoryItem.create(data);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/inventory error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Item with this name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
