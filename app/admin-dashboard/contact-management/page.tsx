"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/reusable/data-table"
import { PageHeader } from "@/components/reusable/page-header"
import { dummyContacts, type Contact } from "@/lib/data/dummy-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Mail, Trash2 } from "lucide-react"

const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "new" ? "default" : status === "read" ? "secondary" : "outline"}>{status}</Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Mail className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

export default function ContactManagementPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Contact Management" description="View and respond to contact messages" />
      <DataTable columns={columns} data={dummyContacts} searchKey="name" searchPlaceholder="Search contacts..." />
    </div>
  )
}
