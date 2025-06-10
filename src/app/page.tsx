'use client';

import { useState } from 'react';
import Carousel from '@/components/Carousel';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  images: {
    auction?: string[];
    base?: string[];
    port?: string[];
  };
}

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products: Product[] = [
    {
      id: 1,
      name: "RAM 1500",
      images: {
        auction: [
          "https://es.ramtrucks.com/mediaserver/iris?client=FCAUS&market=U&brand=R&vehicle=2025_DT&paint=PCG&fabric=&sa=DT6R98,2TV,22V,APA&pov=fronthero&width=770&height=400&bkgnd=white&resp=jpg&x=&y=&w=&h=&width=500&width=500",
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ],
        base: [
          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ],
        port: [
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ]
      }
    },
    {
      id: 2,
      name: "RAM 2500",
      images: {
        auction: [
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ],
        base: [
          "https://images.unsplash.com/photo-1469285994282-454ceb49e63c?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ],
        port: []
      }
    },
    {
      id: 3,
      name: "RAM 3500",
      images: {
        auction: [],
        base: [],
        port: []
      }
    }
  ];

  return (
    <main className="min-h-screen p-8 bg-white">
        <h1 className="text-3xl font-bold mb-8">RAM Trucks Gallery</h1>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => {
            // Tomar la primera imagen disponible para la miniatura
            const allImages = [
              ...(product.images.auction || []),
              ...(product.images.base || []),
              ...(product.images.port || [])
            ];
            return (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => allImages.length > 0 && setSelectedProduct(product)}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg transition-all group-hover:shadow-xl">
                  {allImages.length > 0 ? (
                    <Image
                      src={allImages[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {allImages.length > 0 ? 'Click to view gallery' : 'No images available'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Modal */}
        {selectedProduct && (
          <Carousel
            media={{
              auction: (selectedProduct.images.auction || []).map(url => ({ label: 'Subasta', url })),
              base: (selectedProduct.images.base || []).map(url => ({ label: 'AutoPAQ', url })),
              port: (selectedProduct.images.port || []).map(url => ({ label: 'Puerto', url })),
            }}
            autoPlay={false}
            interval={5000}
            initialSlide={0}
            showModal={true}
            onClose={() => setSelectedProduct(null)}
          />
        )}
    </main>
  );
}
