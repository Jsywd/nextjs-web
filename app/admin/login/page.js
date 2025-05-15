'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../style.css'; // นำเข้าไฟล์ CSS ถ้ายังไม่ได้ import

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('isAdmin')) {
      router.push('/admin');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '123456') {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin');
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <div className="container center">
      <div className="login-box">
        <h1 className="page-title">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <div className="center">
            <button type="submit" className="btn btn-login">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
