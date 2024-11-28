import { adminAuth } from '@/lib/firebaseAdmin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Create the user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      emailVerified: true,
    })

    // Set admin claim
    await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true })

    return NextResponse.json(
      { message: 'Admin user created successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating admin user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create admin user' },
      { status: 500 }
    )
  }
}
