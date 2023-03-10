import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (email, name, role, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('/api/users/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, name, role, password })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      alert("User Created Successfully");
      // // save the user to local storage
      // localStorage.setItem('user', JSON.stringify(json))

      // // update the auth context
      // dispatch({type: 'LOGIN', payload: json})

      // // update loading state
      // setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}