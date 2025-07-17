"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LocationVisualizer } from "@/components/location-visualizer";
import { Eye, MapPin, Package, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface LocationModalProps {
  product: {
    id: number;
    name: string;
    brand: string | null;
    category: string | null;
    line_number: number;
    rack_number: number;
    section: string | null;
    photo_url: string | null;
  };
  trigger?: React.ReactNode;
}

export function LocationModal({ product, trigger }: LocationModalProps) {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button size="sm" className="w-full">
      <Eye className="h-4 w-4 mr-2" />
      View Location
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-[100vw] sm:max-w-4xl w-full h-[90vh] sm:h-auto sm:max-h-[90vh] p-0 sm:p-6 rounded-none sm:rounded-lg">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 bg-background border-b p-4 sm:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span className="font-semibold">Product Location</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Desktop Header */}
        <DialogHeader className="hidden sm:block">
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <MapPin className="h-5 w-5" />
            <span>Product Location</span>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-0">
          <div className="space-y-4 sm:space-y-6">
            {/* Product Information */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex flex-col space-y-4">
                {/* Mobile: Stack vertically */}
                <div className="flex items-center space-x-3 sm:hidden">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {product.photo_url ? (
                      <Image
                        src={product.photo_url}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold truncate">
                      {product.name}
                    </h3>
                    {product.brand && (
                      <p className="text-sm text-muted-foreground truncate">
                        {product.brand}
                      </p>
                    )}
                  </div>
                </div>

                {/* Desktop: Side by side */}
                <div className="hidden sm:flex items-start space-x-4">
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {product.photo_url ? (
                      <Image
                        src={product.photo_url}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    {product.brand && (
                      <p className="text-sm text-muted-foreground">
                        {product.brand}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category and Location - Full width on mobile */}
                <div className="flex flex-col space-y-2">
                  {product.category && (
                    <Badge variant="secondary" className="w-fit">
                      {product.category}
                    </Badge>
                  )}
                  <div className="flex items-center space-x-1 text-sm font-medium text-primary">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>
                      Line {product.line_number}, Rack {product.rack_number}
                      {product.section && ` - ${product.section}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Visualization */}
            <div className="w-full">
              <LocationVisualizer
                aisleLine={product.line_number}
                rackNumber={product.rack_number}
                productName={product.name}
              />
            </div>
          </div>
        </div>

        {/* Mobile Footer (Optional) */}

        <DialogFooter>
          <div className="bg-background border-t p-4 sm:hidden z-50">
            <Button
              onClick={() => setOpen(false)}
              className="w-full"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
