import React, { useEffect, useState, useMemo } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import "./TechnicianPortal.css";
import Navbar from "../components/Navbar";

const TECHNICIANS = ["Ali", "John", "Bala", "Yusoff"];
const STATUS_OPTIONS = ["Pending", "In Progress", "Complete"];

export default function TechnicianPortal() {
  const [selectedTech, setSelectedTech] = useState("");
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOrder, setModalOrder] = useState(null);

  const [modalStatus, setModalStatus] = useState("Pending");
  const [modalExtra, setModalExtra] = useState("");
  const [modalRemarks, setModalRemarks] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // realtime query
  useEffect(() => {
    if (!selectedTech) {
      setOrders([]);
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("assignedTechnician", "==", selectedTech),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrders(list);

        if (modalOpen && modalOrder) {
          const fresh = list.find((o) => o.id === modalOrder.id);
          if (fresh) setModalOrder(fresh);
        }
      },
      (err) => console.error("onSnapshot error:", err)
    );

    return () => unsub();
  }, [selectedTech, modalOpen, modalOrder]);

  const openModal = (order) => {
    setModalOrder(order);
    setModalStatus(
      STATUS_OPTIONS.includes(order.status) ? order.status : "Pending"
    );
    setModalExtra(order.extraCharges != null ? String(order.extraCharges) : "");
    setModalRemarks(order.remarks || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalOrder(null);
    setUploading(false);
    setIsSaving(false);
  };

  const displayedFinalAmount = useMemo(() => {
    const base = Number(modalOrder?.quotedPrice || 0);
    const extra = Number(modalExtra || 0);
    return (base + extra).toFixed(2);
  }, [modalOrder, modalExtra]);

  const handleInlineStatusChange = async (orderId, newStatus) => {
    try {
      const refDoc = doc(db, "orders", orderId);
      const payload = { status: newStatus, updatedAt: serverTimestamp() };
      if (newStatus === "Complete") payload.completedAt = serverTimestamp();
      await updateDoc(refDoc, payload);
    } catch (err) {
      console.error("inline status update error:", err);
    }
  };

  // Upload files
  const handleFilesSelected = async (files) => {
    if (!modalOrder || !files || files.length === 0) return;
    const orderId = modalOrder.id;

    const existingFiles = Array.isArray(modalOrder.files)
      ? modalOrder.files
      : [];
    const remaining = 6 - existingFiles.length;
    if (remaining <= 0) {
      alert("Max 6 files already uploaded for this order.");
      return;
    }

    const toUpload = Array.from(files).slice(0, remaining);
    const uploadedMeta = [];
    setUploading(true);

    try {
      for (const file of toUpload) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "technician_upload");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dwviekptj/auto/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        if (data.secure_url) {
          uploadedMeta.push({
            name: file.name,
            url: data.secure_url,
            contentType: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
          });
        }
      }

      const newFilesArray = [...existingFiles, ...uploadedMeta];
      const refDoc = doc(db, "orders", orderId);
      await updateDoc(refDoc, {
        files: newFilesArray,
        lastFilesUploadedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setUploading(false);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      alert("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  // DELETE file
  const handleDeleteFile = async (index) => {
    if (!modalOrder) return;
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const updatedFiles = [...(modalOrder.files || [])];
      updatedFiles.splice(index, 1);

      const refDoc = doc(db, "orders", modalOrder.id);
      await updateDoc(refDoc, {
        files: updatedFiles,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Delete file error:", err);
      alert("Failed to delete file.");
    }
  };

  const handleSave = async () => {
    if (!modalOrder) return;
    try {
      setIsSaving(true);
      const refDoc = doc(db, "orders", modalOrder.id);
      const payload = {
        extraCharges: Number(modalExtra || 0),
        finalAmount:
          Number(modalOrder?.quotedPrice || 0) + Number(modalExtra || 0),
        remarks: modalRemarks || "",
        status: modalStatus,
        technicianName: selectedTech,
        updatedAt: serverTimestamp(),
      };
      if (modalStatus === "Complete") {
        payload.completedAt = serverTimestamp();
      }
      await updateDoc(refDoc, payload);
      setIsSaving(false);
      closeModal();
    } catch (err) {
      console.error("Save error:", err);
      setIsSaving(false);
      alert("Failed to save updates.");
    }
  };

  return (
  <div>
    <Navbar title="Technician Portal" />
    <div className="tech-container">
      <h2>Technician Portal</h2>

      <div className="tech-select">
        <label>Choose Technician:</label>
        <select
          value={selectedTech}
          onChange={(e) => setSelectedTech(e.target.value)}
        >
          <option value="">-- Select --</option>
          {TECHNICIANS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {!selectedTech ? (
        <p className="muted">Select a technician to view assigned jobs.</p>
      ) : (
        <section className="card">
          <h3>Assigned Jobs ({orders.length})</h3>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="muted center">
                    No jobs assigned.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <button
                        className="linklike"
                        onClick={() => openModal(order)}
                        title="Open details"
                      >
                        {order.orderNo}
                      </button>
                    </td>
                    <td>{order.customer}</td>
                    <td>{order.phone}</td>
                    <td>{order.service}</td>
                    <td>
                      <select
                        value={
                          STATUS_OPTIONS.includes(order.status)
                            ? order.status
                            : "Pending"
                        }
                        onChange={(e) =>
                          handleInlineStatusChange(order.id, e.target.value)
                        }
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{order.remarks || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* Modal */}
      {modalOpen && modalOrder && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Order Details — {modalOrder.orderNo}</h3>
              <button className="modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="grid two">
                <div>
                  <div className="field">
                    <label>Customer</label>
                    <div>{modalOrder.customer}</div>
                  </div>
                  <div className="field">
                    <label>Phone</label>
                    <div>{modalOrder.phone}</div>
                  </div>
                  <div className="field">
                    <label>Service</label>
                    <div>{modalOrder.service}</div>
                  </div>
                  <div className="field">
                    <label>Address</label>
                    <div className="pre">{modalOrder.address}</div>
                  </div>
                </div>

                <div>
                  <div className="field">
                    <label>Problem</label>
                    <div className="pre">{modalOrder.problem || "-"}</div>
                  </div>
                  <div className="field">
                    <label>Quoted Price (RM)</label>
                    <div>{Number(modalOrder.quotedPrice || 0).toFixed(2)}</div>
                  </div>
                  <div className="field">
                    <label>Status</label>
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Extra Charges (RM)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={modalExtra}
                      onChange={(e) => setModalExtra(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="field">
                    <label>Final Amount (RM)</label>
                    <div>{displayedFinalAmount}</div>
                  </div>
                </div>
              </div>

              <div className="field">
                <label>Remarks</label>
                <textarea
                  value={modalRemarks}
                  onChange={(e) => setModalRemarks(e.target.value)}
                  placeholder="Add remarks"
                />
              </div>

              <div className="field">
                <label>Upload Files (max 6)</label>
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.mp4,.pdf"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                {uploading && (
                  <div className="uploading">Uploading... Please wait</div>
                )}
                <div className="file-list">
                  {(modalOrder.files || []).map((f, i) => (
                    <div key={i} className="file-item">
                      <a href={f.url} target="_blank" rel="noreferrer">
                        {f.name}
                      </a>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteFile(i)}
                        title="Delete file"
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <small>
                Assigned to: <strong>{modalOrder.assignedTechnician}</strong> ·{" "}
                Created:{" "}
                {modalOrder.createdAt?.toDate
                  ? modalOrder.createdAt.toDate().toLocaleString()
                  : "-"}
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
