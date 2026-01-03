import { useContext, useEffect, useState, useMemo } from "react";
import AuthContext from "../../context/AuthContext";
import api from "../../api/axios";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  image: null,
};

const ProductForm = ({ product, onSuccess }) => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const headers = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  // ⚠️ NUNCA valores undefined
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category?.id || "",
        image: null,
      });
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      if (product) {
        await api.put(
          `admin/products/${product.id}/`,
          formData,
          headers
        );
      } else {
        await api.post(
          "admin/products/",
          formData,
          headers
        );
      }

      setForm(emptyForm);
      onSuccess();
    } catch (error) {
      console.error("Error guardando producto:", error.response?.data || error);
      alert("Error guardando producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>{product ? "Editar producto" : "Nuevo producto"}</h3>

      <input
        name="name"
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        name="description"
        placeholder="Descripción"
        value={form.description}
        onChange={handleChange}
        required
      />

      <input
        name="price"
        type="number"
        placeholder="Precio"
        value={form.price}
        onChange={handleChange}
        required
      />

      <input
        name="stock"
        type="number"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
        required
      />

      <input
        name="category"
        type="number"
        placeholder="ID Categoría"
        value={form.category}
        onChange={handleChange}
        required
      />

      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleChange}
        required={!product}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : product ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
};

export default ProductForm;

