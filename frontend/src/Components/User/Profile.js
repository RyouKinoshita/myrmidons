import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../Layout/Metadata';
import { getUser } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import { fontFamily, textAlign } from '@mui/system';

const Profile = () => {
    const [user, setUser] = useState('');

    const getProfile = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        };
        try {
            const { data } = await axios.get(`http://localhost:4001/api/v1/me`, config);
            setUser(data.user);
        } catch (error) {
            console.log(error);
            toast.error('Invalid user or password', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    const profileCardStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '20px',
        maxWidth: '700px',
        margin: 'auto',
        marginTop: '50px',
        backgroundColor: 'gray',
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "Georgia, serif"
    };

    const profilePictureStyle = {
        marginBottom: '20px',
        border:"5px solid black"
    };

    const profileButtonStyle = {
        padding: '10px 20px',
        margin: '5px',
        textDecoration: 'none',
        color: '#fff',
        borderRadius: '5px',
        backgroundColor: 'blue',
        border: 'none'
    };

    return (
        <Fragment>
            <MetaData title={'Your Profile'} />
            <div style={profileCardStyle}>
                <div style={profilePictureStyle}>
                    <img src={user.avatar && user.avatar.url} alt={user.name} />
                </div>
                <div className="profile-details">
                    <h2 style={{color:"black"}}>{user.name}</h2>
                    <p style={{color:"black"}}>Email: {user.email}</p>
                    <div className="buttons">
                        <Link to="/me/update" style={profileButtonStyle}>
                            Update Profile
                        </Link>
                        <Link to="/password/update" style={profileButtonStyle}>
                            Change Password
                        </Link>
                        {user.role !== 'admin' && (
                            <Link
                                to="/orders/me"
                                
                                style={profileButtonStyle}
                            >
                                My Orders
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Profile;
