'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";

// ดึงข้อมูลสินค้า
async function getData() {
  const res = await fetch('http://localhost:3000/api/product', {
    cache: 'no-store',
  });
  return res.json();
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div className="text-right">
        <Link href="/admin/login">
          <button className="btn btn-warning">Admin</button>
        </Link>
      </div>

      <div className="header">
        <div className="header-text">
          <h1>Cute Things - Welcome to my review</h1>
          <h2 style={{ color: "white" }}>🐈 enjoy! 🛍️</h2>
        </div>
        <img className="header-img" src="https://cdn.pixabay.com/photo/2024/01/22/15/36/cat-8525662_1280.png" alt="cat" />
      </div>

      <div className="container">
        <h1 className="page-title">🛍️ Product List</h1>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image_url} alt={product.name} className="product-img" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-desc">{product.description}</p>
              <p className="product-price">฿{product.price.toLocaleString()}</p>
              <p>หมวด: {product.category}</p>
              {product.shop_link && (
                <Link href={product.shop_link} passHref>
                  <button className="btn btn-primary">🛒 go to shopee</button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
