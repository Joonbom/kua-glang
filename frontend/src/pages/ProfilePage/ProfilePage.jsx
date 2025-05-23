import React, { useState } from "react";
import ProfileHeader from "../../components/ProfilePage/ProfileHeader";
import PeriodSelector from "../../components/ProfilePage/PeriodSelector";
import ProfileStat from "../../components/ProfilePage/ProfileStats";
import MenuBar from "../../components/MenuBar/MenuBar";
import './ProfilePage.css';

const ProfilePage = () => {
    const [selectedTab, setSelectedTab] = useState('stats');

    return (
        <div className='profile-page'>
            <ProfileHeader />

            <div className="tab-buttons">
                <button
                    className={selectedTab === 'post' ? 'active' : ''}
                    onClick={() => setSelectedTab('post')}
                >
                    โพสต์
                </button>
                <button
                    className={selectedTab === 'stats' ? 'active' : ''}
                    onClick={() => setSelectedTab('stats')}
                >
                    สถิติ
                </button>
            </div>

            {selectedTab === 'stats' && (
                <>
                <PeriodSelector />
                <ProfileStat />
                <button className="share-btn">แชร์ให้เพื่อนของคุณเลย</button>
                </>
            )}

            <MenuBar />
        </div>
    );
};

export default ProfilePage;