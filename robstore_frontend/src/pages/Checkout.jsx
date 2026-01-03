import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";

const Checkout = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const response = await api.post("checkout/", {}, headers);
      setSuccess(response.data);

      // 🔁 Redirección automática
      setTimeout(() => navigate("/orders"), 1500);
    } catch {
      setError("No se pudo completar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Checkout</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {success ? (
        <div style={{ background: "#e6ffe6", padding: "15px" }}>
          <h3>✅ Pago exitoso</h3>
          <p>
            Orden ID: <strong>{success.order_id}</strong>
          </p>
          <p>
            Total pagado: <strong>${success.total}</strong>
          </p>
          <p>Redirigiendo a tus órdenes...</p>
        </div>
      ) : (
        <button onClick={handleCheckout} disabled={loading}>
          {loading ? "Procesando..." : "Pagar ahora"}
        </button>
      )}
    </div>
  );
};

export default Checkout;
