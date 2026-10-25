import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://www.treasureboxus.com";
const BRAND = "Treasure Box";
const root = process.cwd();
const distDir = path.join(root, "dist");
const sourceIndex = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
const productSource = fs.readFileSync(path.join(root, "src/data/products.ts"), "utf8");

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
const escapeJson = (value) => JSON.stringify(value).replaceAll("</", "<\\/");

function parseProducts() {
  return [...productSource.matchAll(/\{\n\s+id:\s+'([^']+)'[\s\S]*?\n\s+\}(?=,?\n\s*(?:\{|\]))/g)]
    .map((match) => {
      const block = match[0];
      const field = (name) => block.match(new RegExp(`${name}:\\s*'([^']*)'`))?.[1] || "";
      const price = block.match(/price:\s*(\d+)/)?.[1];
      return {
        id: match[1],
        slug: field("slug"),
        name: field("name"),
        category: field("categoryLabel") || field("category"),
        description: field("description"),
        price: price ? Number(price) : undefined,
        currency: field("currency") || "USD",
      };
    })
    .filter((product) => product.slug && product.name);
}

const products = parseProducts();
const pageDefinitions = [
  {
    path: "/",
    title: "Iced-Out Jewelry & Luxury Watches | Treasure Box",
    description: "Shop iced-out chains, diamond jewelry, luxury watches, and custom pieces from Treasure Box, a New York jewelry house shipping worldwide.",
    heading: "Luxury jewelry with no quiet mode.",
    body: "Discover iced-out chains, diamond pendants, fine jewelry, luxury watches, and custom pieces from Treasure Box, a New York jewelry house shipping worldwide.",
    links: ["/shop", "/shop/for-him", "/shop/for-her", "/shop/watches", "/shop/custom"],
  },
  {
    path: "/shop",
    title: "Shop Iced-Out Jewelry & Luxury Watches | Treasure Box",
    description: "Explore the Treasure Box vault: diamond pendants, gold chains, fine jewelry, custom pieces, and iced-out luxury watches.",
    heading: "The Vault",
    body: "Every piece. Every category. Every price point. Shop statement jewelry, diamond pieces, watches, and made-to-order designs from Treasure Box.",
    links: ["/shop/for-him", "/shop/for-her", "/shop/watches", "/shop/custom"],
  },
  {
    path: "/shop/for-him",
    title: "Men's Iced-Out Chains, Pendants & Bracelets | Treasure Box",
    description: "Shop men's iced-out chains, Cuban link bracelets, diamond pendants, and statement jewelry crafted in gold and VVS diamonds.",
    heading: "For Him",
    body: "Iced statement pieces, chains, pendants, and Cuban links built to flood the room with light.",
    links: ["/shop", "/shop/custom", "/contact"],
  },
  {
    path: "/shop/for-her",
    title: "Women's Fine Jewelry & Diamond Pieces | Treasure Box",
    description: "Discover diamond studs, pendants, rings, and refined fine jewelry designed for everyday luxury and unforgettable moments.",
    heading: "For Her",
    body: "Refined heirlooms, diamond studs, pendants, rings, and fine jewelry designed for everyday luxury.",
    links: ["/shop", "/shop/custom", "/contact"],
  },
  {
    path: "/shop/watches",
    title: "Iced-Out Luxury Watches | Treasure Box",
    description: "Browse iced-out luxury watches with hand-set stones, presidential silhouettes, and warranty-backed craftsmanship from Treasure Box.",
    heading: "Watches",
    body: "Iced-out timepieces and presidential silhouettes, hand-set in the Treasure Box atelier.",
    links: ["/shop", "/contact"],
  },
  {
    path: "/shop/custom",
    title: "Custom Iced Jewelry & Bespoke Pendants | Treasure Box",
    description: "Create a one-of-one custom jewelry piece with Treasure Box. Made-to-order portraits and statement pendants built around your story.",
    heading: "Custom Jewelry",
    body: "Made-to-order pieces designed around you. Share your story and create a one-of-one iced jewelry design with Treasure Box.",
    links: ["/contact", "/shop", "/about"],
  },
  {
    path: "/about",
    title: "About Treasure Box | New York Fine Jewelry House",
    description: "Meet Treasure Box, a New York jewelry house blending street-born boldness with atelier craftsmanship, lifetime service, and worldwide shipping.",
    heading: "The House",
    body: "Treasure Box blends street-born boldness with atelier craftsmanship, lifetime service, and worldwide shipping.",
    links: ["/shop", "/shop/custom", "/contact"],
  },
  {
    path: "/contact",
    title: "Contact Treasure Box Jewelry Concierge | New York",
    description: "Contact the Treasure Box concierge for private viewings, custom jewelry, press inquiries, shipping questions, and appointment requests.",
    heading: "Talk to the concierge",
    body: "Contact the Treasure Box concierge for private viewings, custom jewelry, press inquiries, shipping questions, and appointment requests.",
    links: ["/shop/custom", "/about", "/shop"],
  },
];

function productPage(product) {
  return {
    path: `/product/${product.slug}`,
    title: `${product.name} | Treasure Box`,
    description: `${product.description} Shop this Treasure Box piece with worldwide shipping and lifetime service.`,
    heading: product.name,
    body: `${product.description} Explore materials, craftsmanship, shipping, and lifetime service for this Treasure Box piece.`,
    links: ["/shop", `/shop/${product.category?.toLowerCase().replaceAll(" ", "-") || "custom"}`, "/contact"],
    product,
  };
}

function breadcrumbFor(page) {
  const crumbs = [{ name: "Home", url: "/" }];
  if (page.path.startsWith("/product/")) crumbs.push({ name: "Shop", url: "/shop" }, { name: page.heading, url: page.path });
  else if (page.path !== "/") crumbs.push({ name: page.heading, url: page.path });
  return crumbs;
}

function jsonLdFor(page) {
  const organization = {
    "@type": ["Organization", "JewelryStore"],
    "@id": `${SITE_URL}/#organization`,
    name: BRAND,
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.jpg`,
    image: `${SITE_URL}/og-image.jpg`,
    description: "A New York jewelry house creating iced-out jewelry, fine pieces, luxury watches, and custom designs.",
    priceRange: "$$$",
    telephone: "+1-404-909-0670",
    email: "concierge@treasurebox.co",
    address: { "@type": "PostalAddress", streetAddress: "347 Canal Street", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
    areaServed: "Worldwide",
    sameAs: ["https://www.instagram.com/treasureboxus"],
  };
  const graph = [
    organization,
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: BRAND, url: SITE_URL, publisher: { "@id": `${SITE_URL}/#organization` }, inLanguage: "en-US" },
    { "@type": "BreadcrumbList", itemListElement: breadcrumbFor(page).map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: `${SITE_URL}${item.url}` })) },
  ];
  if (page.path === "/shop") {
    graph.push({ "@type": "ItemList", itemListElement: products.map((product, index) => ({ "@type": "ListItem", position: index + 1, name: product.name, url: `${SITE_URL}/product/${product.slug}` })) });
  }
  if (page.product) {
    graph.push({
      "@type": "Product",
      name: page.product.name,
      description: page.product.description,
      image: [`${SITE_URL}/og-image.jpg`],
      sku: page.product.id,
      brand: { "@type": "Brand", name: BRAND },
      url: `${SITE_URL}${page.path}`,
      offers: page.product.price ? { "@type": "Offer", url: `${SITE_URL}${page.path}`, price: page.product.price.toFixed(2), priceCurrency: page.product.currency, availability: page.product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", itemCondition: "https://schema.org/NewCondition" } : undefined,
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

function contentFor(page) {
  const links = page.links.map((link) => `<a href="${link}">${escapeHtml(link === "/shop" ? "Shop the vault" : link === "/contact" ? "Contact the concierge" : link === "/shop/custom" ? "Create a custom piece" : link.slice(1).replaceAll("/", " · "))}</a>`).join(" · ");
  const productList = page.path === "/shop" ? `<section><h2>Featured Treasure Box pieces</h2><ul>${products.map((product) => `<li><a href="/product/${escapeHtml(product.slug)}">${escapeHtml(product.name)}</a> — ${escapeHtml(product.description)}</li>`).join("")}</ul></section>` : "";
  return `<main><p>Treasure Box · New York jewelry house</p><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.body)}</p>${productList}<nav aria-label="Related pages">${links}</nav></main>`;
}

function renderPage(page) {
  const canonical = `${SITE_URL}${page.path === "/" ? "/" : page.path}`;
  const image = `${SITE_URL}/og-image.jpg`;
  const meta = `\n    <meta name="description" content="${escapeHtml(page.description)}" />\n    <meta name="robots" content="index, follow" />\n    <meta property="og:title" content="${escapeHtml(page.title)}" />\n    <meta property="og:description" content="${escapeHtml(page.description)}" />\n    <meta property="og:type" content="${page.product ? "product" : "website"}" />\n    <meta property="og:site_name" content="${BRAND}" />\n    <meta property="og:locale" content="en_US" />\n    <meta property="og:url" content="${canonical}" />\n    <meta property="og:image" content="${image}" />\n    <meta property="og:image:alt" content="${escapeHtml(page.heading)}" />\n    <meta property="og:image:type" content="image/jpeg" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:site" content="@treasureboxus" />\n    <meta name="twitter:title" content="${escapeHtml(page.title)}" />\n    <meta name="twitter:description" content="${escapeHtml(page.description)}" />\n    <meta name="twitter:image" content="${image}" />\n    <link rel="canonical" href="${canonical}" />\n    <script type="application/ld+json">${escapeJson(jsonLdFor(page))}</script>`;
  return sourceIndex.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`).replace("</head>", `${meta}\n  </head>`).replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${contentFor(page)}</div>`);
}

const pages = [...pageDefinitions, ...products.map(productPage)];
for (const page of pages) {
  const outputPath = page.path === "/" ? path.join(distDir, "index.html") : path.join(distDir, page.path.slice(1), "index.html");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, renderPage(page));
}

const sitemapUrls = pages.filter((page) => page.path !== "/").map((page) => `  <url><loc>${SITE_URL}${page.path}</loc></url>`).join("\n");
fs.writeFileSync(path.join(distDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}/</loc></url>\n${sitemapUrls}\n</urlset>\n`);
fs.writeFileSync(path.join(distDir, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /cart\nDisallow: /checkout\nDisallow: /order-confirmed\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
fs.writeFileSync(path.join(distDir, "manus-routes.json"), JSON.stringify({ routes: [...new Map(pages.map((page) => [page.path.startsWith("/product/") ? "/product/:slug" : page.path, { path: page.path.startsWith("/product/") ? "/product/:slug" : page.path, title: page.path.startsWith("/product/") ? "Product detail" : page.title }])).values()] }, null, 2) + "\n");
console.log(`Generated ${pages.length} crawlable Treasure Box pages and synchronized SEO assets.`);
