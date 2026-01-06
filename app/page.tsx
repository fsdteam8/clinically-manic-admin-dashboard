'use client'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'

export default function Page() {
  const { data: session } = useSession()

  if (session?.user?.accessToken) {
    redirect('/admin-dashboard')
  }

  redirect('/signin')
}
