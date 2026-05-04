import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '../../lib/mongodb';
import Transaction from '../../lib/Transaction';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get('raymiton_session');
  return session?.value === 'authenticated';
}

// GET all transactions with optional filters
export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
    const roomNumber = searchParams.get('roomNumber');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (roomNumber) filter.roomNumber = parseInt(roomNumber);

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate + 'T23:59:59.999Z');
    }

    const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('GET /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

// POST - create new transaction
export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Auto-calculate balance and status
    const balanceOwed = Math.max(0, body.totalCharged - body.amountPaid);
    let status = 'Paid';
    if (balanceOwed > 0 && body.amountPaid > 0) status = 'Part Payment';
    else if (balanceOwed > 0) status = 'Not Paid';

    const transaction = new Transaction({
      ...body,
      date: new Date(body.date),
      balanceOwed,
      status,
    });

    await transaction.save();

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('POST /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
