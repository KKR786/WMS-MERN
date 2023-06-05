import React, { useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";

function Profile() {
    const { user } = useAuthContext();
    const [edit, setEdit] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = () => {
      console.log('hi')
    }

  return (
    <div className='section'>
      <div className='container'>
        <h1 className='mt-4 h2'>Profile</h1>
        <div className='row mt-5'>
          <div className='col-xl-8'>
            <div className='my-profile'>
              <h4>Profile Details</h4>
            </div>
          </div>
          <div className='col-xl-4'>
            <div className="my-profile">
              <h4 className="mb-4">Change password</h4>
              <form onSubmit={handleSubmit}>
                <label>Current Password:</label>
                <input
                  type="password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  value={currentPassword}
                  required
                />
                <label>New Password:</label>
                <input
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  required
                />
                <label>Confirm Password:</label>
                <input
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  required
                />
                <div className="submit">
                  <button className="passBtn">
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>  


        {/* <div className='profile-card mt-4'>
        <div className="card-header">
          <h1>{user.name}</h1>
          <span className="material-symbols-outlined" onClick={() => setEdit(true)}>
            edit_square
          </span> 
        </div>
        <div className="profile-card-body">
          <table>
            <tbody>
              <tr>
                <td><strong>Email</strong></td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td><strong>Department</strong></td>
                <td>{user.dept}</td>
              </tr>
              <tr>
                <td><strong>Role</strong></td>
                <td>{user.role}</td>
              </tr>
              <tr>
                <td><strong>Phone</strong></td>
                <td>{user.phone}</td>
              </tr>
            </tbody>
          </table>
      </div>
        </div> */}
        {/* {edit && 
          <div> Update </div>
        } */}
      </div>
    </div>
  )
}

export default Profile
