import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '../../../lib/mongodb';
import Transaction from '../../../lib/Transaction';

async function getAuthRole() {
  const cookieStore = await cookies();
  const session = cookieStore.get('raymiton_session');
  if (!session?.value) return null;
  if (session.value === 'authenticated-admin') return 'admin';
  if (session.value === 'authenticated-employee') return 'employee';
  return null;
}

// GET single transaction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if ((await getAuthRole()) !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('GET /api/transactions/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
  }
}

// PUT - update transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if ((await getAuthRole()) !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Auto-calculate balance and status
    const balanceOwed = Math.max(0, body.totalCharged - body.amountPaid);
    let status = 'Paid';
    if (balanceOwed > 0 && body.amountPaid > 0) status = 'Part Payment';
    else if (balanceOwed > 0) status = 'Not Paid';

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      {
        ...body,
        date: new Date(body.date),
        balanceOwed,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('PUT /api/transactions/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

// DELETE transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if ((await getAuthRole()) !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('DELETE /api/transactions/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
