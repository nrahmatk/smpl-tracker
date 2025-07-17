"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase, type Product } from "@/lib/supabase";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { LocationVisualizer } from "@/components/location-visualizer";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    keywords: "",
    line_number: "",
    rack_number: "",
    section: "",
    photo_url: "",
  });

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Product not found.",
        variant: "destructive",
      });
      router.push("/manage");
    } else {
      setProduct(data);
      setFormData({
        name: data.name,
        brand: data.brand || "",
        category: data.category || "",
        keywords: data.keywords || "",
        line_number: data.line_number.toString(),
        rack_number: data.rack_number.toString(),
        section: data.section || "",
        photo_url: data.photo_url || "",
      });
    }
    setFetching(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          brand: formData.brand || null,
          category: formData.category || null,
          keywords: formData.keywords || null,
          line_number: Number.parseInt(formData.line_number),
          rack_number: Number.parseInt(formData.rack_number),
          section: formData.section || null,
          photo_url: formData.photo_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Product has been updated successfully.",
      });

      router.push("/manage");
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="ml-2">Loading products...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/manage">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">Update product information</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Update the details below to modify the product information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Coca Cola 330ml"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Coca Cola"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Beverage, Snack, Dairy"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Textarea
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  placeholder="e.g., soft drink cola carbonated beverage"
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  Add keywords to help customers find this product (separated by
                  spaces)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="line_number">Line Number *</Label>
                  <Input
                    id="line_number"
                    name="line_number"
                    type="number"
                    value={formData.line_number}
                    onChange={handleInputChange}
                    placeholder="e.g., 2"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rack_number">Rack Number *</Label>
                  <Input
                    id="rack_number"
                    name="rack_number"
                    type="number"
                    value={formData.rack_number}
                    onChange={handleInputChange}
                    placeholder="e.g., 102"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  placeholder="e.g., A, B, C, Top, Bottom"
                />
                <p className="text-sm text-gray-500">
                  Optional sub-section within the rack (e.g., A, B, C, Top,
                  Bottom)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo_url">Photo URL</Label>
                <Input
                  id="photo_url"
                  name="photo_url"
                  type="url"
                  value={formData.photo_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/product-image.jpg"
                />
                <p className="text-sm text-gray-500">
                  Optional: Add a URL to the product image
                </p>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <div className="flex">
                      <Save className="mr-2 h-4 w-4" />
                      Update Product
                    </div>
                  )}
                </Button>
                <Link href="/manage">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Location Visualization - Show only if line and rack are provided */}
        {formData.line_number && formData.rack_number && (
          <div className="mt-6">
            <LocationVisualizer
              aisleLine={Number.parseInt(formData.line_number)}
              rackNumber={Number.parseInt(formData.rack_number)}
              productName={formData.name}
            />
          </div>
        )}
      </div>
    </div>
  );
}
