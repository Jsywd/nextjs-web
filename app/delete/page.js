'use client'

import React, { useEffect, useState } from 'react'
import {
  Button,
  Typography,
  Box,
  Stack,
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'

export default function DeleteProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [product, setProduct] = useState(null)
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
        setProduct(product)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleDelete = async () => {
    // ยืนยันการลบ
    const confirm = window.confirm(`คุณแน่ใจหรือว่าต้องการลบสินค้า: ${product.name}?`)
    if (!confirm) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: product.id }),
      })

      if (!res.ok) throw new Error('ไม่สามารถลบสินค้าได้')

      alert('ลบสินค้าสำเร็จ')
      router.push('/product')  // นำผู้ใช้กลับไปที่หน้ารายการสินค้า
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <Typography>กำลังโหลดข้อมูล...</Typography>
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Box maxWidth={600} mx="auto" mt={5} px={2}>
      <Typography variant="h4" mb={3} color="primary">🛒 ลบสินค้า</Typography>
      <Stack spacing={2}>
        <Typography variant="h6">ชื่อสินค้า: {product.name}</Typography>
        <Typography variant="body1">รายละเอียด: {product.description}</Typography>
        <Typography variant="body2">ราคา: {product.price} บาท</Typography>
        <Typography variant="body2">หมวดหมู่: {product.category}</Typography>

        {error && <Typography color="error">{error}</Typography>}

        <Button variant="contained" color="error" onClick={handleDelete}>
          ลบสินค้า
        </Button>
      </Stack>
    </Box>
  )
}
