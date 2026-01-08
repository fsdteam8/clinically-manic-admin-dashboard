'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { PageHeader } from '@/components/reusable/page-header'
import { dummyOffers, type Offer } from '@/lib/data/dummy-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/reusable/data-table'

const columns: ColumnDef<Offer>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'discount',
    header: 'Discount',
    cell: ({ row }) => `${row.getValue('discount')}%`,
  },
  {
    accessorKey: 'validUntil',
    header: 'Valid Until',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

export default function OffersManagementPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Offers Management"
        description="Manage special offers and discounts"
        action={{
          label: 'Add Offer',
          onClick: () => console.log('Add offer'),
          icon: <Plus className="mr-2 h-4 w-4" />,
        }}
      />
      <DataTable
        columns={columns}
        data={dummyOffers}
        searchKey="title"
        searchPlaceholder="Search offers..."
      />
    </div>
  )
}
