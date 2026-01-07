'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

/* -----------------------------
   API Data Type
----------------------------- */
type Newsletter = {
    _id: string
    email: string
}

export default function Subscription() {
    const { data: session } = useSession()
    const token = (session?.user as { accessToken?: string })?.accessToken

    const page = 1
    const limit = 10

    const { data, isLoading, isError } = useQuery({
        queryKey: ['newsletter', page],
        enabled: !!token, // wait for token
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/newsletter?page=${page}&limit=${limit}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            if (!res.ok) {
                throw new Error('Failed to fetch newsletters')
            }

            return res.json()
        },
    })

    const newsletters: Newsletter[] = data?.data ?? []
    const totalItems = data?.meta?.total ?? 0

    if (isLoading) {
        return <div className="p-4">Loading...</div>
    }

    if (isError) {
        return <div className="p-4 text-red-500">Failed to load data</div>
    }

    return (
        <div className="rounded-lg border p-4 space-y-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Id</TableHead>
                        <TableHead>Email</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {newsletters.length ? (
                        newsletters.map((item, index) => (
                            <TableRow key={item._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item?._id}</TableCell>
                                <TableCell>{item.email}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center">
                                No newsletters found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <p className="text-sm text-muted-foreground">
                Total subscribers: {totalItems}
            </p>
        </div>
    )
}
