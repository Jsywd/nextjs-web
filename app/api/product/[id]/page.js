import { mysqlPool } from '@/utils/db';

export default async function ProductDetail({ params }) {
  const [rows] = await mysqlPool.query(
    'SELECT * FROM products WHERE id = ?',
    [params.id]
  );
  const product = rows[0];

  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.name}</h1>
      <img src={product.image_url} alt={product.name} width="300" />
      <p>{product.description}</p>
      <p>ราคา: ฿{product.price}</p>
      <p>สต๊อก: {product.stock}</p>
      <p>หมวดหมู่: {product.category}</p>
    </div>
  );
}
