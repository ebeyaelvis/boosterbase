import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useCartContext } from '@/components/cart/CartProvider';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, Shield, Clock, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Add more features based on product category
const productFeatures = {
  "networking": [
    "Enterprise-grade Cisco equipment",
    "24/7 Network monitoring",
    "Managed firewall services",
    "Network optimization",
    "Dedicated support team"
  ],
  "cloud": [
    "Multi-cloud architecture",
    "Auto-scaling capabilities",
    "Disaster recovery",
    "Cloud security suite",
    "Performance monitoring"
  ],
  // Add features for other categories...
};

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { addToCart } = useCartContext();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    // Simulate API call to fetch product details
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // In production, replace this with actual API call
        const foundProduct = recommendedProducts.find(p => p.id === id);
        setProduct(foundProduct);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-blue-600">
            ₦{product.price_range}
          </p>
          <p className="text-gray-600">{product.description}</p>

          {/* Key Features */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Key Features</h3>
            <ul className="space-y-2">
              {productFeatures[product.category_id]?.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="text-green-500 h-5 w-5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-4 py-6">
            <div className="flex items-center gap-2">
              <Shield className="text-blue-600 h-5 w-5" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-blue-600 h-5 w-5" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="text-blue-600 h-5 w-5" />
              <span>Complete Solution</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => addToCart({
                id: product.id,
                name: product.name,
                price_range: product.price_range,
                image_url: product.image_url,
              }, true)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.location.href = `mailto:sales@boosterbaseng.com?subject=Inquiry about ${product.name}`}
            >
              Request Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
