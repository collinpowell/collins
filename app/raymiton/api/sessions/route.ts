import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '../../lib/mongodb';
import Session from '../../lib/Session';
import Transaction from '../../lib/Transaction';

async function getAuthRole() {
  const cookieStore = await cookies();
  const session = cookieStore.get('raymiton_session');
  if (!session?.value) return null;
  if (session.value === 'authenticated-admin') return 'admin';
  if (session.value === 'authenticated-employee') return 'employee';
  return null;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const role = await getAuthRole();
    if (!role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active');

    if (activeOnly === 'true') {
      const active = await Session.findOne({ status: 'OPEN' }).sort({ startTime: -1 });
      return NextResponse.json(active);
    }

    const sessions = await Session.find().sort({ date: -1 });
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const role = await getAuthRole();
    if (role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { openingBalance, date } = body;

    // Check for active session
    const active = await Session.findOne({ status: 'OPEN' });
    if (active) {
      return NextResponse.json({ error: 'A session is already open' }, { status: 400 });
    }

    const session = new Session({
      date: date || new Date().toISOString().split('T')[0],
      openingBalance: openingBalance || 0,
      openedBy: 'Admin',
      status: 'OPEN',
    });

    await session.save();
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to open day' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const role = await getAuthRole();
    if (role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { actualCashAtClose, sessionId } = body;

    const session = await Session.findById(sessionId);
    if (!session || session.status === 'CLOSED') {
      return NextResponse.json({ error: 'Session not found or already closed' }, { status: 404 });
    }

    // Calculate Summary
    const transactions = await Transaction.find({
      date: { 
        $gte: new Date(session.date + 'T00:00:00.000Z'),
        $lte: new Date(session.date + 'T23:59:59.999Z')
      }
    });

    const summary = {
      totalIncome: transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amountPaid, 0),
      totalExpense: transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.totalCharged, 0),
      cashIncome: transactions.filter(t => t.type === 'INCOME' && t.paymentMethod === 'Cash').reduce((s, t) => s + t.amountPaid, 0),
      transferIncome: transactions.filter(t => t.type === 'INCOME' && t.paymentMethod === 'Transfer').reduce((s, t) => s + t.amountPaid, 0),
      posIncome: transactions.filter(t => t.type === 'INCOME' && t.paymentMethod === 'POS').reduce((s, t) => s + t.amountPaid, 0),
    };

    session.status = 'CLOSED';
    session.closingBalance = session.openingBalance + summary.totalIncome - summary.totalExpense;
    session.actualCashAtClose = actualCashAtClose;
    session.endTime = new Date();
    session.summary = summary;
    session.closedBy = 'Admin';

    await session.save();
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to close day' }, { status: 500 });
  }
}
