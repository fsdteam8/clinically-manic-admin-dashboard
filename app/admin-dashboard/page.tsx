'use client'

import DashboardPage from '@/components/overview/dashboardPage'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const OverviewPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session?.user?.accessToken) {
      router.replace('/signin')
    }
  }, [status, session, router])

  if (!session?.user?.accessToken) {
    return null
  }

  return <DashboardPage />
}

export default OverviewPage
