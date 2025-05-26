// src/pages/EditProfileImagePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './EditProfileImagePage.css'

export default function EditProfileImagePage() {
  const userId = localStorage.getItem('userId') || 'RPZ3';
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = `${userId}-${Date.now()}-${file.name}`;
    const contentType = file.type;

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setError(null);

    try {
      // ขอ uploadUrl จาก backend
      const res = await fetch("https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/image/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, contentType }),
      });
      const { uploadUrl, fileUrl } = await res.json();

      // อัพโหลดรูปขึ้น S3
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
      });

      // อัพเดท profile_url ไปที่ DynamoDB
      await fetch(`https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/stat/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_url: fileUrl }),
      });

      alert("✅ อัพโหลดและอัพเดทโปรไฟล์สำเร็จ");
      navigate("/edit-profile");
    } catch (err) {
      console.error(err);
      setError("❌ เกิดข้อผิดพลาดในการอัพโหลด");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: "#D34670" }}>แก้ไขรูปโปรไฟล์</h2>
      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{ width: 120, height: 120, borderRadius: "50%", marginBottom: 16 }}
        />
      )}
          <label htmlFor="file-upload" className="upload-box">
      {preview ? (
        <img src={preview} alt="preview" className="preview-image" />
      ) : (
        <span className="upload-text">คลิกที่นี่เพื่ออัปโหลดรูปโปรไฟล์</span>
      )}
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={() => navigate("/edit-profile")} style={{ marginTop: 16, background: "#D34670", color: "white", padding: 8, borderRadius: 8 }}>
        ⬅️ กลับ
      </button>
    </div>
  );
}
