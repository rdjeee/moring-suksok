"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Leaf,
  ShoppingCart,
  User,
  Menu,
  Heart,
  Truck,
  Shield,
  Star,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiClient, formatIDR, type ApiError } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types (sesuai backend SQLAlchemy models — specs/05-data-model.md)
// ---------------------------------------------------------------------------
interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  base_price: string; // DECIMAL comes as string from API
  is_active: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ProductWithVariants extends Product {
  variants?: Array<{
    id: number;
    variant_name: string;
    stock: number;
  }>;
}

// ---------------------------------------------------------------------------
// Landing page
// ---------------------------------------------------------------------------
export default function HomePage() {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        // Backend belum punya /products endpoint (akan dibuat di Step 7).
        // Untuk sekarang, pakai fallback static data agar landing page tetap render.
        const fallbackProducts: ProductWithVariants[] = [
          {
            id: 1,
            name: "Moring Original",
            slug: "moring-original",
            description:
              "Cimol kering (moring) dengan rasa original, gurih, renyah, dan tahan lama.",
            category: "snack",
            base_price: "15000",
            is_active: true,
            image_url: null,
            created_at: "",
            updated_at: "",
            variants: [
              { id: 1, variant_name: "Original 100gr", stock: 50 },
              { id: 2, variant_name: "Original 250gr", stock: 20 },
              { id: 3, variant_name: "Original 500gr", stock: 10 },
            ],
          },
          {
            id: 2,
            name: "Moring Pedas",
            slug: "moring-pedas",
            description:
              "Cimol kering (moring) dengan bumbu pedas untuk pecinta pedas.",
            category: "snack",
            base_price: "17000",
            is_active: true,
            image_url: null,
            created_at: "",
            updated_at: "",
            variants: [
              { id: 4, variant_name: "Pedas 100gr", stock: 40 },
              { id: 5, variant_name: "Pedas 250gr", stock: 15 },
            ],
          },
          {
            id: 3,
            name: "Moring Keju",
            slug: "moring-keju",
            description:
              "Cimol kering (moring) dengan topping keju untuk rasa yang lebih creamy.",
            category: "snack",
            base_price: "18000",
            is_active: true,
            image_url: null,
            created_at: "",
            updated_at: "",
            variants: [
              { id: 6, variant_name: "Keju 100gr", stock: 30 },
              { id: 7, variant_name: "Keju 250gr", stock: 12 },
            ],
          },
          {
            id: 4,
            name: "Moring Balado",
            slug: "moring-balado",
            description:
              "Cimol kering (moring) dengan bumbu balado yang pedas manis khas Indonesia.",
            category: "snack",
            base_price: "17000",
            is_active: true,
            image_url: null,
            created_at: "",
            updated_at: "",
            variants: [
              { id: 8, variant_name: "Balado 100gr", stock: 35 },
              { id: 9, variant_name: "Balado 250gr", stock: 14 },
            ],
          },
          {
            id: 5,
            name: "Moring Jagung",
            slug: "moring-jagung",
            description:
              "Cimol kering (moring) dengan rasa jagung manis yang disukai anak-anak.",
            category: "snack",
            base_price: "16000",
            is_active: true,
            image_url: null,
            created_at: "",
            updated_at: "",
            variants: [
              { id: 10, variant_name: "Jagung 100gr", stock: 38 },
              { id: 11, variant_name: "Jagung 250gr", stock: 16 },
            ],
          },
        ];

        try {
          // Coba fetch dari backend (Step 8+ akan implement /products endpoint)
          // apiClient pakai axios dengan JWT interceptor + sandbox gateway-aware
          const data = await apiClient.get<ProductWithVariants[]>("/products");
          setProducts(data.length > 0 ? data : fallbackProducts);
        } catch (err) {
          const apiErr = err as ApiError;
          console.info(
            "Backend /products belum tersedia, pakai fallback data:",
            apiErr.message,
          );
          setProducts(fallbackProducts);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="text-foreground">
              Moring <span className="text-primary">Suksok</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Beranda
            </Link>
            <Link href="/#produk" className="text-muted-foreground hover:text-primary transition-colors">
              Produk
            </Link>
            <Link href="/#tentang" className="text-muted-foreground hover:text-primary transition-colors">
              Tentang
            </Link>
            <Link href="/#kontak" className="text-muted-foreground hover:text-primary transition-colors">
              Kontak
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Keranjang" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                0
              </Badge>
            </Button>
            <Button variant="ghost" size="icon" aria-label="Akun">
              <User className="h-5 w-5" />
            </Button>
            <Button size="sm" className="hidden sm:inline-flex">
              Masuk
            </Button>
          </div>
        </div>
      </header>

      {/* ===== Main content ===== */}
      <main className="flex-1">
        {/* Hero section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-moring-green-pale via-background to-background">
          <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <Badge variant="secondary" className="inline-flex items-center gap-1.5">
                  <Leaf className="h-3.5 w-3.5" />
                  Camilan Cimol Kering (Moring)
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  Cimol Kering Moring{" "}
                  <span className="text-primary">Renyah & Bergizi</span>
                </h1>
                <p className="text-base text-muted-foreground sm:text-lg max-w-prose mx-auto lg:mx-0">
                  Nikmati kebaikan moring dalam setiap gigitan. Dibuat dari cimol kering pilihan
                  dengan tekstur renyah dan tahan lama.{" "}
                  <span className="font-medium text-foreground">Sehat, renyah, bikin nagih!</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Button size="lg" asChild>
                    <Link href="#produk">
                      Belanja Sekarang
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#tentang">Pelajari Lebih</Link>
                  </Button>
                </div>
                {/* Trust badges */}
                <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-primary" /> 100% Natural
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-primary" /> Gratis Ongkir*
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-primary" /> Rating 4.9
                  </span>
                </div>
              </div>

              {/* Hero image placeholder */}
              <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-moring-green-light/20 blur-2xl" />
                <div className="relative h-full w-full rounded-3xl bg-gradient-to-br from-moring-green-pale to-background border border-border shadow-lg flex items-center justify-center overflow-hidden">
                  <div className="text-center p-8">
                    <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <Leaf className="h-16 w-16 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      🌿 Cimol Kering Premium
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sumber: produksi lokal Indonesia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features strip */}
        <section className="border-y border-border bg-card">
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { icon: Leaf, label: "100% Natural", desc: "Tanpa pengawet" },
                { icon: Heart, label: "Bergizi", desc: "Kaya antioksidan" },
                { icon: Truck, label: "Cepat Sampai", desc: "1-3 hari kerja" },
                { icon: Shield, label: "Terpercaya", desc: "UMKM lokal" },
              ].map((feature) => (
                <div key={feature.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products section */}
        <section id="produk" className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  Produk Kami
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Pilihan rasa cimol kering moring untuk Anda
                </p>
              </div>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Lihat semua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-square bg-muted animate-pulse" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                      <div className="h-8 w-full bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-6 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Gagal memuat produk</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Products grid */}
            {!loading && !error && (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Tentang section */}
        <section id="tentang" className="py-12 sm:py-16 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <Badge variant="secondary" className="inline-flex">
                Tentang Kami
              </Badge>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Dari Produksi Lokal, untuk Keluarga Indonesia
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                Moring Suksok adalah UMKM yang memproduksi cimol kering (moring) — camilan
                sehat dan lezat. Kami percaya bahwa makanan sehat tidak perlu mahal dan sulit
                dicari. Setiap produk kami dibuat dengan bahan baku pilihan dan diproses dengan
                standar higienis untuk menghasilkan cimol kering yang renyah dan tahan lama.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto">
                <div>
                  <p className="text-2xl font-bold text-primary">100%</p>
                  <p className="text-xs text-muted-foreground">Natural</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">5+</p>
                  <p className="text-xs text-muted-foreground">Varian Rasa</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">4.9★</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== Footer (sticky to bottom per UI rules) ===== */}
      <footer id="kontak" className="mt-auto border-t border-border bg-moring-green-dark text-white">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-moring-green-dark">
                  <Leaf className="h-4 w-4" />
                </span>
                <span>Moring Suksok</span>
              </div>
              <p className="text-sm text-white/80 max-w-xs">
                Camilan cimol kering (moring) sehat & renyah. UMKM lokal Indonesia untuk keluarga sehat.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Kontak</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>WhatsApp: 0812-xxxx-xxxx</li>
                <li>Email: hello@moring-suksok.com</li>
                <li>Instagram: @moringsuksok</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Layanan</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>Pembayaran: QRIS & Transfer</li>
                <li>Pengiriman: 1-3 hari kerja</li>
                <li>Jam operasional: 08.00 - 17.00 WIB</li>
              </ul>
            </div>
          </div>
          <Separator className="my-6 bg-white/20" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-white/60">
            <p>© 2026 Moring Suksok. All rights reserved.</p>
            <p>Camilan Cimol Kering (Moring) 🌿</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Product card component
// ---------------------------------------------------------------------------
function ProductCard({ product }: { product: ProductWithVariants }) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    // TODO: integrate with cart context (Step 8+)
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      {/* Product image / placeholder */}
      <div className="aspect-square bg-gradient-to-br from-moring-green-pale to-background flex items-center justify-center relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Leaf className="h-12 w-12 text-primary/40" />
        )}
        {product.variants && product.variants.length > 0 && (
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 bg-white/90 text-foreground"
          >
            {product.variants.length} varian
          </Badge>
        )}
      </div>

      <CardContent className="p-3 sm:p-4 space-y-1.5">
        <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
          {product.description}
        </p>
        <p className="text-lg font-bold text-primary font-mono tabular-nums">
          {formatIDR(product.base_price)}
        </p>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button
          size="sm"
          className="w-full"
          variant={added ? "secondary" : "default"}
          onClick={handleAddToCart}
          disabled={added}
        >
          {added ? (
            "Ditambahkan ✓"
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-1.5" />
              Tambah
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
