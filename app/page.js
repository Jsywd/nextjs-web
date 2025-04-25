'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";

// ฟังก์ชันดึงข้อมูลสินค้าจาก API 
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

  // ดึงข้อมูลสินค้าจาก API
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

  const handleDelete = async (id, name) => {
    const confirm = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirm) return;

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

      // Remove deleted item from the state
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      {/* ส่วนข้อความของ HomePage */}
      <div className="first" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '40px',
        background: 'linear-gradient(to bottom right, #ffb74d, #ffcc80)',
      }}>
        <div className="text-container" style={{
          flex: 1,
          paddingRight: '20px',
        }}>
          <h1>Cute Things</h1>
          <h2 style={{ color: "rgb(251, 251, 251)" }}>
            Welcome to my review
          </h2>
          <h2 style={{ color: "rgb(255, 255, 255)" }}>
            🐈 enjoy! 🛍️
          </h2>
        </div>
        <img
          className="cha"
          src="https://cdn.pixabay.com/photo/2024/01/22/15/36/cat-8525662_1280.png"
          alt="cat"
          style={{
            flex: 1,
            objectFit: 'contain',
            maxHeight: '300px',
          }}
        />
      </div>

      {/* ส่วนแสดงรายการสินค้า */}
      <div style={{
        padding: '40px',
        background: 'linear-gradient(to bottom right, #fdf6e3, #ffe0b2)',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '32px',
          color: '#5D4037',
        }}>
          🛍️ Product List
        </h1>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Link href="/product" passHref>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
            }}>
              ➕ เพิ่มสินค้า
            </button>
          </Link>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '24px',
        }}>
          {products.map((product) => (
            <div key={product.id} style={{
              backgroundColor: '#fff8e1',
              padding: '16px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
              transition: 'transform 0.2s',
            }}>
              <img
                src={product.image_url}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  marginBottom: '12px',
                }}
              />
              <h3 style={{ color: '#6D4C41', fontSize: '18px' }}>{product.name}</h3>
              <p style={{ fontSize: '14px', color: '#795548', height: '48px', overflow: 'hidden' }}>
                {product.description}
              </p>
              <p style={{ fontWeight: 'bold', color: '#e64a19', margin: '8px 0' }}>
                ฿{product.price.toLocaleString()}
              </p>
              <p>หมวด: {product.category}</p>
              
              {/* ปุ่มอัปเดตสินค้า */}
              <Link href={`/update?id=${product.id}`} passHref>
                <button style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#2196f3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}>
                  ✏️ แก้ไข
                </button>
              </Link>
              {/* ปุ่มลบสินค้า */}
              <button
                onClick={() => handleDelete(product.id, product.name)}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
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
