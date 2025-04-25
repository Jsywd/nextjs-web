import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

const db = mysqlPool.promise()

export async function GET(request){
    try {
        const [rows, fields] = await db.query(
            'SELECT * FROM products'
        )
        return NextResponse.json(rows, {status: 200})
    } catch (error){
        return NextResponse.json({error:"Failed to fetch "+error}, {status: 500})
    }
}

export async function POST(request) {
  try {
    const { name, description, image_url, price, category } = await request.json();
    const stock = 0;
    const promisePool = mysqlPool.promise();
    const [result] = await promisePool.query(
      'INSERT INTO products (name, description, image_url, price, stock, category) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, image_url, price, stock, category]
    );
    return NextResponse.json({ id: result.insertId, name, description, image_url, price, stock, category });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name, description, image_url, price, stock, category } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    const [result] = await db.query(
      `UPDATE products 
       SET name = ?, description = ?, image_url = ?, price = ?, stock = ?, category = ? 
       WHERE id = ?`,
      [name, description, image_url, price, stock, category, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully", id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const [result] = await db.query(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    return NextResponse.json({ message: "Product deleted", affectedRows: result.affectedRows });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete: " + error }, { status: 500 });
  }
}
