// Secure authentication utilities for medical data access

export interface SecureAuthResult {
  authenticated: boolean;
  method?: 'biometric' | 'pin' | '2fa';
  timestamp?: string;
}

/**
 * Check if WebAuthn (biometric/PIN) is available on this device
 */
export const isBiometricAvailable = async (): Promise<boolean> => {
  if (!window.PublicKeyCredential) {
    return false
  }
  
  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    return available
  } catch (err) {
    console.error('Biometric check failed:', err)
    return false
  }
}

/**
 * Request biometric authentication (fingerprint, face, or device PIN)
 */
export const requestBiometricAuth = async (): Promise<SecureAuthResult> => {
  try {
    const available = await isBiometricAvailable()
    
    if (!available) {
      return { authenticated: false }
    }

    // Create a challenge for authentication
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)

    const publicKeyOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      timeout: 60000,
      userVerification: 'required'
    }

    const credential = await navigator.credentials.get({
      publicKey: publicKeyOptions
    })

    if (credential) {
      // Store auth session
      sessionStorage.setItem('medicalDataAuth', JSON.stringify({
        authenticated: true,
        timestamp: new Date().toISOString(),
        method: 'biometric'
      }))

      return {
        authenticated: true,
        method: 'biometric',
        timestamp: new Date().toISOString()
      }
    }

    return { authenticated: false }
  } catch (err) {
    console.error('Biometric auth failed:', err)
    return { authenticated: false }
  }
}

/**
 * Verify 2FA code sent to registered device/email
 */
export const verify2FACode = async (code: string): Promise<SecureAuthResult> => {
  try {
    // Call your backend API to verify 2FA code
    const response = await fetch('/api/auth/verify-2fa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      
      sessionStorage.setItem('medicalDataAuth', JSON.stringify({
        authenticated: true,
        timestamp: new Date().toISOString(),
        method: '2fa'
      }))

      return {
        authenticated: true,
        method: '2fa',
        timestamp: new Date().toISOString()
      }
    }

    return { authenticated: false }
  } catch (err) {
    console.error('2FA verification failed:', err)
    return { authenticated: false }
  }
}

/**
 * Request 2FA code to be sent
 */
export const request2FACode = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/request-2fa', {
      method: 'POST',
      credentials: 'include'
    })

    return response.ok
  } catch (err) {
    console.error('2FA request failed:', err)
    return false
  }
}

/**
 * Check if user has valid medical data authentication
 */
export const hasMedicalDataAccess = (): boolean => {
  const auth = sessionStorage.getItem('medicalDataAuth')
  
  if (!auth) {
    return false
  }

  try {
    const authData = JSON.parse(auth)
    const authTime = new Date(authData.timestamp)
    const now = new Date()
    
    // Auth expires after 30 minutes
    const thirtyMinutes = 30 * 60 * 1000
    const expired = (now.getTime() - authTime.getTime()) > thirtyMinutes
    
    return authData.authenticated && !expired
  } catch (err) {
    return false
  }
}

/**
 * Clear medical data authentication
 */
export const clearMedicalDataAuth = (): void => {
  sessionStorage.removeItem('medicalDataAuth')
}
