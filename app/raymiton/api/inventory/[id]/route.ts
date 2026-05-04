import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '../../../lib/mongodb';
import InventoryItem from '../../../lib/InventoryItem';

async function getAuthRole() {
  const cookieStore = await cookies();
  const session = cookieStore.get('raymiton_session');
  if (!session?.value) return null;
  if (session.value === 'authenticated-admin') return 'admin';
  if (session.value === 'authenticated-employee') return 'employee';
  return null;
}

// PUT - update inventory item (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if ((await getAuthRole()) !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    await connectDB();
    
    const updatedItem = await InventoryItem.findByIdAndUpdate(id, data, { new: true });
    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('PUT /api/inventory error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

// DELETE - remove inventory item (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if ((await getAuthRole()) !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    
    const deletedItem = await InventoryItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/inventory error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
