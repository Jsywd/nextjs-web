'use client'

import React, { useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  MenuItem,
} from '@mui/material'
import { useRouter } from 'next/navigation'

const categories = ['อาหารสุนัข', 'อาหารแมว', 'อุปกรณ์สัตว์เลี้ยง']

export default function CreateProductPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    price: '',
    category: '',
    shop_link: '', 
  })

  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({...prev,[name]: value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('ไม่สามารถเพิ่มสินค้าได้')

      const data = await res.json() // ดึงข้อมูลจาก response
      alert('เพิ่มสินค้าสำเร็จ') // แสดงข้อความแจ้งเตือนเมื่อเพิ่มสินค้าสำเร็จ
      router.push('/admin') // ไปยังหน้า product หลังจากเพิ่มสินค้าเสร็จ

    } catch (err) {
      setError(err.message) // ถ้ามี error ให้แสดงข้อความ error
    }
  }

  return (
    <Box maxWidth={600} mx="auto" mt={5} px={2}>
      <Typography variant="h4" mb={3} color="primary">🛒 เพิ่มสินค้าใหม่</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="ชื่อสินค้า"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="รายละเอียด"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
          />
          <TextField
            label="ลิงก์รูปภาพ"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            required
          />
          <TextField
            label="ราคา"
            name="price"
            type="number"
            inputProps={{ step: '1' }}
            value={formData.price}
            onChange={handleChange}
            required
          />
          <TextField
            select
            label="หมวดหมู่"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="ลิงก์สินค้า"
            name="shop_link" 
            value={formData.shop_link}
            onChange={handleChange}
            required
          />
          
          {error && <Typography color="error">{error}</Typography>}

          <Button variant="contained" color="success" type="submit">
            บันทึกสินค้า
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => router.push('/admin')}>
            กลับหน้าหลัก
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
