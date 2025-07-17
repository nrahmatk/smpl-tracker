"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Grid3X3, Package } from "lucide-react";

interface LocationVisualizerProps {
  aisleLine: number;
  rackNumber: number;
  productName?: string;
}

export function LocationVisualizer({
  aisleLine,
  rackNumber,
  productName,
}: LocationVisualizerProps) {
  // Generate a grid representation of aisles (assuming max 10 aisles for visualization)
  const maxAisles = 10;
  const maxRacks = 20; // Assuming max 20 racks per aisle

  const generateAisleView = () => {
    const aisles = [];
    for (let i = 1; i <= maxAisles; i++) {
      aisles.push(
        <div key={i} className="flex flex-col items-center">
          <div
            className={`w-12 h-3 sm:w-16 sm:h-4 rounded mb-1 flex items-center justify-center text-xs font-medium ${
              i === aisleLine
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {i}
          </div>
          <div className="text-xs text-muted-foreground text-center">
            {i === aisleLine ? "Current" : `Line ${i}`}
          </div>
        </div>
      );
    }
    return aisles;
  };

  const generateRackView = () => {
    const racks = [];
    const startRack = Math.max(1, rackNumber - 5);
    const endRack = Math.min(maxRacks, rackNumber + 5);

    for (let i = startRack; i <= endRack; i++) {
      racks.push(
        <div key={i} className="flex flex-col items-center">
          <div
            className={`w-10 h-12 sm:w-12 sm:h-16 rounded border-2 flex items-center justify-center text-xs font-medium ${
              i === rackNumber
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-muted border-muted-foreground/20 text-muted-foreground"
            }`}
          >
            {i === rackNumber ? <Package className="h-3 w-3 sm:h-4 sm:w-4" /> : i}
          </div>
          <div className="text-xs text-muted-foreground mt-1 text-center">
            {i === rackNumber ? "Current" : `Rack ${i}`}
          </div>
        </div>
      );
    }
    return racks;
  };

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Location Visualization</span>
        </CardTitle>
        {productName && (
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Badge variant="outline" className="w-fit text-xs sm:text-sm">
              {productName}
            </Badge>
            <span className="text-xs sm:text-sm text-muted-foreground">
              is located at Line {aisleLine}, Rack {rackNumber}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Line Overview */}
        <div>
          <h4 className="text-sm font-medium mb-2 sm:mb-3 flex items-center">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Line Layout
          </h4>
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2">
            {generateAisleView()}
          </div>
        </div>

        {/* Rack Detail View */}
        <div>
          <h4 className="text-sm font-medium mb-2 sm:mb-3 flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Rack Layout - Line {aisleLine}
          </h4>
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2">
            {generateRackView()}
          </div>
        </div>

        {/* Location Summary */}
        <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div>
              <span className="font-medium text-xs sm:text-sm">Line Number:</span>
              <div className="text-lg sm:text-xl font-bold text-primary">{aisleLine}</div>
            </div>
            <div>
              <span className="font-medium text-xs sm:text-sm">Rack Number:</span>
              <div className="text-lg sm:text-xl font-bold text-primary">{rackNumber}</div>
            </div>
          </div>
        </div>

        {/* Walking Directions */}
        {/* <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2 text-sm sm:text-base">
            Walking Directions:
          </h5>
          <ol className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Go to Line {aisleLine}</li>
            <li>2. Look for Rack Number {rackNumber}</li>
            <li>3. Product should be located on this rack</li>
          </ol>
        </div> */}
      </CardContent>
    </Card>
  );
}