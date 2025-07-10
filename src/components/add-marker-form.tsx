"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { EventType, MarkerData } from "@/types";
import { eventTypes } from "@/types";
import { summarizeEventDetails } from "@/ai/flows/summarize-event-details";
import { useTransition, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must not exceed 500 characters."
  }),
  type: z.enum(["event", "power-outage", "waterlogging"]),
});

type AddMarkerFormProps = {
  position: google.maps.LatLngLiteral;
  onSave: (data: Omit<MarkerData, 'id'>) => void;
  onCancel: () => void;
};

export function AddMarkerForm({ position, onSave, onCancel }: AddMarkerFormProps) {
  const [isSummarizing, startSummarizeTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      type: "event",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({ ...values, lat: position.lat, lng: position.lng, type: values.type as EventType });
  }

  const handleSummarize = async () => {
    const description = form.getValues("description");
    if (!description || description.trim().length < 20) {
      toast({
        title: "Cannot Summarize",
        description: "Please provide a longer description (at least 20 characters) to summarize.",
        variant: "destructive"
      });
      return;
    }
    
    startSummarizeTransition(async () => {
      try {
        const result = await summarizeEventDetails({ eventDetails: description });
        if (result.summary) {
          form.setValue("description", result.summary);
          toast({
            title: "Summary Generated",
            description: "The event description has been summarized.",
          });
        }
      } catch (error) {
        console.error("Failed to summarize:", error);
        toast({
          title: "Summarization Failed",
          description: "Could not generate a summary. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Add New Marker</CardTitle>
        <CardDescription>
          Provide details for the new marker at the selected location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an incident type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes.map(et => (
                        <SelectItem key={et.value} value={et.value}>{et.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Description</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSummarize}
                      disabled={isSummarizing}
                    >
                      {isSummarizing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Summarize with AI
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the incident..."
                      className="resize-none"
                      {...field}
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Marker</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
