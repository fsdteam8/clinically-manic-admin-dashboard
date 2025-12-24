"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/reusable/data-table"
import { PageHeader } from "@/components/reusable/page-header"
import { dummySubscriptions, type Subscription } from "@/lib/data/dummy-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Plus } from "lucide-react"

const columns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
      return <span className="font-medium">{formatted}</span>
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "accessLevel",
    header: "Access Level",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return <Badge variant={status === "active" ? "default" : "secondary"}>{status}</Badge>
    },
  },
  {
    id: "actions",
    header: "Actions",
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

export default function SubscriptionManagementPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Management"
        description="Manage subscription plans and pricing"
        action={{
          label: "Add Subscription",
          onClick: () => console.log("Add subscription"),
          icon: <Plus className="mr-2 h-4 w-4" />,
        }}
      />
      <DataTable
        columns={columns}
        data={dummySubscriptions}
        searchKey="name"
        searchPlaceholder="Search subscriptions..."
      />
    </div>
  )
}
