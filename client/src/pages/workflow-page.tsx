
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function WorkflowPage() {
  const images = [
    { src: "/attached_assets/dashboard.png", alt: "Dashboard", title: "Dashboard" },
    { src: "/attached_assets/onboarding.png", alt: "Onboarding", title: "Onboarding" }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Workflow do Projeto</h1>
        <Button asChild>
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <div className="flex flex-col items-center gap-4">
                      <h3 className="text-xl font-semibold">{image.title}</h3>
                      <img 
                        src={image.src} 
                        alt={image.alt} 
                        className="rounded-lg shadow-lg max-h-[600px] w-auto"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
    </div>
  );
}
