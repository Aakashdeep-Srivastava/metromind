export default function SetupPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">MetroMind Setup</h1>
          <p className="text-muted-foreground">Configure your MetroMind app settings</p>
        </div>

        <div className="max-w-md mx-auto p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Authentication</h2>
          <p className="text-muted-foreground mb-4">
            MetroMind uses Clerk for authentication. To enable sign-in features,
            add your Clerk keys to <code className="bg-muted px-1 rounded">.env.local</code>
          </p>
          <div className="bg-muted p-4 rounded-md text-sm font-mono">
            <p>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...</p>
            <p>CLERK_SECRET_KEY=sk_...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
