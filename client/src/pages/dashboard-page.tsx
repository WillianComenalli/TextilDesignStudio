import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarMenuItem, SidebarMenuButton, SidebarMenu } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, FileText, Target, BarChart2, Settings, LogOut, Users, Palette } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardPage() {
  const { user, logoutMutation } = useAuth();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.role}</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <MessageSquare className="h-4 w-4" />
                    <span>Feedback</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <FileText className="h-4 w-4" />
                    <span>Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Target className="h-4 w-4" />
                    <span>Goals</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <BarChart2 className="h-4 w-4" />
                    <span>Surveys</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Users className="h-4 w-4" />
                    <span>Teams</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <div className="mt-auto">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => logoutMutation.mutate()}>
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {/* Updates Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>PD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-medium">Print Development</h4>
                    <p className="text-sm text-gray-500">Latest update on development progress</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto">View</Button>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>DM</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-medium">Design Manager</h4>
                    <p className="text-sm text-gray-500">Update on design approvals</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Development Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Development Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Print Development</span>
                      <span className="text-sm text-gray-500">75%</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Design Review</span>
                      <span className="text-sm text-gray-500">60%</span>
                    </div>
                    <Progress value={60} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Designs */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Designs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({length: 3}).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Palette className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Pattern Design {i + 1}</h4>
                        <p className="text-xs text-gray-500">Due in {3 - i} days</p>
                      </div>
                      <Button size="sm" variant="outline" className="ml-auto">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feedback Results */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Are designs meeting market demands?</h4>
                    <Progress value={80} className="bg-green-100" />
                    <span className="text-xs text-gray-500">80% positive feedback</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Design team productivity</h4>
                    <Progress value={90} className="bg-blue-100" />
                    <span className="text-xs text-gray-500">90% efficiency rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help & Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Help & Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">Support Center</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">Learning Resources</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">Manage Designs</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}