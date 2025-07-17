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
            className={`w-16 h-4 rounded mb-1 flex items-center justify-center text-xs font-medium ${
              i === aisleLine
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {i}
          </div>
          <div className="text-xs text-muted-foreground">
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
            className={`w-12 h-16 rounded border-2 flex items-center justify-center text-xs font-medium ${
              i === rackNumber
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-muted border-muted-foreground/20 text-muted-foreground"
            }`}
          >
            {i === rackNumber ? <Package className="h-4 w-4" /> : i}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {i === rackNumber ? "Current" : `Rack ${i}`}
          </div>
        </div>
      );
    }
    return racks;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Location Visualization</span>
        </CardTitle>
        {productName && (
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{productName}</Badge>
            <span className="text-sm text-muted-foreground">
              is located at Line {aisleLine}, Rack {rackNumber}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Line Overview */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Line Layout
          </h4>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {generateAisleView()}
          </div>
        </div>

        {/* Rack Detail View */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Rack Layout - Line {aisleLine}
          </h4>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {generateRackView()}
          </div>
        </div>

        {/* Location Summary */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Line Number:</span>
              <div className="text-lg font-bold text-primary">{aisleLine}</div>
            </div>
            <div>
              <span className="font-medium">Rack Number:</span>
              <div className="text-lg font-bold text-primary">{rackNumber}</div>
            </div>
          </div>
        </div>

        {/* Walking Directions */}
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Walking Directions:
          </h5>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Go to Line {aisleLine}</li>
            <li>2. Look for Rack Number {rackNumber}</li>
            <li>3. Product should be located on this rack</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
