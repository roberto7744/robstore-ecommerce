import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";

const ProductCard = ({ product }) => {
  const { token, loadCartCount } = useContext(AuthContext);

  const addToCart = async () => {
    if (!token) {
      alert("Debes iniciar sesión");
      return;
    }

    try {
      await api.post(
        "cart/add/",
        { product_id: product.id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 actualiza contador del navbar
      await loadCartCount();

      alert("Producto agregado al carrito");
    } catch (error) {
      console.error("Error backend:", error.response?.data || error);
      alert("No autorizado o sesión expirada");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "6px",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <strong>${product.price}</strong>

      <div style={{ marginTop: "10px" }}>
        <button onClick={addToCart}>Agregar al carrito</button>
      </div>
    </div>
  );
};

export default ProductCard;
