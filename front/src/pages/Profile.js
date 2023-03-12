import React from 'react'
import { useAuthContext } from "../hooks/useAuthContext";

function Profile() {
    const { user } = useAuthContext();

  return (
    <div className='profile'>

        <h1>Profile</h1>
        <h3>{user.name}</h3>
        <p>{user.role}</p>
      
    </div>
  )
}

export default Profile
