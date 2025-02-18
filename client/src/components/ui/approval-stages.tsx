import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Check, X, Clock } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { ApprovalStage, ApprovalHistory } from "@shared/schema";

interface ApprovalStagesProps {
  patternId: number;
}

export function ApprovalStages({ patternId }: ApprovalStagesProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: stages } = useQuery<ApprovalStage[]>({
    queryKey: ["/api/approval-stages"],
    queryFn: async () => {
      const res = await fetch("/api/approval-stages");
      if (!res.ok) throw new Error("Failed to fetch approval stages");
      return res.json();
    },
  });

  const { data: approvals } = useQuery<ApprovalHistory[]>({
    queryKey: ["/api/patterns", patternId, "approvals"],
    queryFn: async () => {
      const res = await fetch(`/api/patterns/${patternId}/approvals`);
      if (!res.ok) throw new Error("Failed to fetch approvals");
      return res.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ stageId, status, comments }: { stageId: number; status: string; comments?: string }) => {
      const res = await fetch(`/api/patterns/${patternId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageId, status, comments }),
      });
      if (!res.ok) throw new Error("Failed to update approval status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patterns", patternId, "approvals"] });
      toast({
        title: "Success",
        description: "Pattern approval status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!stages || !approvals) return null;

  const currentStage = stages.find((stage: ApprovalStage) => 
    !approvals.some((approval: ApprovalHistory) => approval.stageId === stage.id)
  );

  const canApprove = currentStage?.requiredRole === user?.role;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Stages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stages.map((stage: ApprovalStage, index: number) => {
            const approval = approvals.find((a: ApprovalHistory) => a.stageId === stage.id);
            const isCurrentStage = currentStage?.id === stage.id;

            return (
              <div key={stage.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">
                      Stage {index + 1}: {stage.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {stage.description}
                    </p>
                  </div>
                  {approval ? (
                    <div className="flex items-center gap-2">
                      {approval.status === 'approved' ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : approval.status === 'rejected' ? (
                        <X className="h-5 w-5 text-red-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                      <span className="text-sm capitalize">{approval.status}</span>
                    </div>
                  ) : isCurrentStage && canApprove ? (
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          approveMutation.mutate({
                            stageId: stage.id,
                            status: "approved",
                          })
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          approveMutation.mutate({
                            stageId: stage.id,
                            status: "rejected",
                          })
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <Progress
                  value={approval ? 100 : isCurrentStage ? 50 : 0}
                  className="h-2"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}