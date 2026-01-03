import {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";

const Cart = () => {
  const { token, loadCartCount } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Headers memoizados
  const headers = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const fetchCart = useCallback(async () => {
    try {
      const response = await api.get("cart/", headers);
      setCart(response.data);
    } catch (error) {
      console.error("Error cargando carrito:", error);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    if (token) fetchCart();
  }, [token, fetchCart]);

  const updateQuantity = async (productId, action) => {
    await api.post(
      "cart/update/",
      { product_id: productId, action },
      headers
    );
    await fetchCart();
    loadCartCount();
  };

  const removeItem = async (productId) => {
    await api.post(
      "cart/remove/",
      { product_id: productId },
      headers
    );
    await fetchCart();
    loadCartCount();
  };

  const clearCart = async () => {
    await api.post("cart/clear/", {}, headers);
    await fetchCart();
    loadCartCount();
  };

  if (loading) return <p>Cargando carrito...</p>;
  if (!cart) return <p>No hay carrito disponible</p>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>🛒 Carrito</h2>

      {cart.items.length === 0 && <p>Carrito vacío</p>}

      {cart.items.map((item) => (
        <div
          key={item.id}
          style={{
            marginBottom: "15px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px",
          }}
        >
          <strong>{item.product.name}</strong> — $
          {item.product.price}
          <br />
          Cantidad:
          <button onClick={() => updateQuantity(item.product.id, "decrease")}>
            -
          </button>
          <span style={{ margin: "0 10px" }}>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.product.id, "increase")}>
            +
          </button>

          <button
            onClick={() => removeItem(item.product.id)}
            style={{ marginLeft: "10px" }}
          >
            Eliminar
          </button>
        </div>
      ))}

      {cart.items.length > 0 && (
        <>
          <h3>Total: ${total}</h3>

          <div style={{ marginTop: "15px" }}>
            <button onClick={clearCart}>Vaciar carrito</button>

            <button
              onClick={() => navigate("/checkout")}
              style={{
                marginLeft: "10px",
                background: "#4CAF50",
                color: "#fff",
                padding: "8px 16px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Ir a pagar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
