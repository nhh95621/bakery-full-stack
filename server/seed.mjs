import { drizzle } from "drizzle-orm/mysql2";
import { products } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const sampleProducts = [
  {
    name: "Entremet Vanilla Classic",
    subtitle: "Bánh kem vanilla truyền thống",
    description: "Bánh kem vanilla cao cấp với lớp sponge mềm mại và kem vanilla thơm ngon",
    category: "Entremet",
    price: "250000",
    originalPrice: "280000",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    tag: "Best Seller",
    tagColor: "#D4AF37",
    rating: "4.8",
    reviewCount: 45,
    featured: true,
    sizes: "6 inch,8 inch,10 inch"
  },
  {
    name: "Entremet Chocolate Delight",
    subtitle: "Bánh kem chocolate đắng",
    description: "Bánh chocolate cao cấp với ganache chocolate đắng và kem chocolate mịn",
    category: "Entremet",
    price: "280000",
    originalPrice: "320000",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    tag: "New",
    tagColor: "#FF6B6B",
    rating: "4.9",
    reviewCount: 32,
    featured: true,
    sizes: "6 inch,8 inch,10 inch"
  },
  {
    name: "Tart Lemon Fresh",
    subtitle: "Bánh tart chanh tươi",
    description: "Bánh tart với lớp vỏ bơ giòn và nhân chanh tươi mát",
    category: "Tart",
    price: "180000",
    originalPrice: "200000",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    tag: "Sale",
    tagColor: "#FFA500",
    rating: "4.7",
    reviewCount: 28,
    featured: false,
    sizes: "4 inch,6 inch"
  },
  {
    name: "Tart Strawberry Bliss",
    subtitle: "Bánh tart dâu tây",
    description: "Bánh tart với dâu tây tươi và kem custard thơm ngon",
    category: "Tart",
    price: "200000",
    originalPrice: "220000",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    tag: null,
    tagColor: null,
    rating: "4.6",
    reviewCount: 35,
    featured: false,
    sizes: "4 inch,6 inch"
  },
  {
    name: "Macaron Rainbow Set",
    subtitle: "Bộ macaron 6 màu",
    description: "Bộ macaron đủ màu sắc với các hương vị khác nhau",
    category: "Macaron",
    price: "150000",
    originalPrice: "170000",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    tag: "Best Seller",
    tagColor: "#D4AF37",
    rating: "4.9",
    reviewCount: 52,
    featured: true,
    sizes: "6 pieces,12 pieces"
  },
  {
    name: "Macaron Pistachio",
    subtitle: "Macaron hương hạt dẻ",
    description: "Macaron hương hạt dẻ tinh tế với kem hạt dẻ",
    category: "Macaron",
    price: "120000",
    originalPrice: "140000",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    tag: "New",
    tagColor: "#FF6B6B",
    rating: "4.8",
    reviewCount: 24,
    featured: false,
    sizes: "6 pieces,12 pieces"
  },
  {
    name: "Bánh Noel Đặc Biệt",
    subtitle: "Bánh Noel mùa lễ hội",
    description: "Bánh Noel cao cấp với trang trí tinh tế",
    category: "Theo Mùa",
    price: "350000",
    originalPrice: "400000",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    tag: "Sale",
    tagColor: "#FFA500",
    rating: "4.9",
    reviewCount: 38,
    featured: true,
    sizes: "6 inch,8 inch"
  },
  {
    name: "Bánh Tết Truyền Thống",
    subtitle: "Bánh Tết cao cấp",
    description: "Bánh Tết với nhân truyền thống và vỏ bánh vàng ươm",
    category: "Theo Mùa",
    price: "280000",
    originalPrice: "320000",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    tag: null,
    tagColor: null,
    rating: "4.7",
    reviewCount: 41,
    featured: false,
    sizes: "500g,1kg"
  }
];

async function seed() {
  try {
    console.log("Seeding database...");
    
    for (const product of sampleProducts) {
      await db.insert(products).values(product);
    }
    
    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
