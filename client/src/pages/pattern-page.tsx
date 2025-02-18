import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApprovalStages } from "@/components/ui/approval-stages";
import { Pattern } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function PatternPage() {
  const { id } = useParams<{ id: string }>();
  const patternId = parseInt(id);

  const { data: pattern, isLoading } = useQuery<Pattern>({
    queryKey: ["/api/patterns", patternId],
    queryFn: async () => {
      const res = await fetch(`/api/patterns/${patternId}`);
      if (!res.ok) throw new Error("Failed to fetch pattern");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!pattern) return <div>Pattern not found</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{pattern.title}</h1>
        <p className="text-muted-foreground">Pattern Details and Approval Status</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pattern Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <p className="text-sm text-muted-foreground capitalize">{pattern.status}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Preview</h4>
                <img 
                  src={pattern.imageUrl} 
                  alt={pattern.title}
                  className="mt-2 rounded-lg border"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <ApprovalStages patternId={patternId} />
      </div>
    </div>
  );
}
