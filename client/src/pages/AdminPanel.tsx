import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit2, Trash2, Eye } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminPanel() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [showProductForm, setShowProductForm] = useState(false);

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = trpc.products.list.useQuery({ category: undefined, search: undefined });

  // Fetch all orders
  const { data: allOrders = [], isLoading: ordersLoading } = trpc.orders.listAll.useQuery(undefined);

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
                onClick={() => setShowProductForm(!showProductForm)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Thêm Sản Phẩm
              </Button>
            </div>

            {/* Product Form */}
            {showProductForm && (
              <div className="bg-muted/30 rounded-lg p-6 mb-8">
                <h3 className="font-serif text-lg mb-4">Thêm Sản Phẩm Mới</h3>
                <p className="text-muted-foreground text-sm">
                  Tính năng này sẽ được hoàn thiện trong phiên bản tiếp theo
                </p>
              </div>
            )}

            {/* Products Table */}
            {productsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : products.length === 0 ? (
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
                            <button className="p-2 hover:bg-muted rounded transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button className="p-2 hover:bg-muted rounded transition-colors">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 hover:bg-destructive/10 hover:text-destructive rounded transition-colors">
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
            ) : allOrders.length === 0 ? (
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
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.status === "completed"
                              ? "Hoàn Thành"
                              : order.status === "pending"
                              ? "Chờ Xử Lý"
                              : "Hủy"}
                          </span>
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
