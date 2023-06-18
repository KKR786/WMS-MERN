import React, { useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";

function Profile() {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  React.useEffect(() => {
    const userData = async () => {
      const res = await fetch(`/api/users/unique?_id=${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const json = await res.json();
      
      if (res.ok) {
        const { name, email, company, department, designation, phone, location } = json.user;
        setName(name || '');
        setEmail(email || '');
        setCompany(company || '');
        setDepartment(department || '');
        setDesignation(designation || '');
        setPhone(phone || '');
        setLocation(location || '');
      }
    };
  
    if (user) {
      userData();
    }
  }, [user]);
  
  
  const handleSubmit = () => {
    console.log('hi')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const updatedUser = { name, email, company, department, designation, phone, location }
    
    const res = await fetch(`/api/users/profile/${user.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedUser),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      }
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error);
      setSuccess('')
    }
    if (res.ok) {
      setSuccess('Profile Updated Successfully')
      setError(null);
    }

  }

  return (
    <div className='section'>
      <div className='container'>
        <h1 className='mt-4 h2'>Profile</h1>
        <div className='row mt-5'>
          <div className='col-xl-8'>
            <div className='my-profile'>
              <h4>Profile Details</h4>
              <form className="d-flex flex-wrap justify-content-between mt-5" onSubmit={handleUpdate}>
                <label>Name:</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={emptyFields.includes("name") ? "error" : ""}
                />
                <label>Email:</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={emptyFields.includes("email") ? "error" : ""}
                />
                <label>Company:</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={emptyFields.includes("company") ? "error" : ""}
                />
                <label>Department:</label>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={emptyFields.includes("department") ? "error" : ""}
                />
                <label>Designation:</label>
                <input
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className={emptyFields.includes("designation") ? "error" : ""}
                />
                <label>Phone:</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={emptyFields.includes("phone") ? "error" : ""}
                />
                <label>Location (City, ST):</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={emptyFields.includes("location") ? "error" : ""}
                />
                <button className="passBtn" type='submit'>
                  Save Changes
                </button>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
              </form>
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