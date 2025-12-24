"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/reusable/data-table"
import { PageHeader } from "@/components/reusable/page-header"
import { dummySubscribers, type Subscriber } from "@/lib/data/dummy-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Send } from "lucide-react"

const columns: ColumnDef<Subscriber>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "subscriptionType",
    header: "Subscription Type",
    cell: ({ row }) => {
      const type = row.getValue("subscriptionType") as string
      return <Badge variant="outline">{type}</Badge>
    },
  },
  {
    accessorKey: "joinedDate",
    header: "Joined Date",
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
          <Mail className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

export default function SubscribersManagementPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscribers Management"
        description="Manage newsletter subscribers and send broadcasts"
        action={{
          label: "Broadcast Email",
          onClick: () => console.log("Broadcast email"),
          icon: <Send className="mr-2 h-4 w-4" />,
        }}
      />
      <DataTable
        columns={columns}
        data={dummySubscribers}
        searchKey="email"
        searchPlaceholder="Search subscribers..."
      />
    </div>
  )
}
