// app/api/product/route.js
import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

const db = mysqlPool.promise();

// GET - ดึงรายการสินค้า
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch " + error }, { status: 500 });
  }
}

// POST - เพิ่มสินค้าใหม่
export async function POST(request) {
  try {
    const { name, description, image_url, price, category, shop_link } = await request.json();
    const [result] = await db.query(
      `INSERT INTO products (name, description, image_url, price, category, shop_link)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, image_url, price, category, shop_link]
    );
    return NextResponse.json({ id: result.insertId, name, description, image_url, price, category, shop_link }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Insert failed: " + error }, { status: 500 });
  }
}

// PUT - แก้ไขสินค้า
export async function PUT(request) {
  try {
    const { id, name, description, image_url, price, category, shop_link } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    const [result] = await db.query(
      `UPDATE products 
       SET name = ?, description = ?, image_url = ?, price = ?, category = ?, shop_link = ?
       WHERE id = ?`,
      [name, description, image_url, price, category, shop_link, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully", id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed: " + error }, { status: 500 });
  }
}

// DELETE - ลบสินค้า
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const [result] = await db.query(
      'DELETE FROM products WHERE id = ?',
      [id]
    );

    return NextResponse.json({ message: "Product deleted", affectedRows: result.affectedRows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed: " + error }, { status: 500 });
  }
}
