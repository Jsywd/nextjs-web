'use client'

import React, { useEffect, useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  MenuItem,
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'

const categories = ['อาหารสุนัข', 'อาหารแมว', 'อุปกรณ์สัตว์เลี้ยง']

export default function UpdateProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    price: '',
    category: '',
    shop_link: ''
  })

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setError('ไม่พบรหัสสินค้า')
      return
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`)
        if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลสินค้าได้')
        const product = await res.json()
        setFormData(product)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('ไม่สามารถอัปเดตสินค้าได้')

        alert('อัปเดตสินค้าสำเร็จ')
        router.push('/admin') // กลับหน้าหลักหลังอัปเดตสำเร็จ        
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <Typography>กำลังโหลดข้อมูล...</Typography>
  if (error) return <Typography color="error">{error}</Typography>

  return (
        
    <Box maxWidth={600} mx="auto" mt={5} px={2}>
      <Typography variant="h4" mb={3} 
      color="primary">🛒 อัปเดตสินค้า</Typography>
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
            name="shop_link" // ใช้ชื่อฟิลด์ตามฐานข้อมูล
            value={formData.shop_link?? ""}
            onChange={handleChange}
            required
            />
          {error && <Typography color="error">{error}</Typography>}

          <Button variant="contained" color="primary" type="submit">
            อัปเดตสินค้า
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => router.push('/admin')}>
            กลับหน้าหลัก
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
