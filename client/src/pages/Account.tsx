import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";

export default function Account() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const [activeTab, setActiveTab] = useState<"orders" | "favorites">("orders");

  // Fetch user's orders
  const { data: userOrders = [], isLoading: ordersLoading } = trpc.orders.list.useQuery(undefined);

  // Fetch user's favorites
  const { data: userFavorites = [], isLoading: favoritesLoading } = trpc.favorites.list.useQuery();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để xem tài khoản</p>
          <Button onClick={() => setLocation("/")} className="btn-primary">
            Quay Về Trang Chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={0}
        onCartClick={() => {}}
        onSearchChange={() => {}}
        favoriteCount={userFavorites.length}
      />

      <div className="container py-8">
        {/* Back Button */}
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Quay Lại
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="serif-title text-3xl mb-2">Tài Khoản Của Tôi</h1>
          <p className="text-muted-foreground">Xin chào, {user.name || user.email}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === "orders"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Lịch Sử Đơn Hàng
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === "favorites"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Danh Sách Yêu Thích ({userFavorites.length})
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2 className="serif-subtitle text-2xl mb-6">Lịch Sử Đơn Hàng</h2>

            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (userOrders as any[]).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Bạn chưa có đơn hàng nào</p>
                <Button onClick={() => setLocation("/")} className="btn-primary">
                  Tiếp Tục Mua Sắm
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {(userOrders as any[]).map((order) => (
                  <div key={order.id} className="border border-border rounded-lg p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">Đơn Hàng #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 text-xs rounded font-medium ${
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
                    </div>

                    <div className="space-y-2 mb-4 pb-4 border-b border-border">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Khách hàng:</span> {order.customerName}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Số điện thoại:</span> {order.customerPhone}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Địa chỉ:</span> {order.customerAddress}
                      </p>
                      {order.customerNotes && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Ghi chú:</span> {order.customerNotes}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">{order.total}₫</span>
                      <Button variant="outline" size="sm">
                        Xem Chi Tiết
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <div>
            <h2 className="serif-subtitle text-2xl mb-6">Danh Sách Yêu Thích</h2>

            {favoritesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (userFavorites as any[]).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Bạn chưa thêm sản phẩm yêu thích nào</p>
                <Button onClick={() => setLocation("/")} className="btn-primary">
                  Khám Phá Sản Phẩm
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(userFavorites as any[]).map((favorite) => (
                  <div key={favorite.productId} className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <img
                        src={favorite.product?.imageUrl || "https://via.placeholder.com/300"}
                        alt={favorite.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif font-semibold mb-2">{favorite.product?.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{favorite.product?.subtitle}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{favorite.product?.price}₫</span>
                        <Button size="sm" className="btn-primary">
                          Thêm Vào Giỏ
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
