import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter, Heart } from 'lucide-react';
import { getProducts, Product } from '@/lib/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';
import { useNavigate } from 'react-router-dom';

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    size: '',
    color: '',
    sortBy: 'newest'
  });
  const navigate = useNavigate();

  // Mock data for demo
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Premium Cotton T-Shirt',
      description: 'Luxury cotton t-shirt with premium finish',
      price: 1999,
      imageURL: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      category: 'Tops',
      stock: 10,
      tags: ['cotton', 'premium', 'casual'],
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Designer Jeans',
      description: 'Premium designer jeans with perfect fit',
      price: 3999,
      imageURL: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
      category: 'Bottoms',
      stock: 5,
      tags: ['jeans', 'designer', 'denim'],
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Luxury Hoodie',
      description: 'Comfortable luxury hoodie for casual wear',
      price: 2999,
      imageURL: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
      category: 'Outerwear',
      stock: 8,
      tags: ['hoodie', 'luxury', 'comfort'],
      createdAt: new Date()
    },
    {
      id: '4',
      name: 'Silk Dress',
      description: 'Elegant silk dress for special occasions',
      price: 5999,
      imageURL: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446',
      category: 'Dresses',
      stock: 3,
      tags: ['silk', 'elegant', 'formal'],
      createdAt: new Date()
    },
    {
      id: '5',
      name: 'Leather Jacket',
      description: 'Premium leather jacket with modern design',
      price: 7999,
      imageURL: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
      category: 'Outerwear',
      stock: 4,
      tags: ['leather', 'jacket', 'premium'],
      createdAt: new Date()
    },
    {
      id: '6',
      name: 'Casual Sneakers',
      description: 'Comfortable sneakers for everyday wear',
      price: 2499,
      imageURL: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
      category: 'Footwear',
      stock: 12,
      tags: ['sneakers', 'casual', 'comfort'],
      createdAt: new Date()
    }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters, searchQuery]);

  const loadProducts = async () => {
    try {
      const productData = await getProducts();
      if (productData.length === 0) {
        // Use mock data if no products found
        setProducts(mockProducts);
      } else {
        setProducts(productData);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Use mock data on error
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Sort
    if (filters.sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'priceLow') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'priceHigh') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'popular') {
      filtered.sort((a, b) => b.stock - a.stock);
    }

    setFilteredProducts(filtered);
  };

  const addToWishlist = (productId: string) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </motion.button>
          <div className="flex-1 text-center">
            <img
              src="/IMG-20250305-WA0003-removebg-preview.png"
              alt="RARITONE"
              width={120}
              height={40}
              className="h-8 w-auto mx-auto mb-2"
            />
            <h1 className="text-3xl font-light text-white">Fashion Catalog</h1>
            <p className="text-gray-300">Discover our latest collection and find your perfect fit</p>
          </div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-lg shadow-sm p-6 mb-8 border border-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-gray-800 text-white"
            >
              <option value="">All Categories</option>
              <option value="Tops">Tops</option>
              <option value="Bottoms">Bottoms</option>
              <option value="Outerwear">Outerwear</option>
              <option value="Dresses">Dresses</option>
              <option value="Footwear">Footwear</option>
            </select>

            {/* Brand Filter */}
            <select
              value={filters.brand}
              onChange={(e) => setFilters({...filters, brand: e.target.value})}
              className="px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-gray-800 text-white"
            >
              <option value="">All Brands</option>
              <option value="RARITONE">RARITONE</option>
              <option value="Premium">Premium</option>
              <option value="Luxury">Luxury</option>
            </select>

            {/* Size Filter */}
            <select
              value={filters.size}
              onChange={(e) => setFilters({...filters, size: e.target.value})}
              className="px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-gray-800 text-white"
            >
              <option value="">All Sizes</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-gray-800 text-white"
            >
              <option value="newest">Newest</option>
              <option value="popular">Popular</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-300">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-800"
            >
              <div className="aspect-[3/4] overflow-hidden relative group">
                <img
                  src={product.imageURL}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => addToWishlist(product.id!)}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <Heart size={16} />
                </motion.button>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-white mb-1">{product.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{product.category}</p>
                <p className="text-lg font-semibold text-white">₹{product.price}</p>
                
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No products found matching your criteria.</p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  category: '',
                  brand: '',
                  size: '',
                  color: '',
                  sortBy: 'newest'
                });
              }}
              className="mt-4 bg-white text-black hover:bg-gray-200"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;