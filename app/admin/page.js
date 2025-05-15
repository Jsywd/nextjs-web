'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

async function getData() {
  const res = await fetch('http://localhost:3000/api/product', {
    cache: 'no-store',
  });
  return res.json();
}

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('isAdmin')) {
      router.push('/admin/login');
    } else {
      fetchData();
    }
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    router.push('/');
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`คุณต้องการลบสินค้า ${name} ใช่ไหม?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3000/api/product`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete');
      }

      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p> กำลังโหลดข้อมูล...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div className="text-right">
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      <div className="header">
        <div className="header-text">
          <h1>Cute Things - Admin Dashboard</h1>
          <h2 style={{ color: "rgb(251, 251, 251)" }}>Welcome to Admin</h2>
        </div>
        <img
          className="header-img"
          src="https://cdn.pixabay.com/photo/2024/01/22/15/36/cat-8525662_1280.png"
          alt="cat"
        />
      </div>

      <div className="container">
        <h1 className="page-title">🛍️ Product List</h1>
        <div className="center">
          <Link href="/product" passHref>
            <button className="btn btn-success">➕ เพิ่มสินค้า</button>
          </Link>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image_url}
                alt={product.name}
                className="product-img"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-desc">{product.description}</p>
              <p className="product-price">฿{product.price.toLocaleString()}</p>
              <p>หมวด: {product.category}</p>

              <Link href={`/update?id=${product.id}`} passHref>
                <button className="btn btn-primary">✏️ แก้ไข</button>
              </Link>
              <button 
                onClick={() => handleDelete(product.id, product.name)}
                className="btn btn-danger"
              >
                🗑️ ลบ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
