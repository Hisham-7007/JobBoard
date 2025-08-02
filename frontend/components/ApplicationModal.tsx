"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

interface ApplicationModalProps {
  jobId: string
  jobTitle: string
  company: string
  onClose: () => void
  onSuccess: () => void
}

export function ApplicationModal({ jobId, jobTitle, company, onClose, onSuccess }: ApplicationModalProps) {
  const [formData, setFormData] = useState({
    resume: "",
    coverLetter: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { token } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId,
          resume: formData.resume,
          coverLetter: formData.coverLetter,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Application submitted!",
          description: "Your application has been sent successfully.",
        })
        onSuccess()
      } else {
        setError(data.message || "Failed to submit application")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Submit your application for {jobTitle} at {company}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="resume">Resume/CV *</Label>
            <Textarea
              id="resume"
              placeholder="Paste your resume content here or provide a brief summary of your experience..."
              value={formData.resume}
              onChange={(e) => setFormData((prev) => ({ ...prev, resume: e.target.value }))}
              rows={8}
              required
            />
            <p className="text-xs text-gray-500">Include your work experience, education, and relevant skills.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter *</Label>
            <Textarea
              id="coverLetter"
              placeholder="Write a compelling cover letter explaining why you're perfect for this role..."
              value={formData.coverLetter}
              onChange={(e) => setFormData((prev) => ({ ...prev, coverLetter: e.target.value }))}
              rows={6}
              required
            />
            <p className="text-xs text-gray-500">
              Explain why you're interested in this position and what makes you a great fit.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
