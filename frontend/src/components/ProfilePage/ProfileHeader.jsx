import React from 'react';
import './Profile.css'
//This page display information about user data such as ProfilePicture
//Username, Bio, LineID, and edit
//**THIS IS NOT FINAL VERSION JUST MOCK UP DATA FOR TESTING**
//**REQUIRE BACKEND API FOR GET USER PERSONAL DATA (profilepic,username,lineID) TO DISPLAY ** 
const ProfileHeader = () => {
    return (
        <div className='profile-header'>
            <div className='profile-img'/>
            <div className='profile-name'>Prapaporn Jaidee</div>
            <div className='profile-bio'>คนหล่อประจำแอปแต่อยากกินของเหลือ</div>
            <div className='line-info'>
                <span className='line-id'>LINE: neon2548</span>
                <button className='edit-btn'>✏️</button>
            </div>
        </div>
    );
};

export default ProfileHeader;