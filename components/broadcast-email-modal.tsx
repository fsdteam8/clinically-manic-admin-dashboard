'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import 'react-quill/dist/quill.snow.css'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

// ✅ SSR-safe dynamic import for React Quill
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
})

type Props = {
    open: boolean
    onClose: () => void
}

export default function BroadcastEmailModal({ open, onClose }: Props) {
    const session = useSession();
    const token = (session?.data?.user as { accessToken: string })?.accessToken;
    const [subject, setSubject] = React.useState('')
    const [html, setHtml] = React.useState('')

    const createPlan = useMutation({
        mutationFn: async (body: { subject: string, html: string }) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/newsletter/broadcast`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(body),
                }
            );

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to create plan");
            }

            return res.json();
        },
        onSuccess: () => {
            toast.success("Plan created successfully");
            onClose();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create plan");
        },
    });

    const handleSend = () => {
        const payload = {
            subject,
            html,
        }

        createPlan.mutate(payload);
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Broadcast Email</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Subject */}
                    <div>
                        <label className="text-sm  font-medium">Subject</label>
                        <Input
                            placeholder=" Subject"
                            value={subject}
                            className='text-black'
                            onChange={e => setSubject(e.target.value)}
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div>
                        <label className="text-sm font-medium">Email Content</label>
                        <ReactQuill
                            theme="snow"
                            value={html}
                            onChange={setHtml}
                            placeholder="Write your email content here..."
                            className="bg-white quill-editor"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSend}>
                            Send Broadcast {createPlan.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
