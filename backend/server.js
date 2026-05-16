const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   MONGODB CONNECTION
========================= */

mongoose
  .connect("mongodb+srv://afiya:12345@cluster0.qwzuv5t.mongodb.net/?appName=Cluster0")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });

/* =========================
   PRODUCT SCHEMA
========================= */

const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  categorySlug: String,
  price: Number,
  image: String,
  description: String,
});

const Product = mongoose.model("Product", productSchema);

/* =========================
   FALLBACK PRODUCTS
========================= */

const fallbackProducts = [
  {
    id: "living-arden-sofa",
    name: "Arden Linen Sofa",
    category: "Living Room",
    categorySlug: "living-room",
    price: 1890,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",
    description:
      "A deep, comfortable sofa with oatmeal upholstery and a low modern profile.",
  },

  {
    id: "living-mila-chair",
    name: "Mila Boucle Chair",
    category: "Living Room",
    categorySlug: "living-room",
    price: 640,
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=85",
    description:
      "A sculptural accent chair made for reading corners and relaxed conversation.",
  },

  {
    id: "living-sculptural-bookcase",
    name: "Sculptural Oak Bookcase",
    category: "Living Room",
    categorySlug: "living-room",
    price: 1340,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
    description:
      "Open oak shelving for books, pottery, and collected decor.",
  },

  {
    id: "living-cane-cabinet",
    name: "Cane Door Cabinet",
    category: "Living Room",
    categorySlug: "living-room",
    price: 1120,
    image:
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=900&q=85",
    description:
      "A natural cane cabinet that hides clutter while keeping the room airy.",
  },

  {
    id: "bedroom-luna-bed",
    name: "Luna Upholstered Bed",
    category: "Bedroom",
    categorySlug: "bedroom",
    price: 1640,
    image:
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=900&q=85",
    description:
      "A softly padded bed frame with a calm, hotel-inspired presence.",
  },

  {
    id: "bedroom-arc-mirror",
    name: "Arc Floor Mirror",
    category: "Bedroom",
    categorySlug: "bedroom",
    price: 560,
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85",
    description:
      "A tall rounded mirror that brightens bedrooms and dressing areas.",
  },

  {
    id: "bedroom-velvet-headboard",
    name: "Velvet Panel Headboard",
    category: "Bedroom",
    categorySlug: "bedroom",
    price: 760,
    image:
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=900&q=85",
    description:
      "A plush headboard that adds quiet luxury to neutral bedrooms.",
  },

  {
    id: "dining-verde-table",
    name: "Verde Oak Dining Table",
    category: "Dining",
    categorySlug: "dining",
    price: 1420,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
    description:
      "A generous dining table with a warm finish and modern rounded legs.",
  },

  {
    id: "dining-rattan-bar-cart",
    name: "Rattan Bar Cart",
    category: "Dining",
    categorySlug: "dining",
    price: 540,
    image:
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=900&q=85",
    description:
      "A rolling cart for glassware, bottles, and dining room styling.",
  },

  {
    id: "dining-black-cutlery",
    name: "Matte Cutlery Set",
    category: "Dining",
    categorySlug: "dining",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=85",
    description:
      "Modern flatware with a slim profile and satin finish.",
  },

  {
    id: "lighting-pearl-chandelier",
    name: "Pearl Branch Chandelier",
    category: "Lighting",
    categorySlug: "lighting",
    price: 1240,
    image:
      "https://images.unsplash.com/photo-1602872030490-4a484a7b3ba6?auto=format&fit=crop&w=900&q=85",
    description:
      "A graceful statement chandelier for dining rooms and tall living spaces.",
  },

  {
    id: "lighting-alabaster-lamp",
    name: "Alabaster Accent Lamp",
    category: "Lighting",
    categorySlug: "lighting",
    price: 430,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
    description:
      "A luminous stone lamp for consoles, nightstands, and shelves.",
  },

  {
    id: "lighting-smoked-glass-pendant",
    name: "Smoked Glass Pendant",
    category: "Lighting",
    categorySlug: "lighting",
    price: 360,
    image:
      "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?auto=format&fit=crop&w=900&q=85",
    description:
      "A moody glass pendant with polished hardware and soft contrast.",
  },

  {
    id: "wall-abstract-canvas",
    name: "Abstract Neutral Canvas",
    category: "Wall Decor",
    categorySlug: "wall-decor",
    price: 420,
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=900",
    description:
      "A large neutral canvas with soft movement and gallery-style presence.",
  },

  {
    id: "wall-ceramic-wall-plates",
    name: "Ceramic Wall Plate Trio",
    category: "Wall Decor",
    categorySlug: "wall-decor",
    price: 175,
    image:
      "https://images.pexels.com/photos/6207811/pexels-photo-6207811.jpeg?auto=compress&cs=tinysrgb&w=900",
    description:
      "Handmade-style ceramic plates that bring dimension to dining walls.",
  },

  {
    id: "decor-fiddle-fig",
    name: "Fiddle Leaf Fig Planter",
    category: "Plants & Decor",
    categorySlug: "plants-decor",
    price: 185,
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85",
    description:
      "A lush indoor fig paired with a simple ceramic planter.",
  },

  {
    id: "decor-succulent-set",
    name: "Succulent Planter Set",
    category: "Plants & Decor",
    categorySlug: "plants-decor",
    price: 88,
    image:
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=900&q=85",
    description:
      "Small sculptural succulents in simple planters for shelves and desks.",
  },

  {
    id: "decor-linen-throw",
    name: "Textured Linen Throw",
    category: "Plants & Decor",
    categorySlug: "plants-decor",
    price: 98,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=85",
    description:
      "A light woven throw that softens sofas, beds, and lounge chairs.",
  },

  {
    id: "office-walnut-desk",
    name: "Walnut Writing Desk",
    category: "Office Decor",
    categorySlug: "office-decor",
    price: 980,
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=85",
    description:
      "A warm wood desk with a slim frame and quiet storage.",
  },

  {
    id: "office-file-cabinet",
    name: "Fluted File Cabinet",
    category: "Office Decor",
    categorySlug: "office-decor",
    price: 560,
    image:
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=900&q=85",
    description:
      "A refined file cabinet that hides paperwork without looking corporate.",
  },
];
/* =========================
   USER SCHEMA
========================= */

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User=mongoose.model("User", userSchema);
/* =========================
   ORDER SCHEMA
========================= */

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: Number,
  paymentMethod: String,
  paymentStatus: String,
  transactionId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      productId: String,
      name: String,
      price: Number,
      image: String,
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

