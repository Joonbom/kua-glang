import React from "react";
import shareIcon from '../../assets/ProfilePage/shareFood.png';
import trashIcon from '../../assets/ProfilePage/foodtrash.png';
import expireIcon from '../../assets/ProfilePage/eaticon.png';
import './Profile.css'

//This file display statistic data from user
//**THIS IS NOT FINAL VERSION**
//**REQUIRE BACKEND API FOR GET USER STATISTIC DATA TO DISPLAY **
const ProfileStats = () => {
    return (
        <div className="profile-stats">
            <div className="stat-card">
                <img src={shareIcon} alt='share' className="stat-pic"/>
                <p>แบ่งปันอาหาร</p>
                <strong>3</strong>
            </div>
            <div className="stat-card">
                <img src={trashIcon} alt='trash' className="stat-pic"/>
                <p>ลดขยะอาหาร</p>
                <strong>25</strong>
            </div>
            <div className="stat-card">
                <img src={expireIcon} alt='eatBeforeExpire' className="stat-pic"/>
                <p>กินก่อนหมดอายุ</p>
                <strong>10</strong>
            </div>
        </div>
    );
};

export default ProfileStats