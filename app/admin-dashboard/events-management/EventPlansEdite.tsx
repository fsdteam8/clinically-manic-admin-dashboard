'use client'

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useState } from "react"

type Event = {
  _id: string
  title: string
  description: string
  location: string
  date: string
  status: "upcoming" | "ongoing" | "completed"
}

type EditEventModalProps = {
  open: boolean
  onClose: () => void
  event: Event
  token: string
  onUpdated: () => void
}

export default function EditEventModal({ open, onClose, event, token, onUpdated }: EditEventModalProps) {
  const [title, setTitle] = useState(event.title || "")
  const [description, setDescription] = useState(event.description || "")
  const [location, setLocation] = useState(event.location || "")
  const [date, setDate] = useState(event.date ? new Date(event.date).toISOString().slice(0,16) : "")
  const [status, setStatus] = useState<Event["status"]>(event.status || "upcoming")
  const [loading, setLoading] = useState(false)

  // Update state if event changes
  React.useEffect(() => {
    setTitle(event.title || "")
    setDescription(event.description || "")
    setLocation(event.location || "")
    setDate(event.date ? new Date(event.date).toISOString().slice(0,16) : "")
    setStatus(event.status || "upcoming")
  }, [event])

  const handleUpdate = async () => {
    if (!title || !description || !location || !date || !status) {
      toast.error("Please fill all fields")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${event._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          location,
          date: new Date(date).toISOString(),
          status,
        }),
      })

      if (!res.ok) throw new Error("Failed to update event")

      toast.success("Event updated successfully")
      onUpdated()
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Failed to update event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input className="text-black" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Location</Label>
            <Input className="text-black" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Date & Time</Label>
            <Input className="text-black" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(val) => setStatus(val as Event["status"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
