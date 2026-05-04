import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '../../lib/mongodb';
import Transaction from '../../lib/Transaction';

async function getAuthRole() {
  const cookieStore = await cookies();
  const session = cookieStore.get('raymiton_session');
  if (!session?.value) return null;
  if (session.value === 'authenticated-admin') return 'admin';
  if (session.value === 'authenticated-employee') return 'employee';
  return null;
}

// GET dashboard metrics
export async function GET() {
  try {
    if ((await getAuthRole()) !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const transactions = await Transaction.find({});

    let totalRevenue = 0;
    let totalExpenses = 0;
    let barRevenue = 0;
    let barExpenses = 0;
    let snookerRevenue = 0;
    let roomRevenue = 0;
    let totalOutstanding = 0;

    for (const t of transactions) {
      if (t.type === 'INCOME') {
        totalRevenue += t.amountPaid;

        if (t.category === 'Bar') {
          if (t.isSnooker) {
            snookerRevenue += t.amountPaid;
          } else {
            barRevenue += t.amountPaid;
          }
        }

        if (t.category === 'Rooms') {
          roomRevenue += t.amountPaid;
        }

        if (t.balanceOwed > 0) {
          totalOutstanding += t.balanceOwed;
        }
      } else {
        totalExpenses += t.totalCharged;

        if (t.category === 'Bar') {
          barExpenses += t.totalCharged;
        }
      }
    }

    return NextResponse.json({
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      barRevenue,
      barExpenses,
      barProfit: barRevenue - barExpenses,
      snookerRevenue,
      roomRevenue,
      totalOutstanding,
      transactionCount: transactions.length,
    });
  } catch (error) {
    console.error('GET /api/metrics error:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
