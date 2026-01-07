'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import EditEventModal from "./EventPlansEdite"

/* ---------------- Component ---------------- */
export default function EventsTable() {
    const { data: session } = useSession()
    const token = (session?.user as { accessToken?: string })?.accessToken
    const queryClient = useQueryClient()

    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [deleteTitle, setDeleteTitle] = useState("")
    const [editOpen, setEditOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<any>({})

    const page = 1
    const limit = 10

    /* ---------- GET events ---------- */
    const { data, isLoading, isError } = useQuery({
        queryKey: ["events", page],
        enabled: !!token,
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/event?page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!res.ok) {
                throw new Error("Failed to fetch events")
            }

            return res.json()
        },
    })

    /* ---------- DELETE mutation ---------- */
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/event/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!res.ok) throw new Error("Delete failed")
            return res.json()
        },
        onSuccess: () => {
            toast.success("Event deleted successfully")
            queryClient.invalidateQueries({ queryKey: ["events"] })
            setDeleteId(null)
        },
        onError: () => {
            toast.error("Failed to delete event")
        },
    })

    if (isLoading) {
        return (
            <div className="rounded-xl border p-6 text-center text-muted-foreground">
                Loading events...
            </div>
        )
    }

    if (isError) {
        return (
            <div className="rounded-xl border p-6 text-center text-destructive">
                Failed to load events
            </div>
        )
    }

    const events = data?.data ?? []

    return (
        <>
            {/* TABLE */}
            <div className="rounded-xl border bg-background/60 backdrop-blur p-4 shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {events.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    No events found
                                </TableCell>
                            </TableRow>
                        )}

                        {events.map((event: any) => (
                            <TableRow key={event._id}>
                                <TableCell className="font-medium capitalize">{event.title}</TableCell>
                                <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                                <TableCell>{event.location}</TableCell>
                                <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            event.status === "upcoming"
                                                ? "bg-blue-500/15 text-blue-500"
                                                : event.status === "ongoing"
                                                    ? "bg-amber-500/15 text-amber-500"
                                                    : "bg-emerald-500/15 text-emerald-500"
                                        }
                                    >
                                        {event.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* EDIT BUTTON */}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => {
                                                setSelectedEvent(event)
                                                setEditOpen(true)
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        {/* DELETE BUTTON */}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-destructive"
                                            onClick={() => {
                                                setDeleteId(event._id)
                                                setDeleteTitle(event.title)
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <EditEventModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                event={selectedEvent}
                token={token!}
                onUpdated={() => queryClient.invalidateQueries({ queryKey: ["events"] })}
            />

            {/* DELETE MODAL */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete event?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">{deleteTitle}</span>? This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                                if (deleteId) deleteMutation.mutate(deleteId)
                            }}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
