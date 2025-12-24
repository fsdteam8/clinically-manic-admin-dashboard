"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/reusable/data-table"
import { PageHeader } from "@/components/reusable/page-header"
import { dummyContent, type Content } from "@/lib/data/dummy-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import { Plus } from "lucide-react"

const columns: ColumnDef<Content>[] = [
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => (
      <Image
        src={row.getValue("thumbnail") || "/placeholder.svg"}
        alt={row.getValue("title")}
        width={80}
        height={50}
        className="rounded-md object-cover"
      />
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "contentType",
    header: "Content Type",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("contentType")}</Badge>,
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
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
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

export default function ContentManagementPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        description="Manage articles, videos, and audio content"
        action={{
          label: "Add Content",
          onClick: () => console.log("Add content"),
          icon: <Plus className="mr-2 h-4 w-4" />,
        }}
      />
      <DataTable columns={columns} data={dummyContent} searchKey="title" searchPlaceholder="Search content..." />
    </div>
  )
}
