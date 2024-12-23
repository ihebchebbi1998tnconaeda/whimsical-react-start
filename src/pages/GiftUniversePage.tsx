import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";
import Footer from "../components/Footer";
import ProductsSection from "../components/productsPages/ProductsSection";
import BrandNavbarSection from "@/components/productsPages/BrandNavbarSection";
import MainNavbarProduct from "@/components/productsPages/MainNavbarProduct";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const GiftUniversePage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const pathSegments = location.pathname
    .split('/')
    .filter(segment => segment !== '' && segment !== 'univers-cadeaux');

  useEffect(() => {
    console.log("Current gift universe path:", pathSegments);
    toast({
      title: "Gift Universe Category",
      description: `Browsing: ${pathSegments.join(' > ')}`,
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <TopNavbar />
      <BrandNavbarSection />
      
      <div className="hidden lg:block">
        <MainNavbarProduct />
      </div>

      <div className="flex-grow bg-[#F9FAFB]">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
            aria-label="Go back to home"
          >
            <ArrowLeft size={24} />
            <span>Retour à l'accueil</span>
          </button>
          
          <div className="mb-6 text-sm breadcrumbs">
            <ul className="flex flex-wrap gap-2 items-center">
              <li>
                <a href="/" className="text-gray-600 hover:text-black">
                  Accueil
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <span className="text-gray-600">L'univers Cadeaux</span>
              </li>
              {pathSegments.map((segment, index) => (
                <React.Fragment key={index}>
                  <li className="text-gray-400">/</li>
                  <li className={index === pathSegments.length - 1 ? "text-primary font-medium" : "text-gray-600"}>
                    {segment.split('-').join(' ')}
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>
        <ProductsSection />
      </div>
      <Footer />
    </div>
  );
};

export default GiftUniversePage;