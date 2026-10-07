import Image from 'next/image';

interface Product {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    images: {
      edges: Array<{
        node: {
          url: string;
          altText?: string;
        };
      }>;
    };
  };
}

async function getProducts(): Promise<Product[]> {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN;

  const res = await fetch(`https://${domain}/api/2026-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token || '',
    },
    body: JSON.stringify({
      query: `
        query {
          products(first: 6) {
            edges {
              node {
                id
                title
                handle
                description
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      `,
    }),
    next: { revalidate: 60 }, 
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products from Shopify');
  }

  const { data } = await res.json();
  return data?.products?.edges || [];
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Shopify Headless Page
        </h1>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found. Check your API token or inventory.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map(({ node: product }) => {
              const image = product.images.edges[0]?.node;

              return (
                <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-64 bg-gray-100 w-full">
                    {image?.url ? (
                      <Image
                        src={image.url}
                        alt={image.altText || product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">{product.title}</h2>
                    <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
