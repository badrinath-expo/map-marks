import { MapApp } from '@/components/map-app';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to MapMarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-destructive font-semibold">
              Configuration Error
            </p>
            <p className="mt-2 text-muted-foreground">
              Google Maps API key is missing. Please add it to your environment variables to continue.
            </p>
            <p className="mt-4 text-sm text-foreground">
              Create a <code className="bg-muted px-1 py-0.5 rounded-sm">.env.local</code> file in the root of your project and add the following line:
            </p>
            <pre className="mt-2 p-3 bg-muted rounded-md text-sm overflow-x-auto">
              <code className="text-muted-foreground">
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
              </code>
            </pre>
             <p className="mt-4 text-sm text-muted-foreground">
              After adding the key, please restart your development server.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading Map...</div>}>
      <MapApp apiKey={apiKey} />
    </Suspense>
  );
}
