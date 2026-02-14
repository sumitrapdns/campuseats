import React, { useState, useEffect, useCallback } from 'react';
import { View, FoodItem, CartItem, Order, DeliveryLocation } from './types';
import { FOOD_MENU } from './constants';
import Navbar from './components/Navbar';
import FoodGrid from './components/FoodGrid';
import AIChat from './components/AIChat';
import Contact from './components/Contact';
import { getAIRecommendations, analyzeDeliveryLocation } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.MENU);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mood, setMood] = useState('');
  const [aiRecs, setAiRecs] = useState<{ foodId: string; reason: string }[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  
  // Project Attribution Details
  const developerName = "Sumitra P"; 
  const rollNumber = "23E2519";
  const collegeName = "D.G. Vaishnav College";

  const addToCart = useCallback((item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const [location, setLocation] = useState<DeliveryLocation>({ address: '' });
  const [detectingLocation, setDetectingLocation] = useState(false);

  const handleDetectLocation = () => {
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const insight = await analyzeDeliveryLocation(latitude, longitude);
          setLocation({
            address: `Detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            lat: latitude,
            lng: longitude,
            insight: insight
          });
        } catch (e) {
          setLocation({ address: 'Campus Central Plaza' });
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setDetectingLocation(false);
        setLocation({ address: 'Manual Entry Required' });
      }
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!location.address) {
      alert("Please specify a delivery location first!");
      return;
    }
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items: [...cart],
      total: cartTotal,
      status: 'Preparing',
      timestamp: Date.now(),
      location: { ...location }
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setView(View.ORDERS);
  };

  const handleMoodAnalysis = async () => {
    if (!mood.trim()) return;
    setLoadingRecs(true);
    try {
      const recs = await getAIRecommendations(mood, FOOD_MENU);
      setAiRecs(recs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRecs(false);
    }
  };

  const renderView = () => {
    switch (view) {
      case View.MENU:
        return (
          <div className="space-y-12">
            <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden relative">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                  CampusEats Concierge
                </h2>
                <p className="mb-6 text-white/80">State your mood, and our custom logic will find the perfect meal for you.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    placeholder="e.g. 'Stressed from finals, need comfort food'"
                    className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button 
                    onClick={handleMoodAnalysis}
                    disabled={loadingRecs}
                    className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {loadingRecs ? <i className="fas fa-spinner fa-spin"></i> : 'Analyze Now'}
                  </button>
                </div>
              </div>
              {aiRecs.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                  {aiRecs.map(rec => {
                    const item = FOOD_MENU.find(f => f.id === rec.foodId);
                    if (!item) return null;
                    return (
                      <div key={rec.foodId} className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center space-x-4">
                        <img src={item.image} className="w-20 h-20 rounded-xl object-cover" />
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{item.name}</h4>
                          <p className="text-xs text-white/70 italic mb-2">"{rec.reason}"</p>
                          <button onClick={() => addToCart(item)} className="text-xs bg-white text-rose-600 px-3 py-1 rounded-full font-bold">Quick Add</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
            <FoodGrid items={FOOD_MENU} addToCart={addToCart} />
          </div>
        );
      case View.CART:
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center">
              <i className="fas fa-shopping-basket mr-3 text-rose-500"></i>
              Your Shopping Cart
            </h2>
            {cart.length === 0 ? (
              <div className="text-center bg-white rounded-3xl p-16 border-2 border-dashed border-slate-200">
                <i className="fas fa-shopping-cart text-7xl text-slate-200 mb-6"></i>
                <h3 className="text-2xl font-bold text-slate-700">Cart is empty</h3>
                <button onClick={() => setView(View.MENU)} className="mt-8 bg-rose-500 text-white font-bold px-8 py-3 rounded-2xl hover:bg-rose-600">Go to Menu</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <img src={item.image} className="w-20 h-20 rounded-xl object-cover" />
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{item.name}</h4>
                          <p className="text-rose-600 font-bold text-sm">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                          <button onClick={() => updateCartQuantity(item.id, -1)} className="text-slate-500 hover:text-rose-500 p-1"><i className="fas fa-minus text-xs"></i></button>
                          <span className="font-bold text-slate-800 w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, 1)} className="text-slate-500 hover:text-rose-500 p-1"><i className="fas fa-plus text-xs"></i></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                      <i className="fas fa-map-marked-alt mr-2 text-rose-500"></i>
                      Delivery Location
                    </h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="Enter delivery address or room number"
                          value={location.address}
                          onChange={(e) => setLocation({...location, address: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                        <button 
                          onClick={handleDetectLocation}
                          disabled={detectingLocation}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100 transition-all disabled:opacity-50"
                        >
                          {detectingLocation ? <i className="fas fa-spinner fa-spin mr-1"></i> : <i className="fas fa-location-arrow mr-1"></i>}
                          Smart Detect
                        </button>
                      </div>
                      {location.insight && (
                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start space-x-3">
                          <i className="fas fa-lightbulb text-indigo-500 mt-1"></i>
                          <div>
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Location Analysis</span>
                            <p className="text-sm text-indigo-800 italic">{location.insight}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl h-fit sticky top-24">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-slate-600"><span>Delivery</span><span className="text-emerald-500 font-medium">Free</span></div>
                    <div className="h-px bg-slate-100 my-4"></div>
                    <div className="flex justify-between text-xl font-black text-slate-900"><span>Total</span><span>${(cartTotal * 1.05).toFixed(2)}</span></div>
                  </div>
                  <button onClick={handleCheckout} className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case View.ORDERS:
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-slate-800 mb-8">My Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <i className="fas fa-history text-5xl text-slate-200 mb-4"></i>
                <p className="text-slate-500">No recent orders found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                    <div className="bg-slate-50 p-4 flex justify-between items-center border-b border-slate-100">
                      <div>
                        <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Order ID</span>
                        <span className="font-bold text-slate-700">#{order.id}</span>
                      </div>
                      <div className="text-right flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Location</span>
                          <span className="text-xs font-medium text-slate-600 truncate max-w-[150px] inline-block">{order.location.address}</span>
                        </div>
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">{order.status}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
                          <span className="text-slate-600">{item.name} <span className="text-slate-300 ml-2">x{item.quantity}</span></span>
                          <span className="text-slate-800 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-50">
                        <span className="text-xs text-slate-400 italic">Placed on {new Date(order.timestamp).toLocaleString()}</span>
                        <span className="text-lg font-black text-slate-900">Total: ${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case View.AI_CHAT:
        return <AIChat />;
      case View.CONTACT:
        return <Contact />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar currentView={view} setView={setView} cartCount={cartCount} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
      
      {/* PROFESSIONAL FOOTER WITH DEVELOPER DETAILS */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-rose-500 text-white p-2 rounded-lg mr-2"><i className="fas fa-utensils"></i></div>
                <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">CampusEats</span>
              </div>
              <p className="text-slate-500 max-w-xs mb-6">Designed and implemented for excellence in food delivery experiences on campus.</p>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 inline-block">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Project Developer</h4>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center mr-3 font-bold">
                    {developerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 leading-none">{developerName}</p>
                    <p className="text-xs text-slate-500 mt-1">Roll No: {rollNumber}</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 italic">{collegeName}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 mb-4">Navigation</h4>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li><button onClick={() => setView(View.MENU)} className="hover:text-rose-500 transition-colors">Food Menu</button></li>
                <li><button onClick={() => setView(View.AI_CHAT)} className="hover:text-rose-500 transition-colors">Smart Assistant</button></li>
                <li><button onClick={() => setView(View.CONTACT)} className="hover:text-rose-500 transition-colors">Project Info</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 mb-4">Course Info</h4>
              <p className="text-sm text-slate-600 mb-2">BCA Mini Project</p>
              <p className="text-xs text-slate-500 leading-relaxed">Submitted as part of partial fulfillment for IIIrd BCA 'A'. All source code is original and developed for academic evaluation.</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 text-center text-slate-400 text-[10px] tracking-widest uppercase font-bold">
            &copy; {new Date().getFullYear()} {developerName} - Academic Submission
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