/* =========================
   CART SCHEMA
========================= */

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  products: [
    {
      productId: String,
      name: String,
      price: Number,
      image: String,
      quantity: Number,
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Novera Home Backend Running");
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();

    if (products.length > 0) {
      res.json(products);
    } else {
      res.json(fallbackProducts);
    }
  } catch (error) {
    console.log(error);
    res.json(fallbackProducts);
  }
});
/* =========================
   SEED PRODUCTS TO MONGODB
========================= */

app.get("/seed-products", async (req, res) => {
  try {
    await Product.deleteMany();

    await Product.insertMany(fallbackProducts);

    res.send("Products Seeded Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error Seeding Products");
  }
});
/* =========================
   SIGNUP ROUTE
========================= */

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    res.json({
      success: true,
      message: "Signup successful",
      user: newUser,
    });
  } catch (error) {
  console.log("SIGNUP ERROR:", error.message);

  res.status(500).json({
    success: false,
    message: "Server error",
  });
}
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });

    // check if user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // check password
    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // login success
    res.json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
/* =========================
   CREATE ORDER ROUTE
========================= */

app.post("/order", async (req, res) => {
  try {
    const { userId, products, totalAmount } = req.body;

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
    });

    await newOrder.save();

    res.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log("ORDER ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.post("/payment", async (req, res) => {
  try {
    const { userId, products, totalAmount, paymentMethod } = req.body;
    const transactionId = `TXN-${Date.now()}`;

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      paymentMethod,
      paymentStatus: "Paid",
      transactionId,
    });

    await newOrder.save();

    res.json({
      success: true,
      message: "Payment successful",
      order: newOrder,
    });
  } catch (error) {
    console.log("PAYMENT ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.get("/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log("GET ORDERS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   WISHLIST ROUTES
========================= */

app.post("/wishlist/add", async (req, res) => {
  try {
    const { userId, product } = req.body;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        products: [product],
      });

      await wishlist.save();

      return res.json({
        success: true,
        message: "Product added to wishlist",
        wishlist,
      });
    }

    const existingProduct = wishlist.products.find(
      (item) => item.productId === product.productId
    );

    if (existingProduct) {
      return res.json({
        success: false,
        message: "Product already in wishlist",
        wishlist,
      });
    }

    wishlist.products.push(product);

    await wishlist.save();

    res.json({
      success: true,
      message: "Wishlist updated",
      wishlist,
    });
  } catch (error) {
    console.log("WISHLIST ADD ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.get("/wishlist/:userId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      userId: req.params.userId,
    });

    res.json(wishlist ? wishlist.products : []);
  } catch (error) {
    console.log("GET WISHLIST ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.delete("/wishlist/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (item) => item.productId !== productId
    );

    await wishlist.save();

    res.json({
      success: true,
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    console.log("REMOVE WISHLIST ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   ADD TO CART
========================= */

app.post("/cart/add", async (req, res) => {
  try {
    const { userId, product } = req.body;

    let cart = await Cart.findOne({ userId });

    // if no cart exists
    if (!cart) {
      cart = new Cart({
        userId,
        products: [
          {
            ...product,
            quantity: 1,
          },
        ],
      });

      await cart.save();

      return res.json({
        success: true,
        message: "Product added to cart",
        cart,
      });
    }

    // check if product already exists
    const existingProduct = cart.products.find(
      (item) => item.productId === product.productId
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({
        ...product,
        quantity: 1,
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    console.log("CART ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   GET USER CART
========================= */

app.get("/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.params.userId,
    });

    res.json(cart || { products: [] });
  } catch (error) {
    console.log("GET CART ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   REMOVE FROM CART
========================= */

app.post("/cart/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.products = cart.products.filter(
      (item) => item.productId !== productId
    );

    await cart.save();

    res.json({
      success: true,
      message: "Product removed",
      cart,
    });
  } catch (error) {
    console.log("REMOVE CART ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   ADMIN ROUTES
========================= */

app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    console.log("ADMIN USERS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.get("/admin/orders", async (req, res) => {
  try {
    const orders = await Order.find();

    res.json(orders);
  } catch (error) {
    console.log("ADMIN ORDERS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.get("/admin/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    console.log("ADMIN PRODUCTS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.get("/admin/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0] ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
    });
  } catch (error) {
    console.log("ADMIN STATS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   VIEW USERS
========================= */

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching users");
  }
});

/* =========================
   VIEW ORDERS
========================= */

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching orders");
  }
});
/* =========================
   SERVER
========================= */

const PORT = 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
