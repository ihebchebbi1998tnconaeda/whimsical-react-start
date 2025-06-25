
import { useTranslation } from 'react-i18next';
import { getSizeFieldsForItemGroup, SIZE_DISPLAY_NAMES } from '@/data/productCategories';

interface Product {
  itemgroup_product: string;
  xs_size?: string;
  s_size?: string;
  m_size?: string;
  l_size?: string;
  xl_size?: string;
  xxl_size?: string;
  '3xl_size'?: string;
  '4xl_size'?: string;
  '48_size'?: string;
  '50_size'?: string;
  '52_size'?: string;
  '54_size'?: string;
  '56_size'?: string;
  '58_size'?: string;
}

interface ProductSizeSelectorProps {
  product: Product;
  selectedSize: string;
  onSizeSelect: (size: string) => void;
}

const ProductSizeSelector = ({ product, selectedSize, onSizeSelect }: ProductSizeSelectorProps) => {
  const { t } = useTranslation(['products']);

  const getSizeAvailability = () => {
    // Determine which type of sizes this product uses
    const standardSizes = ['xs_size', 's_size', 'm_size', 'l_size', 'xl_size', 'xxl_size', '3xl_size', '4xl_size'];
    const formalSizes = ['48_size', '50_size', '52_size', '54_size', '56_size', '58_size'];
    
    // Check if product has any standard sizes
    const hasStandardSizes = standardSizes.some(sizeField => {
      const sizeValue = product[sizeField as keyof Product] as string;
      return sizeValue && parseInt(sizeValue) > 0;
    });

    // Check if product has any formal sizes
    const hasFormalSizes = formalSizes.some(sizeField => {
      const sizeValue = product[sizeField as keyof Product] as string;
      return sizeValue && parseInt(sizeValue) > 0;
    });

    const sizesToCheck = hasStandardSizes ? standardSizes : formalSizes;
    const sizes: { size: string; available: boolean; quantity: number }[] = [];
    
    sizesToCheck.forEach(sizeField => {
      const sizeValue = product[sizeField as keyof Product] as string;
      const quantity = sizeValue ? parseInt(sizeValue) : 0;
      const displayName = SIZE_DISPLAY_NAMES[sizeField];
      
      if (displayName) {
        sizes.push({
          size: displayName,
          available: quantity > 0,
          quantity
        });
      }
    });
    
    return sizes;
  };

  const sizeAvailability = getSizeAvailability();

  if (sizeAvailability.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-slate-900 uppercase tracking-wide">
          SIZE:
        </span>
        <button className="text-sm text-slate-600 underline hover:text-slate-900">
          Size Chart
        </button>
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {sizeAvailability.map(({ size, available }) => (
          <button
            key={size}
            onClick={() => available && onSizeSelect(size)}
            disabled={!available}
            className={`
              relative aspect-square border-2 rounded text-sm font-medium transition-all duration-200
              ${available 
                ? selectedSize === size
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 text-slate-900 hover:border-slate-600'
                : 'border-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            <span className="absolute inset-0 flex items-center justify-center">
              {size}
            </span>
            {!available && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-slate-400 rotate-45"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductSizeSelector;
