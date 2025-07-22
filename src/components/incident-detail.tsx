import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Incident } from "@/types";
import { ArrowLeft, Contact, MoreVertical, ThumbsDown, ThumbsUp, Send, Share2 } from "lucide-react";
import Image from 'next/image';

type IncidentDetailProps = {
  incident: Incident;
  onBack: () => void;
};

export function IncidentDetail({ incident, onBack }: IncidentDetailProps) {
  return (
    <Card className="h-full flex flex-col border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-2 p-2 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{incident.title}</h2>
          <p className="text-sm text-muted-foreground">{incident.location_name}</p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical />
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full justify-around rounded-none bg-transparent border-b">
            <TabsTrigger value="about" className="flex-1 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">About</TabsTrigger>
            <TabsTrigger value="review" className="flex-1 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Review</TabsTrigger>
            <TabsTrigger value="socialMedia" className="flex-1 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Social Media</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="p-4">
             <Image 
                src={incident.image_url} 
                alt={incident.title} 
                width={400} 
                height={200} 
                className="w-full h-48 object-cover rounded-lg"
                data-ai-hint="incident scene"
                />
            <p className="mt-4 text-foreground">{incident.description}</p>
            <div className="flex justify-around mt-4">
              <Button variant="outline" className="flex-col h-auto py-2">
                <Send />
                <span>Directions</span>
              </Button>
              <Button variant="outline" className="flex-col h-auto py-2">
                <Contact />
                <span>Contact</span>
              </Button>
              <Button variant="outline" className="flex-col h-auto py-2">
                <MoreVertical />
                <span>More</span>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="review" className="p-4 space-y-4">
            <div className="flex items-center justify-around text-center">
              <div>
                <Button variant="ghost" size="icon" className="h-16 w-16 rounded-full bg-secondary">
                  <ThumbsUp className="h-8 w-8 text-green-500" />
                </Button>
                <p className="mt-2 font-bold text-lg">{incident.likes_count}</p>
                <p className="text-sm text-muted-foreground">Likes</p>
              </div>
              <div>
                <Button variant="ghost" size="icon" className="h-16 w-16 rounded-full bg-secondary">
                  <ThumbsDown className="h-8 w-8 text-red-500" />
                </Button>
                <p className="mt-2 font-bold text-lg">{incident.dislikes_count}</p>
                <p className="text-sm text-muted-foreground">Dislikes</p>
              </div>
              <div>
                <Button variant="ghost" size="icon" className="h-16 w-16 rounded-full bg-secondary">
                  <Share2 className="h-8 w-8 text-blue-500" />
                </Button>
                <p className="mt-2 font-bold text-lg">Share</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="socialMedia" className="p-4">
            <a href={incident.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              View on Social Media
            </a>
            <div className="mt-4 space-y-2">
              {incident.comments.map((comment, index) => (
                <div key={index} className="p-2 bg-secondary rounded-lg">
                  <p className="text-sm">{comment}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
