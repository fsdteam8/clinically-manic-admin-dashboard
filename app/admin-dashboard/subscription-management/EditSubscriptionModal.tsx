// 'use client'

// import { useState, useEffect } from "react"
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { X, Plus } from "lucide-react"
// import { toast } from "sonner"

// /* ---------------- Types ---------------- */
// type Subscription = {
//     _id: string
//     name: string
//     type: "monthly" | "yearly"
//     price: number
//     status: "active" | "inactive"
//     features: string[]
// }

// type Props = {
//     open: boolean
//     onClose: () => void
//     subscription: Subscription | null
//     token: string
//     onUpdated?: () => void
// }

// /* ---------------- Component ---------------- */
// export default function EditSubscriptionModal({
//     open,
//     onClose,
//     subscription,
//     token,
//     onUpdated,
// }: Props) {
//     const [name, setName] = useState("")
//     const [type, setType] = useState<"monthly" | "yearly">("yearly")
//     const [price, setPrice] = useState("")
//     const [status, setStatus] = useState<"active" | "inactive">("active")
//     const [featureInput, setFeatureInput] = useState("")
//     const [features, setFeatures] = useState<string[]>([])

//     useEffect(() => {
//         if (subscription) {
//             setName(subscription.name)
//             setType(subscription.type)
//             setPrice(String(subscription.price))
//             setStatus(subscription.status)
//             setFeatures(subscription.features || [])
//             setFeatureInput("")
//         }
//     }, [subscription])

//     /* ---------- Features handlers ---------- */
//     const addFeature = () => {
//         if (!featureInput.trim()) return
//         if (!features.includes(featureInput.trim())) {
//             setFeatures([...features, featureInput.trim()])
//         }
//         setFeatureInput("")
//     }

//     const removeFeature = (feature: string) => {
//         setFeatures(features.filter((f) => f !== feature))
//     }

//     /* ---------- Submit handler ---------- */
//     const handleSubmit = async () => {
//         if (!subscription) return

//         try {
//             const res = await fetch(
//                 `${process.env.NEXT_PUBLIC_API_URL}/subscription/${subscription._id}`,
//                 {
//                     method: "PUT",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                     body: JSON.stringify({
//                         name,
//                         type,
//                         price: Number(price),
//                         status,
//                         features,
//                     }),
//                 }
//             )

//             if (!res.ok) throw new Error("Failed to update subscription")

//             toast.success("Subscription updated successfully")
//             onUpdated?.()
//             onClose()
//         } catch (error) {
//             toast.error("Failed to update subscription")
//         }
//     }

//     if (!subscription) return null

//     return (
//         <Dialog open={open} onOpenChange={onClose}>
//             <DialogContent className="sm:max-w-xl rounded-2xl">
//                 <DialogHeader className="border-b pb-3">
//                     <DialogTitle className="text-lg font-semibold">
//                         Edit Subscription
//                     </DialogTitle>
//                 </DialogHeader>

//                 <div className="space-y-6 pt-4">
//                     {/* Name */}
//                     <div className="space-y-2">
//                         <Label className="text-sm font-medium">Plan Name</Label>
//                         <Input
//                             placeholder="e.g. Premium Plan"
//                             value={name}
//                             className=" text-black placeholder:text-gray-500"
//                             onChange={(e) => setName(e.target.value)}
//                         />
//                     </div>

//                     {/* Type & Price */}
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label className="text-sm font-medium">Billing Type</Label>
//                             <Select value={type} onValueChange={(v) => setType(v as any)}>
//                                 <SelectTrigger className="w-full">
//                                     <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="monthly">Monthly</SelectItem>
//                                     <SelectItem value="yearly">Yearly</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         <div className="space-y-2">
//                             <Label className="text-sm font-medium">Price</Label>
//                             <Input
//                                 type="number"
//                                 placeholder="999"
//                                 className=" text-black placeholder:text-gray-500"
//                                 value={price}
//                                 onChange={(e) => setPrice(e.target.value)}
//                             />
//                         </div>
//                     </div>

//                     {/* Status */}
//                     <div className="space-y-2">
//                         <Label className="text-sm font-medium">Status</Label>
//                         <Select value={status} onValueChange={(v) => setStatus(v as any)}>
//                             <SelectTrigger className="w-full">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="active">Active</SelectItem>
//                                 <SelectItem value="inactive">Inactive</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* Features */}
//                     <div className="space-y-2">
//                         <Label className="text-sm font-medium">Features</Label>

//                         <div className="rounded-lg border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
//                             <div className="flex flex-wrap items-center gap-2">
//                                 {features.map((feature) => (
//                                     <span
//                                         key={feature}
//                                         className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm"
//                                     >
//                                         {feature}
//                                         <button
//                                             type="button"
//                                             onClick={() => removeFeature(feature)}
//                                             className="opacity-60 hover:opacity-100"
//                                         >
//                                             <X className="h-3 w-3" />
//                                         </button>
//                                     </span>
//                                 ))}

