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
import EditSubscriptionModal from "./EditSubscriptionModal"

/* ---------------- Types ---------------- */
type Subscription = {
  _id: string
  name: string
  type: "monthly" | "yearly"
  price: number
  status: "active" | "inactive"
  features: string[]
}

/* ---------------- Component ---------------- */
export default function SubscriptionPlansTable() {
  const { data: session } = useSession()
  const token = (session?.user as { accessToken?: string })?.accessToken
  const queryClient = useQueryClient()

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState("")
  const [editOpen, setEditOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription>(
    {} as Subscription)

  const page = 1
  const limit = 10

  /* ---------- GET subscriptions ---------- */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["subscription", page],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error("Failed to fetch subscriptions")
      }

      return res.json()
    },
  })

  /* ---------- DELETE mutation ---------- */
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription/${id}`,
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
      toast.success("Subscription deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["subscription"] })
      setDeleteId(null)
    },
    onError: () => {
      toast.error("Failed to delete subscription")
    },
  })

  if (isLoading) {
    return (
      <div className="rounded-xl border p-6 text-center text-muted-foreground">
        Loading subscription plans...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border p-6 text-center text-destructive">
        Failed to load subscription plans
      </div>
    )
  }

  const subscriptions: Subscription[] = data?.data ?? []

  return (
    <>
      {/* TABLE */}
      <div className="rounded-xl border bg-background/60 backdrop-blur p-4 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {subscriptions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No subscription plans found
                </TableCell>
              </TableRow>
            )}

            {subscriptions.map((plan) => (
              <TableRow key={plan._id}>
                <TableCell className="font-medium capitalize">{plan.name}</TableCell>
                <TableCell>৳{plan.price}</TableCell>
                <TableCell className="capitalize">{plan.type}</TableCell>
                <TableCell className="max-w-xs truncate">{plan.features}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      plan.status === "active"
                        ? "bg-emerald-500/15 text-emerald-500"
                        : "bg-red-500/15 text-red-500"
                    }
                  >
                    {plan.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* EDIT BUTTON */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedSubscription(plan)
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
                        setDeleteId(plan._id)
                        setDeleteName(plan.name)
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

      {/* EDIT MODAL */}
      <EditSubscriptionModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        subscription={selectedSubscription}
        token={token!}
        onUpdated={() => queryClient.invalidateQueries({ queryKey: ["subscription"] })}
      />

      {/* DELETE MODAL */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteName}</span>? This action
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
