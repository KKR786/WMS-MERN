import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

function UsersProfile() {
    const { user } = useAuthContext();
    const params = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');

    React.useEffect(() => {
        const userData = async () => {
            const res = await fetch(`/api/users/unique?_id=${params.userId}`, {
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
    }, [user, params]);

    return (
        <div className="section">
            <div className="container">
                <div className='profile-card mt-4'>
                    <div className="card-header">
                        <h1>{name}</h1>
                    </div>
                    <div className="profile-card-body">
                        <table>
                            <tbody>
                                <tr>
                                    <td><strong>Email</strong></td>
                                    <td>{email}</td>
                                </tr>
                                <tr>
                                    <td><strong>Company</strong></td>
                                    <td>{company}</td>
                                </tr>
                                <tr>
                                    <td><strong>Department</strong></td>
                                    <td>{department}</td>
                                </tr>
                                <tr>
                                    <td><strong>Designation</strong></td>
                                    <td>{designation}</td>
                                </tr>
                                <tr>
                                    <td><strong>Phone</strong></td>
                                    <td>{phone}</td>
                                </tr>
                                <tr>
                                    <td><strong>Location</strong></td>
                                    <td>{location}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersProfile
