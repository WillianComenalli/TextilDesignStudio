import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPatternSchema, insertBriefingSchema, insertReferenceSchema } from "@shared/schema";
import { type Pattern, type Briefing, type Reference } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Upload, ImagePlus } from "lucide-react";

export default function ProjectPage() {
  const [, params] = useRoute("/projects/:id");
  const projectId = Number(params?.id);
  const { toast } = useToast();

  const { data: patterns } = useQuery<Pattern[]>({
    queryKey: ["/api/projects", projectId, "patterns"],
  });

  const { data: briefings } = useQuery<Briefing[]>({
    queryKey: ["/api/projects", projectId, "briefings"],
  });

  const { data: references } = useQuery<Reference[]>({
    queryKey: ["/api/projects", projectId, "references"],
  });

  const createPatternMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", `/api/projects/${projectId}/patterns`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "patterns"] });
      toast({ title: "Pattern uploaded successfully" });
    },
  });

  const createBriefingMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", `/api/projects/${projectId}/briefings`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "briefings"] });
      toast({ title: "Briefing added successfully" });
    },
  });

  const createReferenceMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", `/api/projects/${projectId}/references`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "references"] });
      toast({ title: "Reference added successfully" });
    },
  });

  return (
    <div className="min-h-screen p-8">
      <Tabs defaultValue="patterns" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="briefings">Briefings</TabsTrigger>
            <TabsTrigger value="references">References</TabsTrigger>
          </TabsList>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Content</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="pattern">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="pattern">Pattern</TabsTrigger>
                  <TabsTrigger value="briefing">Briefing</TabsTrigger>
                  <TabsTrigger value="reference">Reference</TabsTrigger>
                </TabsList>
                <TabsContent value="pattern">
                  <PatternForm onSubmit={(data) => createPatternMutation.mutate(data)} />
                </TabsContent>
                <TabsContent value="briefing">
                  <BriefingForm onSubmit={(data) => createBriefingMutation.mutate(data)} />
                </TabsContent>
                <TabsContent value="reference">
                  <ReferenceForm onSubmit={(data) => createReferenceMutation.mutate(data)} />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="patterns" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patterns?.map((pattern) => (
            <Card key={pattern.id}>
              <CardHeader>
                <CardTitle>{pattern.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={pattern.imageUrl} alt={pattern.title} className="w-full h-48 object-cover rounded-md" />
                <div className="mt-4 flex justify-between items-center">
                  <span className="capitalize px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {pattern.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(pattern.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="briefings" className="space-y-6">
          {briefings?.map((briefing) => (
            <Card key={briefing.id}>
              <CardContent className="pt-6">
                <pre className="whitespace-pre-wrap">{JSON.stringify(briefing.content, null, 2)}</pre>
                <div className="mt-4 text-sm text-gray-500 text-right">
                  {new Date(briefing.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="references" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {references?.map((reference) => (
            <Card key={reference.id}>
              <CardHeader>
                <CardTitle>{reference.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={reference.imageUrl} alt={reference.title} className="w-full h-48 object-cover rounded-md" />
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-gray-600">{reference.source}</span>
                  <span className="text-gray-500">
                    {new Date(reference.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PatternForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const form = useForm({
    resolver: zodResolver(insertPatternSchema),
    defaultValues: {
      status: "draft",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Pattern Title</Label>
        <Input id="title" {...form.register("title")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <div className="flex gap-2">
          <Input id="imageUrl" {...form.register("imageUrl")} />
          <Button type="button" variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full">Upload Pattern</Button>
    </form>
  );
}

function BriefingForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const form = useForm({
    resolver: zodResolver(insertBriefingSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Briefing Content</Label>
        <Textarea 
          id="content" 
          {...form.register("content")}
          onChange={(e) => {
            try {
              const json = JSON.parse(e.target.value);
              form.setValue("content", json);
            } catch (err) {
              // Invalid JSON, ignore
            }
          }}
        />
      </div>
      <Button type="submit" className="w-full">Add Briefing</Button>
    </form>
  );
}

function ReferenceForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const form = useForm({
    resolver: zodResolver(insertReferenceSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Reference Title</Label>
        <Input id="title" {...form.register("title")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <div className="flex gap-2">
          <Input id="imageUrl" {...form.register("imageUrl")} />
          <Button type="button" variant="outline" size="icon">
            <ImagePlus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="source">Source</Label>
        <Input id="source" {...form.register("source")} />
      </div>
      <Button type="submit" className="w-full">Add Reference</Button>
    </form>
  );
}
