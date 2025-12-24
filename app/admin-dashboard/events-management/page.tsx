"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/reusable/data-table"
import { PageHeader } from "@/components/reusable/page-header"
import { dummyEvents, type Event } from "@/lib/data/dummy-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Plus } from "lucide-react"

const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "upcoming" ? "default" : status === "ongoing" ? "secondary" : "outline"}>
          {status}
        </Badge>
      )
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

export default function EventsManagementPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Events Management"
        description="Manage events and special occasions"
        action={{
          label: "Add Event",
          onClick: () => console.log("Add event"),
          icon: <Plus className="mr-2 h-4 w-4" />,
        }}
      />
      <DataTable columns={columns} data={dummyEvents} searchKey="title" searchPlaceholder="Search events..." />
    </div>
  )
}
