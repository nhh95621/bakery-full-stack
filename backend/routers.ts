import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  getOrdersByUserId,
  getOrderById,
  getOrderItems,
  updateOrderStatus,
  getAllOrders,
  addFavorite,
  removeFavorite,
  getFavoritesByUserId,
  isFavorited,
  getFeaturedReviews,
  getPendingReviews,
  getReviewsByUserId,
  canUserReviewDeliveredOrder,
  hasUserReviewedProduct,
  createVerifiedReview,
  approveReview,
} from "./db";
import { TRPCError } from "@trpc/server";
import type { InsertOrderItem } from "./db/drizzle/schema";

// ─── Products Router ──────────────────────────────────────────────────────
const productsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      let products = await getProducts(input.category);

      if (input.search) {
        const searchLower = input.search.toLowerCase();
        products = (products as any[]).filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.subtitle?.toLowerCase().includes(searchLower)
        );
      }

      return products;
    }),

  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const product = await getProductById(input.id);
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }
      return product;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        category: z.enum(["Entremet", "Tart", "Macaron", "Theo Mùa"]),
        price: z.string(),
        originalPrice: z.string().optional(),
        imageUrl: z.string(),
        tag: z.string().optional(),
        tagColor: z.string().optional(),
        rating: z.string().optional(),
        reviewCount: z.number().optional(),
        featured: z.boolean().optional(),
        sizes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const result = await createProduct({
        name: input.name,
        subtitle: input.subtitle,
        description: input.description,
        category: input.category,
        price: input.price as any,
        originalPrice: input.originalPrice as any,
        imageUrl: input.imageUrl,
        tag: input.tag,
        tagColor: input.tagColor,
        rating: input.rating as any,
        reviewCount: input.reviewCount,
        featured: input.featured,
        sizes: input.sizes,
      });

      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        category: z.enum(["Entremet", "Tart", "Macaron", "Theo Mùa"]).optional(),
        price: z.string().optional(),
        originalPrice: z.string().optional(),
        imageUrl: z.string().optional(),
        tag: z.string().optional(),
        tagColor: z.string().optional(),
        featured: z.boolean().optional(),
        sizes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const { id, ...updateData } = input;
      await updateProduct(id, updateData as any);
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      await deleteProduct(input.id);
      return { success: true };
    }),
});

// ─── Orders Router ────────────────────────────────────────────────────────
const ordersRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        customerName: z.string(),
        customerPhone: z.string(),
        customerAddress: z.string(),
        customerNotes: z.string().optional(),
        items: z.array(
          z.object({
            productId: z.number(),
            productName: z.string(),
            productPrice: z.string(),
            size: z.string(),
            quantity: z.number(),
            subtotal: z.string(),
          })
        ),
        subtotal: z.string(),
        shippingFee: z.string(),
        total: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const orderId = await createOrder(
        {
          userId: ctx.user.id,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerAddress: input.customerAddress,
          customerNotes: input.customerNotes,
          subtotal: input.subtotal as any,
          shippingFee: input.shippingFee as any,
          total: input.total as any,
          status: "pending",
        },
        input.items.map((item) => ({
          orderId: 0,
          productId: item.productId,
          productName: item.productName,
          productPrice: item.productPrice as any,
          size: item.size,
          quantity: item.quantity,
          subtotal: item.subtotal as any,
        }))
      );

      return { orderId, success: true };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const orders = await getOrdersByUserId(ctx.user.id);
    return orders;
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const order = await getOrderById(input.id);
      if (!order || order.userId !== ctx.user.id) {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
      }

      const items = await getOrderItems(input.id);
      return { ...order, items };
    }),

  updateStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      await updateOrderStatus(input.id, input.status);
      return { success: true };
    }),

  listAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }

    const orders = await getAllOrders();
    return orders;
  }),
});

// ─── Favorites Router ─────────────────────────────────────────────────────
const favoritesRouter = router({
  add: protectedProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await addFavorite(ctx.user.id, input.productId);
      return { success: true };
    }),

  remove: protectedProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await removeFavorite(ctx.user.id, input.productId);
      return { success: true };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const favorites = await getFavoritesByUserId(ctx.user.id);
    return favorites;
  }),

  isFavorited: protectedProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        return false;
      }

      return isFavorited(ctx.user.id, input.productId);
  }),
});

// ─── Customer Reviews Router ───────────────────────────────────────────────
const reviewsRouter = router({
  listFeatured: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(12).optional() }).optional())
    .query(({ input }) => getFeaturedReviews(input?.limit ?? 6)),

  listMine: protectedProcedure.query(async ({ ctx }) => {
    return getReviewsByUserId(ctx.user.id);
  }),

  submit: protectedProcedure
    .input(
      z.object({
        orderId: z.number().int().positive(),
        productId: z.number().int().positive(),
        rating: z.number().int().min(1).max(5),
        title: z.string().trim().min(3).max(160).optional(),
        content: z.string().trim().min(20).max(1200),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const eligible = await canUserReviewDeliveredOrder(ctx.user.id, input.orderId, input.productId);
      if (!eligible) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Chỉ đơn hàng đã giao thành công mới có thể để lại đánh giá.",
        });
      }

      if (await hasUserReviewedProduct(ctx.user.id, input.orderId, input.productId)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Bạn đã đánh giá sản phẩm này cho đơn hàng đã chọn.",
        });
      }

      await createVerifiedReview({
        userId: ctx.user.id,
        orderId: input.orderId,
        productId: input.productId,
        authorName: ctx.user.name?.trim() || "Khách hàng Boulangerie",
        rating: input.rating,
        title: input.title,
        content: input.content,
        verifiedPurchase: true,
        approved: false,
      });

      return { success: true };
    }),

  listPending: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }
    return getPendingReviews();
  }),

  approve: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      await approveReview(input.id);
      return { success: true };
    }),
});

// ─── Main Router ──────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: productsRouter,
  orders: ordersRouter,
  favorites: favoritesRouter,
  reviews: reviewsRouter,
});

export type AppRouter = typeof appRouter;
