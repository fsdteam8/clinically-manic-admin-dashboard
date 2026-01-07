// 'use client'

// import * as React from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
// import { toast } from "sonner"
// import { useSession } from "next-auth/react"

// type AddEventModalProps = {
//     open: boolean
//     onClose: () => void
// }

// export default function AddEventModal({ open, onClose }: AddEventModalProps) {
//     const [title, setTitle] = React.useState("")
//     const [description, setDescription] = React.useState("")
//     const [location, setLocation] = React.useState("")
//     const [date, setDate] = React.useState("")
//     const [status, setStatus] = React.useState<"upcoming" | "ongoing" | "completed">("upcoming")
//     const [loading, setLoading] = React.useState(false)
//     const { data: session } = useSession()
//     const token = (session?.user as { accessToken?: string })?.accessToken

//     // Reset form whenever modal opens
//     React.useEffect(() => {
//         if (open) {
//             setTitle("")
//             setDescription("")
//             setLocation("")
//             setDate("")
//             setStatus("upcoming")
//         }
//     }, [open])

//     const handleAdd = async () => {
//         if (!title || !description || !location || !date || !status) {
//             toast.error("Please fill all fields")
//             return
//         }

//         setLoading(true)
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                     title,
//                     description,
//                     location,
//                     date: new Date(date).toISOString(),
//                     status,
//                 }),
//             })

//             if (!res.ok) throw new Error("Failed to add event")

//             toast.success("Event added successfully")
//             onClose() // Close modal
//         } catch (err: any) {
//             toast.error(err.message || "Failed to add event")
//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <Dialog open={open} onOpenChange={onClose}>
//             <DialogContent className="sm:max-w-lg">
//                 <DialogHeader>
//                     <DialogTitle>Add New Event</DialogTitle>
//                 </DialogHeader>

//                 <div className="grid gap-4 py-4">
//                     <div className="grid gap-2">
//                         <Label>Title</Label>
//                         <Input className="text-black" value={title} onChange={(e) => setTitle(e.target.value)} />
//                     </div>

//                     <div className="grid gap-2">
//                         <Label>Description</Label>
//                         <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
//                     </div>

//                     <div className="grid gap-2">
//                         <Label>Location</Label>
//                         <Input className="text-black" value={location} onChange={(e) => setLocation(e.target.value)} />
//                     </div>

//                     <div className="grid gap-2">
//                         <Label>Date & Time</Label>
//                         <Input className="text-black" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
//                     </div>

//                     <div className="grid gap-2">
//                         <Label>Status</Label>
//                         <Select value={status} onValueChange={(val) => setStatus(val as "upcoming" | "ongoing" | "completed")}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Select status" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="upcoming">Upcoming</SelectItem>
//                                 <SelectItem value="ongoing">Ongoing</SelectItem>
//                                 <SelectItem value="completed">Completed</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>

//                 <div className="flex justify-end space-x-2 pt-4">
//                     <Button variant="outline" onClick={onClose} disabled={loading}>
//                         Cancel
//                     </Button>
//                     <Button onClick={handleAdd} disabled={loading}>
//                         {loading ? "Adding..." : "Add Event"}
//                     </Button>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     )
// }

'use client'

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

type AddEventModalProps = {
    open: boolean
    onClose: () => void
}

export default function AddEventModal({ open, onClose }: AddEventModalProps) {
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [location, setLocation] = React.useState("")
    const [date, setDate] = React.useState("")
    const [status, setStatus] = React.useState<"upcoming" | "ongoing" | "completed">("upcoming")
    const [loading, setLoading] = React.useState(false)
    const { data: session } = useSession()
    const token = (session?.user as { accessToken?: string })?.accessToken

    // Reset form whenever modal opens
    React.useEffect(() => {
        if (open) {
            setTitle("")
            setDescription("")
            setLocation("")
            setDate("")
            setStatus("upcoming")
        }
    }, [open])

    const handleAdd = async () => {
        if (!title || !description || !location || !date || !status) {
            toast.error("Please fill all fields")
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
                method: "POST",
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

            if (!res.ok) throw new Error("Failed to add event")

            toast.success("Event added successfully")
            onClose() // Close modal
        } catch (err: any) {
            toast.error(err.message || "Failed to add event")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-gray-900 rounded-lg p-6 border border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-white text-xl">{'Add New Event'}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label className="text-gray-200">Title</Label>
                        <Input
                            className="bg-gray-800 text-white border border-gray-700"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Event title"
                            disabled={loading}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-gray-200">Description</Label>
                        <Textarea
                            className="bg-gray-800 text-white border border-gray-700 resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Event description"
                            disabled={loading}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-gray-200">Location</Label>
                        <Input
                            className="bg-gray-800 text-white border border-gray-700"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Event location"
                            disabled={loading}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-gray-200">Date & Time</Label>
                        <Input
                            type="datetime-local"
                            className="bg-gray-800 text-white border border-gray-700"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-gray-200">Status</Label>
                        <Select
                            value={status}
                            onValueChange={(val) => setStatus(val as "upcoming" | "ongoing" | "completed")}
                            disabled={loading}
                        >
                            <SelectTrigger className="bg-gray-800 text-white border border-gray-700">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white">
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-800">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} disabled={loading}>
                        {loading ? "Adding..." : "Add Event"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
