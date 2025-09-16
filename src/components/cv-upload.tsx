"use client"
import { useState, useCallback } from "react"
import type React from "react"

import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CVUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Handle file selection
  const handleFileChange = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    setMessage("")
    setUploadSuccess(false)
  }, [])

  // Handle drag and drop events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0) {
        const droppedFile = droppedFiles[0]
        if (
          droppedFile.type.startsWith("image/") ||
          droppedFile.type === "application/pdf" ||
          droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          handleFileChange(droppedFile)
        } else {
          setMessage("Please upload an image, PDF, or Word document.")
        }
      }
    },
    [handleFileChange],
  )

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileChange(selectedFile)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setMessage("Please select a file first!")
      return
    }

    setIsLoading(true)
    setMessage("")

    const formData = new FormData()
    formData.append("data", file) // Matches Postman key "data"

    try {
      const response = await axios.post(
        "https://muhammad225.app.n8n.cloud/webhook/28ae10b2-306f-45fa-a003-0e70bc1da251",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      setMessage("CV uploaded successfully! We'll review it shortly.")
      setUploadSuccess(true)
      console.log("Response:", response.data)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
            ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Unknown error"
            : "Unknown error"

      setMessage("Error uploading CV: " + errorMessage)
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Area */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer group",
              isDragOver
                ? "border-primary bg-primary/5 scale-[1.02]"
                : file
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50",
              "min-h-[200px] flex flex-col items-center justify-center",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*,.pdf,.docx,.doc"
              onChange={handleInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center space-y-4">
              {file ? (
                <>
                  <div className="p-3 rounded-full bg-accent/10">
                    <FileText className="h-8 w-8 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Click to change file or drag a new one here</p>
                </>
              ) : (
                <>
                  <div
                    className={cn(
                      "p-4 rounded-full transition-colors",
                      isDragOver ? "bg-primary/10" : "bg-muted group-hover:bg-primary/10",
                    )}
                  >
                    <Upload
                      className={cn(
                        "h-10 w-10 transition-colors",
                        isDragOver ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-foreground">
                      {isDragOver ? "Drop your CV here" : "Upload your CV"}
                    </p>
                    <p className="text-sm text-muted-foreground">Drag and drop your file here, or click to browse</p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>Supports:</span>
                    <span className="px-2 py-1 bg-muted rounded-md">PDF</span>
                    <span className="px-2 py-1 bg-muted rounded-md">DOCX</span>
                    <span className="px-2 py-1 bg-muted rounded-md">Images</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!file || isLoading}
            className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02]"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Uploading CV...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Upload CV
              </>
            )}
          </Button>

          {/* Status Message */}
          {message && (
            <div
              className={cn(
                "flex items-center space-x-2 p-4 rounded-lg border",
                uploadSuccess
                  ? "bg-accent/10 border-accent/20 text-accent-foreground"
                  : message.includes("Error")
                    ? "bg-destructive/10 border-destructive/20 text-destructive"
                    : "bg-muted border-border text-muted-foreground",
              )}
            >
              {uploadSuccess ? (
                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
              ) : message.includes("Error") ? (
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              ) : null}
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
