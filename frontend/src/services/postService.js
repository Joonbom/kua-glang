const BASE_URL = "https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api";

// 1. เพิ่มโพสต์ใหม่
export const createPost = async (userId, postData) => {
  const res = await fetch(`${BASE_URL}/post/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || 'โพสต์ล้มเหลว');
  }

  return await res.json();
};

// 2. แก้ไขโพสต์
export const updatePost = async (userId, postId, data) => {
  const res = await fetch(`${BASE_URL}/post/${userId}/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

// 3. ลบโพสต์
export const deletePost = async (userId, postId) => {
  await fetch(`${BASE_URL}/post/${userId}/${postId}`, {
    method: "DELETE",
  });
};

// 4. แสดงโพสต์ทั้งหมด
export const fetchAllPosts = async () => {
  const res = await fetch(`${BASE_URL}/post`);
  return await res.json();
};

// 5. แสดงโพสต์ของผู้ใช้
export const fetchUserPosts = async (userId) => {
  const res = await fetch(`${BASE_URL}/post/${userId}`);
  return await res.json();
};

// 6. ไลก์โพสต์
export const likePost = async (userId, postId) => {
  await fetch(`${BASE_URL}/post/like/${userId}/${postId}`, {
    method: "POST",
  });
};

// 7. ไลก์คอมเมนต์
export const likeComment = async (userId, commentId) => {
  await fetch(`${BASE_URL}/post/${commentId}/comment/${userId}`, {
    method: "POST",
  });
};

// 8. คอมเมนต์โพสต์
export const addComment = async (userId, postId, text, parentCommentId = null) => {
  const res = await fetch(`${BASE_URL}/post/${postId}/comment/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      caption: text, // <-- ต้องเปลี่ยนจาก text → caption
      parentCommentId,
    }),
  });
  return await res.json();
};

// 9. ลบคอมเมนต์
export const deleteComment = async (commentId, postId) => {
  await fetch(`${BASE_URL}/post/${postId}/comment/${commentId}`, {
    method: "DELETE",
  });
};

// 10. แก้ไขคอมเมนต์
export const editComment = async (commentId, postId, newText) => {
  await fetch(`${BASE_URL}/post/${postId}/comment/${commentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: newText }),
  });
};

// 11. ดึงเพื่อน/แนะนำเพื่อน
export const fetchFriends = async (userId) => {
  const res = await fetch(`${BASE_URL}/post/friend/${userId}`);
  return await res.json();
};

// 12. เพิ่มเพื่อน (follow)
export const followUser = async (userId, followId) => {
  await fetch(`${BASE_URL}/post/friend/${userId}/${followId}`, {
    method: "POST",
  });
};

// 13. ลบเพื่อน (unfollow)
export const unfollowUser = async (userId, followId) => {
  await fetch(`${BASE_URL}/post/friend/${userId}/${followId}`, {
    method: "DELETE",
  });
};
