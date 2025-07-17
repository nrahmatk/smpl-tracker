"use client";

import { LocationModal } from "@/components/location-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Eye,
  Filter,
  MapPin,
  Package,
  Plus,
  Search,
  Grid3X3,
  List,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type Product = {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  keywords: string | null;
  line_number: number;
  rack_number: number;
  section: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recentHistory, setRecentHistory] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchRecentHistory();
  }, [currentPage, itemsPerPage, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Build query with pagination
      let query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .order("updated_at", { ascending: false });

      // Apply category filter
      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      query = query.range(startIndex, startIndex + itemsPerPage - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      setProducts(data || []);
      setTotalProducts(count || 0);

      // Extract unique categories
      const { data: allProducts } = await supabase
        .from("products")
        .select("category")
        .not("category", "is", null);

      const uniqueCategories = [
        ...new Set(allProducts?.map((p) => p.category).filter(Boolean)),
      ] as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentHistory(data || []);
    } catch (error) {
      console.error("Error fetching recent history:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const { data, error, count } = await supabase
        .from("products")
        .select("*", { count: "exact" })
        .or(
          `name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,keywords.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
        )
        .order("name")
        .range(0, itemsPerPage - 1);

      if (error) throw error;
      setProducts(data || []);
      setTotalProducts(count || 0);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching:", error);
      toast({
        title: "Search Error",
        description: "Failed to search products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Reset filter dan search
  const handleReset = (): void => {
    setSearchQuery("");
    setSelectedCategory("all");
    setCurrentPage(1);
    fetchProducts();
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square relative bg-muted overflow-hidden">
          {product.photo_url ? (
            <Image
              src={product.photo_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors text-sm sm:text-base">
              {product.name}
            </h3>
            {product.brand && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                {product.brand}
              </p>
            )}
          </div>

          {product.category && (
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          )}

          {/* Location - Prominent Display */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 sm:p-3">
            <div className="flex items-center justify-center space-x-2 text-primary font-semibold">
              <MapPin className="hidden sm:block h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-base">
                Line {product.line_number}, Rack {product.rack_number}
                {/* {product.section && ` - ${product.section}`} */}
              </span>
            </div>
          </div>

          <LocationModal
            product={product}
            trigger={
              <Button size="sm" className="w-full text-xs sm:text-sm">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                View Location
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="space-y-1">
                <h3 className="font-semibold text-sm sm:text-base truncate">
                  {product.name}
                </h3>
                {product.brand && (
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {product.brand}
                  </p>
                )}
                {product.category && (
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <div className="flex items-center space-x-1 text-primary font-semibold text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>
                      Line {product.line_number}, Rack {product.rack_number}
                      {product.section && ` - ${product.section}`}
                    </span>
                  </div>
                </div>

                <LocationModal
                  product={product}
                  trigger={
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-4 sm:py-8 space-y-6 sm:space-y-8 px-4 ">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Search className="h-5 w-5" />
            <span>Quick Search</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Search by product name, brand, keywords, or benefits to find
            location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 ">
            <div className="flex-1">
              <Input
                placeholder="Enter product name, brand, keyword, or benefit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="text-sm sm:text-base"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <Search className="h-4 w-4 mr-2 sm:mr-0 sm:h-4 sm:w-4" />
              <span className="sm:sr-only">Search</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              {/* <Filter className="h-4 w-4 text-muted-foreground" /> */}
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full sm:w-auto"
                type="button"
                disabled={loading && !searchQuery && selectedCategory === "all"}
              >
                Reset
              </Button>
            </div>

            {/* Items per page */}
          </div>
        </CardContent>
      </Card>

      {/* Recent History Section */}
      {/* {!searchQuery && recentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Clock className="h-5 w-5" />
              <span>Recently Added</span>
            </CardTitle>
            <CardDescription>
              Your latest additions to the inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {recentHistory.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 bg-background rounded overflow-hidden flex-shrink-0">
                    {product.photo_url ? (
                      <Image
                        src={product.photo_url}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Line {product.line_number}, Rack {product.rack_number}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Products Grid/List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Products ({totalProducts})
          </h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/manage">
              View All
              <Eye className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
              {totalProducts} products
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-3"
            }
          >
            {[...Array(itemsPerPage)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className={viewMode === "grid" ? "p-0" : "p-4"}>
                  {viewMode === "grid" ? (
                    <>
                      <div className="aspect-square bg-muted" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-3 bg-muted rounded w-3/4" />
                        <div className="h-8 bg-muted rounded" />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-3 bg-muted rounded w-3/4" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? "No products found" : "No products yet"}
              </h3>
              <p className="text-muted-foreground text-center mb-4 text-sm sm:text-base">
                {searchQuery
                  ? "Try adjusting your search terms or browse all products"
                  : "Start by adding your first product to the inventory"}
              </p>
              <Button asChild>
                <Link href="/add-product">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bottom Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm font-medium px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
