import React, { useEffect, useState } from 'react';
import './Profile.css'
export default function ProfileHeader() {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`/api/user/${userId}`)
      .then(response => {
        if (!response.ok) throw new Error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        return response.json();
      })
      .then(data => setUser(data))
      .catch(error => console.error(error));
  }, []);

  if (!user) return <div>กำลังโหลด...</div>;

  return (
    <div className="profile-header">
      <img src={user.profile_url} alt="profile" className="profile-img" />
      <div className="profile-name">{user.username}</div>
      <div className="profile-bio">{user.bio}</div>
      <div className="line-info">
        <span className="line-id">LINE: {user.line_id}</span>
        <button className="edit-btn">✏️</button>
      </div>
    </div>
  );
}
