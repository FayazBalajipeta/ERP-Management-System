import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Products.css";

// ✅ API Base URL (Vercel env + Render fallback)
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://erp-management-system-071t.onrender.com";

const Products = () => {
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Safe user parsing
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;
  const isAdmin = role === "Admin";

  // ================= FETCH PRODUCTS =================
  const fetchProducts = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch products error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ================= ADD / UPDATE PRODUCT =================
  const saveProduct = async () => {
    if (!title || !sku || !price) {
      alert("Please fill required fields");
      return;
    }

    const payload = {
      title,
      sku,
      price: Number(price),
      stock: Number(stock) || 0,
    };

    try {
      setLoading(true);

      if (editId) {
        await axios.put(
          `${API_BASE_URL}/api/products/${editId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } else {
        await axios.post(`${API_BASE_URL}/api/products`, payload, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      }

      clearForm();
      fetchProducts();
    } catch (err) {
      console.error("Save product error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "❌ You are not allowed to perform this action"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE PRODUCT (Admin only) =================
  const deleteProduct = async (id) => {
    if (!isAdmin) {
      alert("Only Admin can delete products");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchProducts();
    } catch (err) {
      console.error("Delete product error:", err.response?.data || err.message);
      alert("❌ Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT PRODUCT =================
  const editProduct = (product) => {
    setEditId(product._id);
    setTitle(product.title);
    setSku(product.sku);
    setPrice(product.price);
    setStock(product.stock);
  };

  const clearForm = () => {
    setEditId(null);
    setTitle("");
    setSku("");
    setPrice("");
    setStock("");
  };

  // ================= UI =================
  return (
    <div className="products-container">
      <h2>Product Management</h2>

      {/* ================= FORM ================= */}
      <div className="product-form">
        <input
          placeholder="Product Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <button onClick={saveProduct} disabled={loading}>
          {editId ? "Update Product" : "Add Product"}
        </button>

        {editId && (
          <button onClick={clearForm} className="delete-btn">
            Cancel
          </button>
        )}
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.sku}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button className="edit-btn" onClick={() => editProduct(p)}>
                    Edit
                  </button>

                  {/* ✅ Delete only for Admin */}
                  {isAdmin && (
                    <button
                      className="delete-btn"
                      onClick={() => deleteProduct(p._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Products;
