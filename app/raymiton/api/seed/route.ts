import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '../../lib/mongodb';
import Transaction from '../../lib/Transaction';
import { SEED_DATA } from '../../lib/seed-data';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get('raymiton_session');
  return session?.value === 'authenticated';
}

// POST - seed database with initial spreadsheet data
export async function POST() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const existingCount = await Transaction.countDocuments();

    if (existingCount > 0) {
      return NextResponse.json({
        message: `Database already has ${existingCount} transactions. Skipping seed.`,
        seeded: false,
        count: existingCount,
      });
    }

    const transactions = SEED_DATA.map((item) => {
      const balanceOwed = Math.max(0, item.totalCharged - item.amountPaid);
      let status = 'Paid';
      if (balanceOwed > 0 && item.amountPaid > 0) status = 'Part Payment';
      else if (balanceOwed > 0) status = 'Not Paid';

      return {
        ...item,
        date: new Date(item.date),
        balanceOwed,
        status,
        isSnooker: item.isSnooker || false,
      };
    });

    await Transaction.insertMany(transactions);

    return NextResponse.json({
      message: `Successfully seeded ${transactions.length} transactions`,
      seeded: true,
      count: transactions.length,
    });
  } catch (error) {
    console.error('POST /api/seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
