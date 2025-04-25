import { NextResponse } from 'next/server';
import { mysqlPool } from '@/utils/db';

const db = mysqlPool.promise();

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product: ' + error.message }, { status: 500 });
  }
}
