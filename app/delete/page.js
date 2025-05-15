'use client'

import React, { useState } from 'react'
import {
  Button,
  Typography,
  Box
} from '@mui/material'
import { useRouter } from 'next/navigation'

export default function DeleteProductPage() {
  const router = useRouter()
  const [error, setError] = useState(null)

  const handleDelete = async () => {
    const confirm = window.confirm('คุณต้องการลบสินค้านี้?')
    if (!confirm) return

    try {
      // สมมุติว่าใช้ ID ที่รับจาก search params หรือค่าคงที่
      const id = 'product-id-placeholder' 

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error('ไม่สามารถลบสินค้าได้')

      alert('ลบสินค้าสำเร็จ')
      router.push('/admin')  // นำผู้ใช้กลับไปที่หน้ารายการสินค้า
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Box maxWidth={600} mx="auto" mt={5} px={2}>
      <Typography variant="h4" mb={3} color="primary">🛒 ลบสินค้า</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="error" onClick={handleDelete}>
        ลบสินค้า
      </Button>
    </Box>
  )
}