//                                 {/* Input */}
//                                 <input
//                                     value={featureInput}
//                                     onChange={(e) => setFeatureInput(e.target.value)}
//                                     onKeyDown={(e) => {
//                                         if (e.key === "Enter") {
//                                             e.preventDefault()
//                                             addFeature()
//                                         }
//                                     }}
//                                     placeholder="Add feature"
//                                     className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
//                                 />

//                                 {/* Plus Icon */}
//                                 <button
//                                     type="button"
//                                     onClick={addFeature}
//                                     className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
//                                 >
//                                     <Plus className="h-4 w-4" />
//                                 </button>
//                             </div>
//                         </div>

//                         <p className="text-xs text-muted-foreground">
//                             Press Enter or click + to add feature
//                         </p>
//                     </div>
//                 </div>

//                 <DialogFooter className="mt-6 border-t pt-4">
//                     <Button variant="ghost" onClick={onClose}>
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSubmit}>Update Plan</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     )
// }


'use client'

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { X, Plus } from "lucide-react"
import { toast } from "sonner"

/* ---------------- Types ---------------- */
type Subscription = {
    _id: string
    name: "exclusive" | "basic"
    type: "monthly" | "yearly"
    price: number
    status: "active" | "inactive"
    features: string[]
}

type Props = {
    open: boolean
    onClose: () => void
    subscription: Subscription | null
    token: string
    onUpdated?: () => void
}

/* ---------------- Component ---------------- */
export default function EditSubscriptionModal({
    open,
    onClose,
    subscription,
    token,
    onUpdated,
}: Props) {
    const [name, setName] = useState<"exclusive" | "basic">("basic")
    const [type, setType] = useState<"monthly" | "yearly">("yearly")
    const [price, setPrice] = useState("")
    const [status, setStatus] = useState<"active" | "inactive">("active")
    const [featureInput, setFeatureInput] = useState("")
    const [features, setFeatures] = useState<string[]>([])

    useEffect(() => {
        if (subscription) {
            setName(subscription.name)
            setType(subscription.type)
            setPrice(String(subscription.price))
            setStatus(subscription.status)
            setFeatures(subscription.features || [])
            setFeatureInput("")
        }
    }, [subscription])

    const addFeature = () => {
        if (!featureInput.trim()) return
        if (!features.includes(featureInput.trim())) {
            setFeatures([...features, featureInput.trim()])
        }
        setFeatureInput("")
    }

    const removeFeature = (feature: string) => {
        setFeatures(features.filter((f) => f !== feature))
    }

    const handleSubmit = async () => {
        if (!subscription) return

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/subscription/${subscription._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name,
                        type,
                        price: Number(price),
                        status,
                        features,
                    }),
                }
            )

            if (!res.ok) throw new Error("Failed to update subscription")

            toast.success("Subscription updated successfully")
            onUpdated?.()
            onClose()
        } catch {
            toast.error("Failed to update subscription")
        }
    }

    if (!subscription) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl bg-gray-900 rounded-lg p-6 border border-gray-800">
                {/* HEADER */}
                <DialogHeader>
                    <DialogTitle className="text-white text-lg font-semibold">
                        Edit Subscription
                    </DialogTitle>
                </DialogHeader>

                {/* BODY */}
                <div className="space-y-6 pt-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label className="text-gray-200 text-sm font-medium">
                            Plan Name
                        </Label>

                        <Select value={name} onValueChange={(v) => setName(v as "exclusive" | "basic")}>
                            <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-700">
                                <SelectValue placeholder="Select plan name" />
                            </SelectTrigger>

                            <SelectContent className="bg-gray-800 text-white border border-gray-700">
                                <SelectItem value="exclusive">Exclusive</SelectItem>
                                <SelectItem value="basic">Basic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Type & Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-gray-200 text-sm font-medium">Billing Type</Label>
                            <Select value={type} onValueChange={(v) => setType(v as any)}>
                                <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 text-white">
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-200 text-sm font-medium">Price</Label>
                            <Input
                                type="number"
                                placeholder="999"
                                className="bg-gray-800 text-white border border-gray-700 placeholder-gray-500"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label className="text-gray-200 text-sm font-medium">Status</Label>
                        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                            <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white">
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                        <Label className="text-gray-200 text-sm font-medium">Features</Label>

                        <div className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                            <div className="flex flex-wrap items-center gap-2">
                                {features.map((feature) => (
                                    <span
                                        key={feature}
                                        className="flex items-center gap-1 rounded-md bg-gray-700 px-2 py-1 text-sm text-white"
                                    >
                                        {feature}
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(feature)}
                                            className="opacity-60 hover:opacity-100 text-white"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}

                                <input
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            addFeature()
                                        }
                                    }}
                                    placeholder="Add feature"
                                    className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder-gray-400 text-white"
                                />

                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="ml-auto rounded-md p-1 text-gray-300 hover:bg-gray-700 hover:text-white"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <p className="text-xs text-gray-400">
                            Press Enter or click + to add feature
                        </p>
                    </div>
                </div>

                {/* FOOTER */}
                <DialogFooter className="mt-6 border-t border-gray-800 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Update Plan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
