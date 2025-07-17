"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase, type Product } from "@/lib/supabase";
import {
  ArrowUpDown,
  Edit,
  Eye,
  Filter,
  Grid3X3,
  MapPin,
  Package,
  Plus,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type SortField =
  | "name"
  | "brand"
  | "category"
  | "line_number"
  | "rack_number"
  | "created_at";
type SortOrder = "asc" | "desc";

export default function ManagePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLine, setSelectedLine] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [categories, setCategories] = useState<string[]>([]);
  const [lines, setLines] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalLines: 0,
    totalRacks: 0,
    recentlyAdded: 0,
  });
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchFilters();
    fetchStats();
  }, [
    searchQuery,
    selectedCategory,
    selectedLine,
    sortField,
    sortOrder,
    currentPage,
    itemsPerPage,
  ]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Build query with pagination
      let query = supabase.from("products").select("*", { count: "exact" });

      // Apply search filter
      if (searchQuery.trim()) {
        query = query.or(
          `name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,keywords.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
        );
      }

      // Apply category filter
      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      // Apply line filter
      if (selectedLine !== "all") {
        query = query.eq("line_number", parseInt(selectedLine));
      }

      // Apply sorting
      query = query.order(sortField, { ascending: sortOrder === "asc" });

      // Pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      query = query.range(startIndex, startIndex + itemsPerPage - 1);

      const { data, error, count } = await query;

      if (error) throw error;
      setProducts(data || []);
      setTotalProducts(count || 0);
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

  const fetchFilters = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("category, line_number");

      if (error) throw error;

      const uniqueCategories = [
        ...new Set(data?.map((p) => p.category).filter(Boolean)),
      ] as string[];
      const uniqueLines = [...new Set(data?.map((p) => p.line_number))].sort(
        (a, b) => a - b
      ) as number[];

      setCategories(uniqueCategories);
      setLines(uniqueLines);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("line_number, rack_number, created_at");

      if (error) throw error;

      const totalProducts = data?.length || 0;
      const uniqueLines = new Set(data?.map((p) => p.line_number)).size;
      const uniqueRacks = new Set(
        data?.map((p) => `${p.line_number}-${p.rack_number}`)
      ).size;

      // Count products added in last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentlyAdded =
        data?.filter((p) => new Date(p.created_at) > weekAgo).length || 0;

      setStats({
        totalProducts,
        totalLines: uniqueLines,
        totalRacks: uniqueRacks,
        recentlyAdded,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLine("all");
    setSortField("name");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto py-4 sm:py-8 space-y-6 sm:space-y-8 px-4">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Manage all products in your supermarket inventory
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
          >
            {viewMode === "table" ? (
              <Grid3X3 className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button asChild>
            <Link href="/add-product">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Items in inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lines</CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLines}</div>
            <p className="text-xs text-muted-foreground">Active lines</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Racks</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRacks}</div>
            <p className="text-xs text-muted-foreground">Unique locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recently Added
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentlyAdded}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products, brands, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {(searchQuery ||
              selectedCategory !== "all" ||
              selectedLine !== "all") && (
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
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

            <Select value={selectedLine} onValueChange={setSelectedLine}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Lines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lines</SelectItem>
                {lines.map((line) => (
                  <SelectItem key={line} value={line.toString()}>
                    Line {line}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Count & Items per page */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
              {totalProducts} products
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Items per page:</span>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {loading ? (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="ml-2">Loading products...</span>
            </div>
          </CardContent>
        </Card>
      ) : products.length > 0 ? (
        <>
          {viewMode === "table" ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Photo</TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            className="h-auto p-0 font-semibold"
                            onClick={() => handleSort("name")}
                          >
                            Product Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            className="h-auto p-0 font-semibold"
                            onClick={() => handleSort("brand")}
                          >
                            Brand
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            className="h-auto p-0 font-semibold"
                            onClick={() => handleSort("category")}
                          >
                            Category
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            className="h-auto p-0 font-semibold"
                            onClick={() => handleSort("line_number")}
                          >
                            Location
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="w-12 h-12 relative bg-muted rounded-md overflow-hidden">
                              {product.photo_url ? (
                                <Image
                                  src={product.photo_url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{product.name}</div>
                            {product.keywords && (
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {product.keywords}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{product.brand || "-"}</TableCell>
                          <TableCell>
                            {product.category && (
                              <Badge variant="secondary">
                                {product.category}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>
                                Line {product.line_number}, Rack{" "}
                                {product.rack_number}
                                {product.section && ` - ${product.section}`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/edit-product/${product.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Product
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "
                                      {product.name}"? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(product.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="aspect-square relative bg-muted rounded-lg mb-4 overflow-hidden">
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

                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-2">
                        {product.name}
                      </h3>
                      {product.brand && (
                        <p className="text-sm text-muted-foreground">
                          {product.brand}
                        </p>
                      )}
                      {product.category && (
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      )}
                      <div className="flex items-center space-x-1 text-sm text-primary">
                        <MapPin className="h-4 w-4" />
                        <span>
                          Line {product.line_number}, Rack {product.rack_number}
                          {product.section && ` - ${product.section}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          asChild
                        >
                          <Link href={`/edit-product/${product.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Product
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{product.name}
                                "?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-center mt-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
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
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery ||
              selectedCategory !== "all" ||
              selectedLine !== "all"
                ? "Try adjusting your search or filters"
                : "Start by adding your first product to the inventory"}
            </p>
            <div className="flex items-center space-x-2">
              {(searchQuery ||
                selectedCategory !== "all" ||
                selectedLine !== "all") && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
              <Button asChild>
                <Link href="/add-product">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
