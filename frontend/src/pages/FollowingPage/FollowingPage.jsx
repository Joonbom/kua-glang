import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { IoClose } from 'react-icons/io5';

import MainTabsBar from '../../components/Community/MainTabsBar/MainTabsBar';
import MenuBar from '../../components/MenuBar/MenuBar';
import PostCard from '../../components/Community/PostCard';
import CommentSection from '../../components/Community/CommentSection';
import FriendListItem from '../../components/Community/FriendListItem';

import './FollowingPage.css';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchAllPosts,
  fetchFriends,
  followUser,
  unfollowUser,
  likePost,
  likeComment,
  addComment,
  deleteComment,
  editComment
} from '../../services/postService';

export default function FollowingPage() {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [tab, setTab] = useState('โพสต์ของเพื่อน');
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState('');
  const [visibleComments, setVisibleComments] = useState(null);
  const [commentInput, setCommentInput] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerRef = useRef(null);
  const fabRight = '1rem';

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [tab]);

  useEffect(() => {
    const load = async () => {
      try {
        const [all, friendsList] = await Promise.all([
          fetchAllPosts(),
          fetchFriends(userId)
        ]);

        setFriends(friendsList);

        const visible = all.filter(p => p.userId === userId || friendsList.includes(p.userId));
        setPosts(visible.map(p => ({
          ...p,
          isLiked: p.like?.includes(userId),
          commentsArray: p.comment || [],
          comments: (p.comment || []).length
        })));
      } catch (e) {
        console.error('โหลดโพสต์/เพื่อนล้มเหลว', e);
      }
    };
    load();
  }, [userId]);

  const toggleFriend = async (targetId) => {
    try {
      if (friends.includes(targetId)) {
        await unfollowUser(userId, targetId);
        setFriends(prev => prev.filter(f => f !== targetId));
      } else {
        await followUser(userId, targetId);
        setFriends(prev => [...prev, targetId]);
      }
    } catch (e) {
      console.error('เปลี่ยนสถานะเพื่อนไม่ได้', e);
    }
  };

  const handleLike = async (postId) => {
    await likePost(userId, postId);
    setPosts(prev => prev.map(p => p.postId === postId ? {
      ...p,
      isLiked: !p.isLiked,
      likes: p.isLiked ? p.likes - 1 : p.likes + 1
    } : p));
  };

  const toggleComment = (postId) => {
    setVisibleComments(visibleComments === postId ? null : postId);
    setReplyingTo(null);
  };

  const onCommentChange = (postId, val) => {
    setCommentInput(prev => ({ ...prev, [postId]: val }));
  };

  const submitComment = async (postId, parentId = null) => {
    const text = commentInput[postId]?.trim();
    if (!text) return;
    try {
      const newComment = await addComment(userId, postId, text, parentId);
      setPosts(prev => prev.map(p => {
        if (p.postId !== postId) return p;
        const add = (arr) => arr.map(c => c.id === parentId
          ? { ...c, replies: [...c.replies, newComment] }
          : { ...c, replies: add(c.replies || []) });
        const comments = parentId ? add(p.commentsArray) : [...p.commentsArray, newComment];
        return { ...p, commentsArray: comments, comments: comments.length };
      }));
      setCommentInput(prev => ({ ...prev, [postId]: '' }));
      setReplyingTo(null);
    } catch (e) {
      console.error('เพิ่มคอมเมนต์ล้มเหลว', e);
    }
  };

  const handleDeleteComment = async (postId, commentId, authorId) => {
    if (authorId !== userId) return alert('ไม่สามารถลบความคิดเห็นนี้');
    if (!window.confirm('ลบความคิดเห็นนี้ใช่หรือไม่?')) return;
    await deleteComment(commentId, postId);
    setPosts(prev => prev.map(p => {
      if (p.postId !== postId) return p;
      const filter = (arr) => arr.filter(c => c.id !== commentId).map(c => ({ ...c, replies: filter(c.replies || []) }));
      const updated = filter(p.commentsArray);
      return { ...p, commentsArray: updated, comments: updated.length };
    }));
  };

  const handleEditComment = async (postId, comment) => {
    const newText = prompt('แก้ไขคอมเมนต์:', comment.text);
    if (!newText || newText === comment.text) return;
    await editComment(comment.id, postId, newText);
    setPosts(prev => prev.map(p => {
      if (p.postId !== postId) return p;
      const edit = (arr) => arr.map(c => c.id === comment.id
        ? { ...c, text: newText }
        : { ...c, replies: edit(c.replies || []) });
      return { ...p, commentsArray: edit(p.commentsArray) };
    }));
  };

  const handleLikeComment = async (postId, commentId) => {
    await likeComment(userId, commentId);
    setPosts(prev => prev.map(p => {
      if (p.postId !== postId) return p;
      const toggle = (arr) => arr.map(c => c.id === commentId
        ? { ...c, isLikedByCurrentUser: !c.isLikedByCurrentUser, likes: c.isLikedByCurrentUser ? c.likes - 1 : c.likes + 1 }
        : { ...c, replies: toggle(c.replies || []) });
      return { ...p, commentsArray: toggle(p.commentsArray) };
    }));
  };

  const filteredPosts = posts.filter(p => !search || p.caption?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="following-page-wrapper">
      <div className="following-page-container">
        <div ref={headerRef} className="following-fixed-header-wrapper">
          <MainTabsBar />
          <div className="following-inner-tabs-container">
            {['โพสต์ของเพื่อน', 'เพื่อนของคุณ'].map(t => (
              <button key={t} className={`following-inner-tab-button ${tab === t ? 'active' : 'inactive'}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="following-scrollable-content-area no-scrollbar" style={{ paddingTop: headerHeight }}>
          <div className="search-bar-section">
            <div className="search-input-wrapper">
              <span className="search-icon-prefix"><Search /></span>
              <input className="search-input-field" value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหา..." />
              {search && <button className="clear-search-button" onClick={() => setSearch('')}><IoClose /></button>}
            </div>
          </div>

          {tab === 'โพสต์ของเพื่อน' ? (
            <div className="following-content-padding posts-list">
              {filteredPosts.map(post => (
                <React.Fragment key={post.postId}>
                  <PostCard
                    post={post}
                    currentUserId={userId}
                    isFriend={friends.includes(post.userId)}
                    onToggleLike={() => handleLike(post.postId)}
                    onToggleShowComments={() => toggleComment(post.postId)}
                  />
                  {visibleComments === post.postId && (
                    <CommentSection
                      postId={post.postId}
                      commentsArray={post.commentsArray}
                      commentInputText={commentInput[post.postId] || ''}
                      onCommentInputChange={onCommentChange}
                      onAddOrReplyComment={submitComment}
                      replyingToComment={replyingTo}
                      onCancelReply={() => setReplyingTo(null)}
                      currentUserId={userId}
                      onStartReply={(postId, commentId, userName) => {
                        setReplyingTo({ postId, commentId, userName });
                        setCommentInput(prev => ({ ...prev, [postId]: `@${userName} ` }));
                      }}
                      onDeleteComment={handleDeleteComment}
                      onOpenEditComment={handleEditComment}
                      onToggleLikeComment={handleLikeComment}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="friends-section-list-container">
              {friends.map(fid => (
                <FriendListItem
                  key={fid}
                  user={{ id: fid, name: `ผู้ใช้ ${fid}` }}
                  isAlreadyFriend={true}
                  onToggleFriendship={toggleFriend}
                />
              ))}
            </div>
          )}
        </div>

        <button className="create-post-fab" style={{ right: fabRight }} onClick={() => navigate('/community/create')}>+</button>
        <MenuBar />
      </div>
    </div>
  );
}