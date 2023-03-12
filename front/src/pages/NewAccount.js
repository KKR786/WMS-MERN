import { useState } from "react"
import { useSignup } from "../hooks/useSignup"
import Select from 'react-select';

const NewAccount = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [photo, setPhoto] = useState('')
  const [password, setPassword] = useState('')
  const {signup, error, isLoading} = useSignup()

  const options = [
    { value: 'Super-Admin', label: 'Super-Admin' },
    { value: 'Admin', label: 'Admin' },
    { value: 'Employee', label: 'Employee' }
  ]
  console.log(role)
  const handleSubmit = async (e) => {
    e.preventDefault()

    await signup(email, name, role, password)
  }

  return (
    <div className="signup-box">
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Create New Account</h3>
      
      <label>Name:</label>
      <input 
        type="text" 
        onChange={(e) => setName(e.target.value)} 
        value={name} 
      />
      <label>Email address:</label>
      <input 
        type="email" 
        onChange={(e) => setEmail(e.target.value)} 
        value={email} 
      />
      {/*<label>Photo:</label>
      <input 
          type="file" 
          accept=".png, .jpg, .jpeg"
          name="photo"
          onChange= {(e) => setPhoto(e.target.files[0])}
      />*/}
      <label>Role:</label>
      <Select 
          placeholder = "Select Role"
          options = {options}
          value={options.find(obj => obj.value === role)}
          onChange = {(e) => setRole(e.value)}
          className="select-role"
        />
      <label className="mt-3">Password:</label>
      <input 
        type="password" 
        onChange={(e) => setPassword(e.target.value)} 
        value={password} 
      />
        <div className="addAccount">
            <button disabled={isLoading} className="addAccountBtn">Create</button>
        </div>
      {error && <div className="error">{error}</div>}
      
    </form>
    </div>
  )
}

export default NewAccount