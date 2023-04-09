import React, { useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";

function Profile() {
    const { user } = useAuthContext();
    const [edit, setEdit] = useState(false)

  return (
    <div className='section'>
      <div className='container'>
        <div className='profile-card mt-4'>
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
        {/* <p>
          <strong>Department:</strong> {department}
        </p> */}
      </div>
        </div>
        {edit && 
          <div> Update </div>
        }
      </div>
    </div>
  )
}

export default Profile
