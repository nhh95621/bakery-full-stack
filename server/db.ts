import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, InsertProduct, orders, InsertOrder, orderItems, InsertOrderItem, favorites, customerReviews, InsertCustomerReview } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Products ────────────────────────────────────────────────────────────

export async function getProducts(category?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (category && category !== "Tất Cả") {
    return db.select().from(products).where(
      and(eq(products.active, true), eq(products.category, category as any))
    );
  }
  
  return db.select().from(products).where(eq(products.active, true));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(products).values(data);
  return result;
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.update(products).set(data).where(eq(products.id, id));
  return result;
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.delete(products).where(eq(products.id, id));
  return result;
}

// ─── Orders ───────────────────────────────────────────────────────────────

export async function createOrder(orderData: InsertOrder, items: InsertOrderItem[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const orderResult = await db.insert(orders).values(orderData);
  const orderId = (orderResult as any).insertId || 0;
  
  if (items.length > 0 && orderId) {
    const itemsWithOrderId = items.map(item => ({
      ...item,
      orderId: Number(orderId),
    }));
    await db.insert(orderItems).values(itemsWithOrderId);
  }
  
  return orderId;
}

export async function getOrdersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(orders).where(eq(orders.userId, userId));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function updateOrderStatus(orderId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(orders).set({ status: status as any }).where(eq(orders.id, orderId));
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(orders);
}

// ─── Favorites ────────────────────────────────────────────────────────────

export async function addFavorite(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(favorites).values({ userId, productId });
}

export async function removeFavorite(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(favorites).where(
    and(eq(favorites.userId, userId), eq(favorites.productId, productId))
  );
}

export async function getFavoritesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(favorites).where(eq(favorites.userId, userId));
}

export async function isFavorited(userId: number, productId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.select().from(favorites).where(
    and(eq(favorites.userId, userId), eq(favorites.productId, productId))
  ).limit(1);
  
  return result.length > 0;
}

// ─── Verified customer reviews ──────────────────────────────────────────────

export async function getFeaturedReviews(limit = 6) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({
      id: customerReviews.id,
      authorName: customerReviews.authorName,
      rating: customerReviews.rating,
      title: customerReviews.title,
      content: customerReviews.content,
      verifiedPurchase: customerReviews.verifiedPurchase,
      createdAt: customerReviews.createdAt,
      productName: products.name,
      productCategory: products.category,
    })
    .from(customerReviews)
    .innerJoin(products, eq(customerReviews.productId, products.id))
    .where(and(eq(customerReviews.approved, true), eq(customerReviews.verifiedPurchase, true)))
    .orderBy(desc(customerReviews.createdAt))
    .limit(limit);
}

export async function getPendingReviews() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({
      id: customerReviews.id,
      userId: customerReviews.userId,
      orderId: customerReviews.orderId,
      productId: customerReviews.productId,
      authorName: customerReviews.authorName,
      rating: customerReviews.rating,
      title: customerReviews.title,
      content: customerReviews.content,
      createdAt: customerReviews.createdAt,
      productName: products.name,
    })
    .from(customerReviews)
    .innerJoin(products, eq(customerReviews.productId, products.id))
    .where(eq(customerReviews.approved, false))
    .orderBy(desc(customerReviews.createdAt));
}

export async function canUserReviewDeliveredOrder(userId: number, orderId: number, productId: number) {
  const db = await getDb();
  if (!db) return false;

  const eligibleItem = await db
    .select({ id: orderItems.id })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        eq(orders.id, orderId),
        eq(orders.userId, userId),
        eq(orders.status, "delivered"),
        eq(orderItems.productId, productId)
      )
    )
    .limit(1);

  return eligibleItem.length > 0;
}

export async function hasUserReviewedProduct(userId: number, orderId: number, productId: number) {
  const db = await getDb();
  if (!db) return false;

  const existing = await db
    .select({ id: customerReviews.id })
    .from(customerReviews)
    .where(
      and(
        eq(customerReviews.userId, userId),
        eq(customerReviews.orderId, orderId),
        eq(customerReviews.productId, productId)
      )
    )
    .limit(1);

  return existing.length > 0;
}

export async function createVerifiedReview(data: InsertCustomerReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(customerReviews).values(data);
}

export async function approveReview(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(customerReviews).set({ approved: true }).where(eq(customerReviews.id, id));
}
