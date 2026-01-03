import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import AuthContext from "../../context/AuthContext";
import api from "../../api/axios";
import ProductForm from "./ProductForm";

const AdminProducts = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔒 headers MEMOIZADO
  const headers = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  // 🔁 función estable
  const loadProducts = useCallback(async () => {
    try {
      const res = await api.get("admin/products/", headers);
      setProducts(res.data);
    } catch (error) {
      console.error("Error cargando productos admin", error);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    if (token) {
      loadProducts();
    }
  }, [token, loadProducts]);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSuccess = () => {
    setEditingProduct(null);
    loadProducts();
  };

  if (loading) return <p>Cargando productos admin...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin · Productos</h2>

      <ProductForm
        product={editingProduct}
        onSuccess={handleSuccess}
      />

      <hr />

      {products.map((p) => (
        <div key={p.id} style={{ marginBottom: "10px" }}>
          <strong>{p.name}</strong> — ${p.price}
          <button
            onClick={() => handleEdit(p)}
            style={{ marginLeft: "10px" }}
          >
            Editar
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminProducts;
