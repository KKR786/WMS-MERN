import React from 'react'
import { useAuthContext } from "../hooks/useAuthContext";

function Profile() {
    const { user } = useAuthContext();

  return (
    <div className='section'>
      <div className='container'>
        <div className='profile'>
          <h1>{user.name}</h1>
        </div>
        <p>{user.role}</p>
      </div>
    </div>
  )
}

export default Profile
