import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Bookmark, Eye, EyeOff, Camera } from "lucide-react";
import axios from 'axios'; // เพิ่ม axios สำหรับเรียก API

// URL ของ API สำหรับขอ Pre-signed URL (เหมือนกับใน AddFolder)
const PRE_SIGNED_URL_ENDPOINT = 'https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/image/upload-url';
// URL ของ API สำหรับลงทะเบียน
const SIGN_UP_ENDPOINT = 'https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/auth/sign-up';

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone_num: "",
    line_id: "",
    password: "",
    confirmPassword: "",
    profile_url: "", // นี่จะยังใช้สำหรับ preview URL (Blob URL)
  });

  const [profileImageFile, setProfileImageFile] = useState(null); // State สำหรับเก็บ File object
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // State สำหรับ loading ขณะอัปโหลด
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file); // เก็บ File object
      const previewUrl = URL.createObjectURL(file);
      setForm({ ...form, profile_url: previewUrl }); // ตั้งค่า Blob URL สำหรับ preview
    } else {
      setProfileImageFile(null);
      setForm({ ...form, profile_url: "" }); // ถ้าไม่เลือกไฟล์ ก็ล้างค่า
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setIsUploading(true); // เริ่มการอัปโหลด/ประมวลผล

    let finalProfileS3Url = ""; // URL ของรูปภาพบน S3 ที่จะส่งไปบันทึก

    // 1. อัปโหลดรูปภาพ (ถ้ามี)
    if (profileImageFile) {
      try {
        // 1.1 ขอ Pre-signed URL
        const imgInform = {
          fileName: profileImageFile.name,
          contentType: profileImageFile.type,
        };
        const { data: presignData } = await axios.post(PRE_SIGNED_URL_ENDPOINT, imgInform);

        if (!presignData.uploadUrl || !presignData.fileUrl) {
          throw new Error("ไม่สามารถรับ Pre-signed URL ได้");
        }

        // 1.2 อัปโหลดไฟล์ไปยัง S3
        await fetch(presignData.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': profileImageFile.type,
          },
          body: profileImageFile,
        });

        finalProfileS3Url = presignData.fileUrl; // เก็บ URL ของ S3
        console.log('อัปโหลดรูปภาพสำเร็จ:', finalProfileS3Url);

      } catch (uploadError) {
        console.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ:', uploadError);
        alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพโปรไฟล์ กรุณาลองใหม่อีกครั้ง');
        setIsUploading(false);
        return; // หยุดการทำงานถ้าอัปโหลดรูปไม่สำเร็จ
      }
    }

    // 2. เตรียม Payload สำหรับส่งไปลงทะเบียน
    // เอา confirmPassword และ profile_url (ที่เป็น blob url) ออกจาก form
    // แล้วใส่ finalProfileS3Url เข้าไปแทน
    const { confirmPassword, profile_url, ...registrationData } = form;
    const payload = {
      ...registrationData,
      profile_url: finalProfileS3Url, // ใช้ URL จาก S3 หรือ "" ถ้าไม่มีรูป
    };

    // 3. ส่งข้อมูลการลงทะเบียน
    try {
      const res = await fetch(SIGN_UP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json(); // พยายามอ่าน response body

      if (res.ok) {
        alert("ลงทะเบียนสำเร็จ!");
        navigate("/login");
      } else {
        console.error("ลงทะเบียนไม่สำเร็จ:", responseData);
        alert(`ลงทะเบียนไม่สำเร็จ: ${responseData.message || 'โปรดตรวจสอบข้อมูลและลองอีกครั้ง'}`);
      }
    } catch (regError) {
      console.error('เกิดข้อผิดพลาดระหว่างการลงทะเบียน:', regError);
      alert('เกิดข้อผิดพลาดบางอย่างระหว่างการลงทะเบียน');
    } finally {
      setIsUploading(false); // สิ้นสุดการอัปโหลด/ประมวลผล
    }
  };

  return (
    <div className="bg-pink-50 flex items-center justify-center min-h-screen">
      <div className="w-[440px] max-h-[95vh] overflow-y-auto px-6 py-4 my-4 rounded-lg shadow-lg bg-white"> {/*ปรับปรุง UI เล็กน้อย*/}
        <button onClick={() => navigate(-1)} className="text-pink-600 mb-2 text-2xl font-bold">
          ←
        </button>
        <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">ลงทะเบียน</h1>

        {/* Profile image uploader */}
        <div className="mx-auto mb-6 flex flex-col items-center">
          <label htmlFor="profileUpload" className="cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center shadow overflow-hidden">
              {form.profile_url ? (
                <img src={form.profile_url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera size={48} className="text-pink-500" />
              )}
            </div>
          </label>
          <input
            type="file"
            id="profileUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            disabled={isUploading}
          />
          {isUploading && <p className="text-pink-500 text-sm mt-2">กำลังอัปโหลดรูปภาพ...</p>}
        </div>


        <form onSubmit={handleSubmit} className="space-y-4">
          <Input icon={<User />} name="username" placeholder="ชื่อผู้ใช้" value={form.username} onChange={handleChange} disabled={isUploading} />
          <Input icon={<Mail />} name="email" type="email" placeholder="อีเมล" value={form.email} onChange={handleChange} disabled={isUploading} />
          <Input icon={<Phone />} name="phone_num" type="tel" placeholder="เบอร์โทรติดต่อ" value={form.phone_num} onChange={handleChange} disabled={isUploading} />
          <Input icon={<Bookmark />} name="line_id" placeholder="ไอดีไลน์ (ถ้ามี)" value={form.line_id} onChange={handleChange} disabled={isUploading} />
          <Input
            icon={<Lock />}
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="รหัสผ่าน"
            value={form.password}
            onChange={handleChange}
            rightIcon={
              <button type="button" onClick={() => setShowPass(!showPass)} disabled={isUploading}>{showPass ? <EyeOff /> : <Eye />}</button>
            }
            disabled={isUploading}
          />
          <Input
            icon={<Lock />}
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="ยืนยันรหัสผ่าน"
            value={form.confirmPassword}
            onChange={handleChange}
            rightIcon={
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} disabled={isUploading}>{showConfirm ? <EyeOff /> : <Eye />}</button>
            }
            disabled={isUploading}
          />

          <button
            type="submit"
            className="w-full bg-pink-600 text-white font-bold py-3 rounded-full hover:bg-pink-700 transition duration-150 disabled:bg-pink-300"
            disabled={isUploading}
          >
            {isUploading ? "กำลังดำเนินการ..." : "ลงทะเบียน"}
          </button>
        </form>

        <p className="mt-6 text-sm text-pink-400 text-center">
          มีบัญชีอยู่แล้วหรอ?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-pink-600 font-semibold hover:underline"
            disabled={isUploading}
          >
            เข้าสู่ระบบได้ที่นี่เลย
          </button>
        </p>
      </div>
    </div>
  );
}

// Component Input ไม่มีการเปลี่ยนแปลง
function Input({ icon, rightIcon, ...props }) {
  return (
    <div className={`flex items-center bg-pink-100 rounded-full px-4 py-3 ${props.disabled ? 'opacity-50' : ''}`}>
      <div className="text-pink-600 mr-2">{icon}</div>
      <input
        className="bg-transparent outline-none w-full placeholder:text-pink-400 text-pink-700"
        {...props}
      />
      {rightIcon && <div className="ml-2 text-pink-600">{rightIcon}</div>}
    </div>
  );
}