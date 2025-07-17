"use client";

import { LocationVisualizer } from "@/components/location-visualizer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Image as ImageIcon,
  MapPin,
  Package,
  Save
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255, "Name too long"),
  brand: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  keywords: z.string().optional(),
  line_number: z
    .number()
    .min(1, "Line must be at least 1")
    .max(999, "Line too high"),
  rack_number: z
    .number()
    .min(1, "Rack must be at least 1")
    .max(999, "Rack too high"),
  section: z.string().optional(),
  photo_url: z.string().url().optional().or(z.literal("")),
});

const categories = [
  "Beverages",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Fresh Produce",
  "Frozen Foods",
  "Bakery",
  "Pantry Staples",
  "Snacks & Candy",
  "Health & Beauty",
  "Household Items",
  "Baby & Kids",
  "Pet Supplies",
  "Other",
];

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: "",
      category: "",
      keywords: "",
      line_number: 1,
      rack_number: 1,
      section: "",
      photo_url: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const { error } = await supabase.from("products").insert([
        {
          name: values.name,
          brand: values.brand || null,
          category: values.category,
          keywords: values.keywords || null,
          line_number: values.line_number,
          rack_number: values.rack_number,
          section: values.section || null,
          photo_url: values.photo_url || null,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Product added successfully",
      });

      router.push("/");
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/manage">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">
            Add a product to the inventory with its location details
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Product Information</span>
              </CardTitle>
              <CardDescription>Basic details about the product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Coca Cola 330ml Can"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the full product name including size/variant if
                      applicable
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Coca Cola, Nestlé, Unilever"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The manufacturer or brand name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the most appropriate category
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords & Benefits</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., refreshing, cola, caffeine, carbonated, energy, vitamin C, protein, organic, gluten-free"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add searchable keywords, benefits, ingredients, or
                      features (separated by commas)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Location Details</span>
              </CardTitle>
              <CardDescription>
                Where this product is located in the supermarket
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="line_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Line Number *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="999"
                          placeholder="e.g., 2"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormDescription>Line number</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rack_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rack Number *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="999"
                          placeholder="e.g., 102"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormDescription>Specific rack number</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., A, B, C, Top, Bottom"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional sub-section within the rack (e.g., A, B, C, Top,
                      Bottom)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Location Preview:</strong> This product will be
                  located at{" "}
                  <span className="font-medium text-foreground">
                    Line {form.watch("line_number")}, Rack{" "}
                    {form.watch("rack_number")}
                    {form.watch("section") && ` - ${form.watch("section")}`}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Location Visualization */}
          {form.watch("line_number") && form.watch("rack_number") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location Preview</span>
                </CardTitle>
                <CardDescription>
                  Visual preview of where this product will be located
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LocationVisualizer
                  aisleLine={form.watch("line_number")}
                  rackNumber={form.watch("rack_number")}
                  productName={form.watch("name") || "New Product"}
                />
              </CardContent>
            </Card>
          )}

          {/* Photo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Product Photo</span>
              </CardTitle>
              <CardDescription>
                Optional photo URL for visual reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="photo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/product-image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add a URL to a product image for easier identification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding Product...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Add Product
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              asChild
              className="flex-1 sm:flex-initial"
            >
              <Link href="/">Cancel</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
