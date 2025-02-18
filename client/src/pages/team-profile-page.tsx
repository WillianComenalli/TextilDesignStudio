
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function TeamProfilePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Development Profile</h1>
        <Button asChild>
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Design team</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Upload design</p>
                <p className="text-xs text-gray-400">Acceptable formats: jpg, png, pdf</p>
              </div>
            </div>

            <div>
              <Label htmlFor="stylist">Stylist</Label>
              <Input id="stylist" placeholder="Enter designer's name" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="email">Designer's email</Label>
              <div className="flex gap-2 mt-1">
                <Input id="email" type="email" placeholder="designer@email.com" />
                <Button variant="outline" className="whitespace-nowrap">
                  Update email
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline">Discard changes</Button>
              <Button>Apply modifications</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
