import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";

const Orders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Memoizamos headers (depende solo de token)
  const headers = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  // ✅ fetchOrders estable y sin warnings
  const fetchOrders = useCallback(async () => {
    try {
      const response = await api.get("orders/", headers);
      setOrders(response.data);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token, fetchOrders]);

  if (loading) return <p>Cargando órdenes...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mis Órdenes</h2>

      {orders.length === 0 && <p>No tienes órdenes aún</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "15px",
          }}
        >
          <h4>Orden #{order.id}</h4>
          <p>
            Total: <strong>${order.total}</strong>
          </p>
          <p>Fecha: {new Date(order.created_at).toLocaleString()}</p>

          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.product.name} x {item.quantity} — ${item.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Orders;
