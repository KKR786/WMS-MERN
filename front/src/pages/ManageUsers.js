import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from "../hooks/useAuthContext";

function ManageUsers() {
  const { user, users, dispatch } = useAuthContext()
  const [ domainForm, setDomainForm ] = useState(false)

  React.useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await res.json();

      if (res.ok) {
        dispatch({ type: 'GET_USERS', payload: json })
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [ user]);
  console.log(users)
  return (
    <div className="section">
      <div className="container">
        <h1 className="text-center my-4">Users</h1>
        <div className="d-flex align-items-center justify-content-between">
          <h2 className='list-heading'>Users List</h2>
          <Link className="add-link" to="/signup">
            <span className="material-symbols-outlined mr-2">
              person_add
            </span>
            Add New User
          </Link>
        </div>
        <div className="mt-5 pr-5">
          <ul className="list-unstyled">
            {users &&
              users.map((user, i) =>
                <li key={i}>
                  <div className="user-card">
                    <h4 className='h3'>{user.name}</h4>
                    <span>Email: {user.email}</span>
                    <span>Role: {user.role}</span>
                  </div>
                </li>  
              )
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ManageUsers
