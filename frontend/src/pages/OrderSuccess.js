import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Heart } from 'lucide-react';
import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const OrderSuccess = () => {
    const location = useLocation();
    const { clearCart } = useCart();
    const orderId = location.state?.orderId || 'HG-NEW-ORDER';

    useEffect(() => {
        if (location.state?.orderId) {
            // Delay clearCart slightly to ensure navigation is complete and smooth
            const timer = setTimeout(() => {
                clearCart();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [clearCart, location.state?.orderId]);
    
  return (
    <div className="bg-cream min-h-screen flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-peach-50 max-w-xl w-full relative overflow-hidden">
        {/* Decorative backdrop */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-peach-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-peach-50 rounded-full opacity-50"></div>

        <div className="relative z-10">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 shadow-inner">
                <CheckCircle size={56} />
            </div>
            
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 font-serif tracking-tight">Order Placed Successfully!</h1>
            <p className="text-xl text-gray-600 mb-8 font-medium">
                Yum! Your food will reach you in <span className="text-warmOrange font-bold">35 mins</span>.
            </p>
            
            <div className="bg-peach-50 p-6 rounded-2xl mb-4 border border-peach-100">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Order ID</p>
                <p className="text-2xl font-black text-warmOrange uppercase tracking-tighter">#{orderId.slice(-8)}</p>
            </div>
            
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 flex items-center justify-center gap-2">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
               Secure Handover PIN will be available in tracking
            </p>

            <div className="space-y-4 relative z-20">
                <Link 
                    to={`/order/${orderId}`}
                    className="w-full bg-warmOrange hover:bg-peach-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-3 text-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Package size={20} />
                    <span>Track Your Order</span>
                </Link>
                
                <Link 
                    to="/" 
                    className="w-full bg-white text-gray-700 font-bold py-4 rounded-2xl border-2 border-gray-100 hover:border-warmOrange hover:text-warmOrange transition-all flex items-center justify-center space-x-3 text-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <span>Back to Home</span>
                    <ArrowRight size={20} />
                </Link>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-2 text-gray-400">
                <Heart size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Happy Eating!</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
