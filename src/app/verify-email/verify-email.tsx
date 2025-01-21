"use clinet"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const VerifyEmailPage = () => {
  const router = useRouter()
  const { verifyToken, id } = router.query
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  // useEffect to handle the verification when the page is loaded
  useEffect(() => {
    if (verifyToken && id) {
      // Call the verifyEmail function once the token and id are available
      verifyEmail(verifyToken as string, id as string)
    }
  }, [verifyToken, id])

  const verifyEmail = async (token: string, userId: string) => {
    try {
      // Sending a POST request to the API to verify the email
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, userId }),
      })

      if (!response.ok) {
        throw new Error('Verification failed')
      }

      // If successful, set success state to true
      setSuccess(true)
    } catch (error) {
      // If there is an error, set the error state
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Email Verification</h1>
      {success && <p>Your email has been successfully verified!</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!success && !error && <p>Verifying your email...</p>}
    </div>
  )
}

export default VerifyEmailPage
