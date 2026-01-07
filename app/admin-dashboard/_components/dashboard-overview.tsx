'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { StatCard } from '@/components/reusable/stat-card'
import { Users, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dummyContacts } from '@/lib/data/dummy-data'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { dashboardApi } from '@/lib/api/dashboardApi'

export default function DashboardPage() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken || ''
  const [selectedYear] = useState(new Date().getFullYear())

  const latestContacts = dummyContacts.slice(0, 4)

  // Fetch Dashboard Overview
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => dashboardApi.getOverview(token),
    enabled: !!token,
  })

  // Fetch Revenue Overview
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-overview', selectedYear],
    queryFn: () => dashboardApi.getRevenueOverview(selectedYear, token),
    enabled: !!token,
  })

  // Fetch User Growth
  const { data: userGrowthData, isLoading: userGrowthLoading } = useQuery({
    queryKey: ['user-growth'],
    queryFn: () => dashboardApi.getUserGrowth(token),
    enabled: !!token,
  })

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format number with commas
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-foreground mt-2">
          Welcome to Clinically Manic Admin Dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Users"
          value={
            overviewLoading ? '...' : formatNumber(overview?.totalUser || 0)
          }
          icon={Users}
          trend={{ value: 0, isPositive: true }}
          description="total registered users"
        />
        <StatCard
          title="Subscription Revenue"
          value={
            overviewLoading
              ? '...'
              : formatCurrency(overview?.subscriptionRevenue || 0)
          }
          icon={DollarSign}
          trend={{ value: 0, isPositive: true }}
          description="from subscriptions"
        />
        <StatCard
          title="Shop Revenue"
          value={
            overviewLoading ? '...' : formatCurrency(overview?.shopRevenue || 0)
          }
          icon={ShoppingBag}
          trend={{ value: 0, isPositive: true }}
          description="from shop sales"
        />
        <StatCard
          title="Total Revenue"
          value={
            overviewLoading
              ? '...'
              : formatCurrency(overview?.totalRevenue || 0)
          }
          icon={TrendingUp}
          trend={{ value: 0, isPositive: true }}
          description="combined earnings"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Overview Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview ({selectedYear})</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted-foreground"
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    stroke="currentColor"
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    stroke="currentColor"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--popover-foreground))',
                    }}
                    formatter={(value: any) => [
                      formatCurrency(value),
                      'Revenue',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            {userGrowthLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted-foreground"
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    stroke="currentColor"
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    stroke="currentColor"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--popover-foreground))',
                    }}
                    formatter={(value: any) => [value, 'Users']}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Latest Contact Messages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Latest Contact Messages</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin-dashboard/contact-management">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {latestContacts.map(contact => (
              <div
                key={contact.id}
                className="flex items-start justify-between border-b border-border pb-4 last:border-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{contact.name}</p>
                    <Badge
                      variant={
                        contact.status === 'new' ? 'default' : 'secondary'
                      }
                    >
                      {contact.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground">{contact.email}</p>
                  <p className="text-base font-medium">{contact.subject}</p>
                </div>
                <p className="text-sm text-foreground">{contact.createdAt}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
