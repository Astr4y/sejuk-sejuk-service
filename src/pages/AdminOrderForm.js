import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase/config";
import "./AdminOrderForm.css";
import Navbar from "../components/Navbar";

export default function AdminOrderForm() {
  const [form, setForm] = useState({
    customer: "",
    phone: "",
    address: "",
    problem: "",
    service: "",
    quotedPrice: "",
    assignedTechnician: "",
    adminNotes: ""
  });

  const [lastOrder, setLastOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editOrderId, setEditOrderId] = useState(null);
  const [editTechnician, setEditTechnician] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const services = ["Aircond cleaning", "Installation", "Repair"];
  const technicians = ["Ali", "John", "Bala", "Yusoff"];

  // Listen to orders
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create new order
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        ...form,
        orderNo: "ORD" + Date.now(),
        status: "Pending",
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, "orders"), orderData);
      setLastOrder(orderData);
      setForm({
        customer: "",
        phone: "",
        address: "",
        problem: "",
        service: "",
        quotedPrice: "",
        assignedTechnician: "",
        adminNotes: ""
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
      } catch (error) {
        console.error("Error deleting order: ", error);
      }
    }
  };

  // Start editing
  const handleEditClick = (order) => {
    setEditOrderId(order.id);
    setEditTechnician(order.assignedTechnician);
    setEditNotes(order.adminNotes || "");
  };

  // Save changes
  const handleSaveEdit = async () => {
    try {
      await updateDoc(doc(db, "orders", editOrderId), {
        assignedTechnician: editTechnician,
        adminNotes: editNotes
      });
      setEditOrderId(null);
      setEditTechnician("");
      setEditNotes("");
    } catch (error) {
      console.error("Error updating order: ", error);
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditOrderId(null);
    setEditTechnician("");
    setEditNotes("");
  };

  return (
  <div>
    <Navbar title="Technician Portal" />
    <div className="admin-container">
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit} className="order-form">
        <input
          name="customer"
          placeholder="Customer Name"
          value={form.customer}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <textarea
          name="problem"
          placeholder="Problem (optional)"
          value={form.problem}
          onChange={handleChange}
        />

        <select
          name="service"
          value={form.service}
          onChange={handleChange}
          required
        >
          <option value="">Select Service</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="quotedPrice"
          placeholder="Quoted Price"
          value={form.quotedPrice}
          onChange={handleChange}
          required
        />

        <select
          name="assignedTechnician"
          value={form.assignedTechnician}
          onChange={handleChange}
          required
        >
          <option value="">Assign Technician</option>
          {technicians.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <textarea
          name="adminNotes"
          placeholder="Admin Notes (optional)"
          value={form.adminNotes}
          onChange={handleChange}
        />

        <button type="submit">Create Order</button>
      </form>

      {lastOrder && (
        <div className="order-summary">
          <h3>Order Summary</h3>
          <p>
            <strong>Order No:</strong> {lastOrder.orderNo}
          </p>
          <p>
            <strong>Customer:</strong> {lastOrder.customer}
          </p>
          <p>
            <strong>Status:</strong> {lastOrder.status}
          </p>
        </div>
      )}

      <h3>All Orders</h3>
      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order No</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Technician</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-orders">
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNo}</td>
                  <td>{order.customer}</td>
                  <td>{order.service}</td>
                  <td>
                    {editOrderId === order.id ? (
                      <select
                        value={editTechnician}
                        onChange={(e) => setEditTechnician(e.target.value)}
                      >
                        {technicians.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    ) : (
                      order.assignedTechnician
                    )}
                  </td>
                  <td>{order.status}</td>
                  <td>
                    {editOrderId === order.id ? (
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                      />
                    ) : (
                      order.adminNotes || "-"
                    )}
                  </td>
                  <td>
                    {order.createdAt?.toDate().toLocaleString() || "Pending"}
                  </td>
                  <td>
                    {editOrderId === order.id ? (
                      <>
                        <button onClick={handleSaveEdit} className="save-btn">
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(order)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
   </div>
  );
}
