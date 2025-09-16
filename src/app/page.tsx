import CVUpload from '@/components/cv-upload'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Upload Your CV
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Share your professional experience with us. Upload your CV or resume to get started.
            </p>
          </div>
          <CVUpload />
        </div>
      </div>
    </main>
  )
}
