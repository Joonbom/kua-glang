import React, { useState } from 'react';
import axios from 'axios';

export default function EditProfileImage({ userId, onBack }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      // 1. ขอ upload URL จาก backend
      const { data } = await axios.post(
        `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/image/upload-url`,
        {
          fileName: selectedFile.name,
          contentType: selectedFile.type,
          Blob: file,
        }
      );

      // 2. อัปโหลดไฟล์ไปยัง S3
      await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': selectedFile.type,
        },
        body: selectedFile,
      });

      // 3. อัปเดต profile_url ไปยัง DynamoDB
      await fetch(`https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/stat/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_url: data.fileUrl }),
      });

      setMessage('✅ อัปโหลดและอัปเดตโปรไฟล์สำเร็จ');
    } catch (err) {
      console.error(err);
      setMessage('❌ มีข้อผิดพลาดในการอัปโหลดรูปภาพ');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <button onClick={onBack}>⬅ กลับ</button>
      <h2 style={{ color: '#D34670' }}>แก้ไขรูปโปรไฟล์</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imagePreview && <img src={imagePreview} alt="preview" style={{ width: 150, marginTop: 16 }} />}
      <div>
        <button onClick={handleUpload} style={{ marginTop: 16 }}>อัปโหลด</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
