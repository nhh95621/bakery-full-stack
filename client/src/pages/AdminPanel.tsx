import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const CATEGORIES = ["Entremet", "Tart", "Macaron", "Theo Mùa"];
const TAGS = ["Best Seller", "Sale", "New"];
const TAG_COLORS = {
  "Best Seller": "#FF6B6B",
  "Sale": "#4ECDC4",
  "New": "#95E1D3",
};

export default function AdminPanel() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    category: "",
    price: "",
    originalPrice: "",
    imageUrl: "",
    sizes: "",
    description: "",
    tag: "",
    rating: "5",
    reviewCount: "0",
  });

  // Fetch products
  const { data: products = [], isLoading: productsLoading, refetch: refetchProducts } = trpc.products.list.useQuery({
    category: undefined,
    search: undefined,
  });

  // Fetch all orders
  const { data: allOrders = [], isLoading: ordersLoading } = trpc.orders.listAll.useQuery(undefined);

  // Mutations
  const createProductMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("Sản phẩm đã được thêm thành công");
      setShowProductForm(false);
      setFormData({
        name: "",
        subtitle: "",
        category: "",
        price: "",
        originalPrice: "",
        imageUrl: "",
        sizes: "",
        description: "",
        tag: "",
        rating: "5",
        reviewCount: "0",
      });
      refetchProducts();
    },
    onError: (error) => {
      toast.error("Lỗi khi thêm sản phẩm: " + (error as any).message);
    },
  });

  const updateProductMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success("Sản phẩm đã được cập nhật thành công");
      setEditingProduct(null);
      setShowProductForm(false);
      setFormData({
        name: "",
        subtitle: "",
        category: "",
        price: "",
        originalPrice: "",
        imageUrl: "",
        sizes: "",
        description: "",
        tag: "",
        rating: "5",
        reviewCount: "0",
      });
      refetchProducts();
    },
    onError: (error) => {
      toast.error("Lỗi khi cập nhật sản phẩm: " + (error as any).message);
    },
  });

  const deleteProductMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Sản phẩm đã được xóa thành công");
      refetchProducts();
    },
    onError: (error) => {
      toast.error("Lỗi khi xóa sản phẩm: " + (error as any).message);
    },
  });

  const updateOrderStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Trạng thái đơn hàng đã được cập nhật");
    },
    onError: (error) => {
      toast.error("Lỗi khi cập nhật trạng thái: " + (error as any).message);
    },
  });

  // Check admin access
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Bạn không có quyền truy cập trang này</p>
          <Button onClick={() => setLocation("/")} className="btn-primary">
            Quay Về Trang Chủ
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const productData = {
      name: formData.name,
      subtitle: formData.subtitle,
      category: formData.category as "Entremet" | "Tart" | "Macaron" | "Theo Mùa",
      price: formData.price,
      originalPrice: formData.originalPrice || undefined,
      imageUrl: formData.imageUrl,
      sizes: formData.sizes,
      description: formData.description,
      tag: formData.tag || undefined,
      tagColor: formData.tag ? TAG_COLORS[formData.tag as keyof typeof TAG_COLORS] : undefined,
      rating: parseFloat(formData.rating),
      reviewCount: parseInt(formData.reviewCount),
    };

    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct.id,
        ...productData,
      } as any);
    } else {
      createProductMutation.mutate(productData as any);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      subtitle: product.subtitle,
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      imageUrl: product.imageUrl,
      sizes: product.sizes,
      description: product.description,
      tag: product.tag || "",
      rating: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
      deleteProductMutation.mutate({ id });
    }
  };

  const handleUpdateOrderStatus = (orderId: number, newStatus: string) => {
    updateOrderStatusMutation.mutate({
      id: orderId,
      status: newStatus as "pending" | "completed" | "cancelled",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-6">
          <h1 className="serif-title text-3xl mb-2">Quản Trị Admin</h1>
          <p className="text-muted-foreground">Quản lý sản phẩm và đơn hàng</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === "products"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sản Phẩm
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === "orders"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Đơn Hàng
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="serif-subtitle text-2xl">Danh Sách Sản Phẩm</h2>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({
                    name: "",
                    subtitle: "",
                    category: "",
                    price: "",
                    originalPrice: "",
                    imageUrl: "",
                    sizes: "",
                    description: "",
                    tag: "",
                    rating: "5",
                    reviewCount: "0",
                  });
                  setShowProductForm(!showProductForm);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                {showProductForm ? "Hủy" : "Thêm Sản Phẩm"}
              </Button>
            </div>

            {/* Product Form */}
            {showProductForm && (
              <form onSubmit={handleSubmitProduct} className="bg-muted/30 rounded-lg p-6 mb-8 space-y-4">
                <h3 className="font-serif text-lg mb-4">{editingProduct ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tên Sản Phẩm *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ví dụ: Entremet Vanilla Classic"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phụ Đề</label>
                    <Input
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="Ví dụ: Bánh kem vanilla truyền thống"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Danh Mục *</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Giá *</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Ví dụ: 250000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Giá Gốc</label>
                    <Input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="Ví dụ: 280000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">URL Ảnh</label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Kích Thước (phân cách bằng dấu phẩy)</label>
                    <Input
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      placeholder="Ví dụ: 4 inch, 6 inch, 8 inch"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tag</label>
                    <Select value={formData.tag} onValueChange={(value) => setFormData({ ...formData, tag: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Không có</SelectItem>
                        {TAGS.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Đánh Giá</label>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Số Đánh Giá</label>
                    <Input
                      type="number"
                      value={formData.reviewCount}
                      onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mô Tả</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về sản phẩm"
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="btn-primary" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                    {createProductMutation.isPending || updateProductMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : editingProduct ? (
                      "Cập Nhật"
                    ) : (
                      "Thêm Sản Phẩm"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Products Table */}
            {productsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (products as any[]).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Chưa có sản phẩm nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Tên Sản Phẩm</th>
                      <th className="text-left py-3 px-4 font-semibold">Danh Mục</th>
                      <th className="text-left py-3 px-4 font-semibold">Giá</th>
                      <th className="text-left py-3 px-4 font-semibold">Tag</th>
                      <th className="text-center py-3 px-4 font-semibold">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(products as any[]).map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-muted/30">
                        <td className="py-3 px-4 font-serif">{product.name}</td>
                        <td className="py-3 px-4">{product.category}</td>
                        <td className="py-3 px-4">{product.price}₫</td>
                        <td className="py-3 px-4">
                          {product.tag && (
                            <span
                              className="inline-block px-2 py-1 text-xs rounded text-white"
                              style={{ backgroundColor: product.tagColor || "#666" }}
                            >
                              {product.tag}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 hover:bg-muted rounded transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2 className="serif-subtitle text-2xl mb-6">Danh Sách Đơn Hàng</h2>

            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (allOrders as any[]).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Chưa có đơn hàng nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Mã Đơn</th>
                      <th className="text-left py-3 px-4 font-semibold">Khách Hàng</th>
                      <th className="text-left py-3 px-4 font-semibold">Số Điện Thoại</th>
                      <th className="text-left py-3 px-4 font-semibold">Địa Chỉ</th>
                      <th className="text-left py-3 px-4 font-semibold">Tổng Tiền</th>
                      <th className="text-left py-3 px-4 font-semibold">Trạng Thái</th>
                      <th className="text-left py-3 px-4 font-semibold">Ngày Đặt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(allOrders as any[]).map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/30">
                        <td className="py-3 px-4 font-semibold">#{order.id}</td>
                        <td className="py-3 px-4">{order.customerName}</td>
                        <td className="py-3 px-4">{order.customerPhone}</td>
                        <td className="py-3 px-4 text-xs">{order.customerAddress}</td>
                        <td className="py-3 px-4 font-semibold">{order.total}₫</td>
                        <td className="py-3 px-4">
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Chờ Xử Lý</SelectItem>
                              <SelectItem value="completed">Hoàn Thành</SelectItem>
                              <SelectItem value="cancelled">Hủy</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4 text-xs">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
