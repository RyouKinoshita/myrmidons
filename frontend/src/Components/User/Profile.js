import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../Layout/Metadata';
import { getUser } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import { fontFamily, textAlign } from '@mui/system';
import Button from '@mui/material/Button';
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

   
    const profileButtonStyle = {
        padding: '10px 20px',
        margin: '5px',
        textDecoration: 'none',
        color: 'black',
        borderRadius: '5px',
        backgroundColor: 'yellow',
        border: 'none'
    };

    return (
        <Fragment>
            <MetaData title={'Your Profile'} />
            <br/>
            <br/>
            <br/>
           <br/>
<div className='container' style={{justifyContent:"center",textAlign:"center"}}>
    <div class="cardlang" style={{marginLeft:"350px", backgroundColor:"gray"}}>
        <div class="firstinfo"><img src={user.avatar && user.avatar.url} alt={user.name} />
            <div class="profileinfo">
                <h1 >{user.name}</h1>
                <h3 style={{color:"#00bcd4",fontWeight:"bold"}}>{user.email}</h3>
                
            </div>
            
        </div>
        <Button color="secondary" href="/me/update" style={{color:"yellow"}}>Update Profile</Button><br></br>
        <Button color="secondary" href="/password/update" style={{color:"yellow"}}>Change Password</Button><br></br>
        {user.role !== 'admin' && (
                                <Button color="secondary" href="/orders/me" style={{color:"yellow"}}>My Orders</Button>
                            )}
        
    </div>
    
    </div>
        </Fragment>
    );
};

export default Profile;
