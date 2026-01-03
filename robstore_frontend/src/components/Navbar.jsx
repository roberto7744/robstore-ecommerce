import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { token, logout, cartCount, user } = useContext(AuthContext);

  return (
    <nav
      style={{
        padding: "15px 20px",
        background: "#222",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* LEFT */}
      <div>
        <Link to="/" style={{ color: "#fff", marginRight: "15px" }}>
          Productos
        </Link>

        {token && (
          <>
            <Link to="/cart" style={{ color: "#fff", marginRight: "15px" }}>
              Carrito ({cartCount})
            </Link>

            <Link to="/orders" style={{ color: "#fff", marginRight: "15px" }}>
              Órdenes
            </Link>

            {/* 🔐 ADMIN ONLY */}
            {user?.is_staff && (
              <Link
                to="/admin/products"
                style={{
                  color: "#00eaff",
                  marginRight: "15px",
                  fontWeight: "bold",
                }}
              >
                Admin Panel
              </Link>
            )}
          </>
        )}
      </div>

      {/* RIGHT */}
      <div>
        {!token ? (
          <Link to="/login" style={{ color: "#fff" }}>
            Login
          </Link>
        ) : (
          <button
            onClick={logout}
            style={{
              background: "#ff4d4d",
              border: "none",
              padding: "6px 12px",
              cursor: "pointer",
              color: "#fff",
              borderRadius: "4px",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
