import React from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, cartCount }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView(View.MENU)}>
            <div className="bg-rose-500 text-white p-2 rounded-lg mr-2 shadow-lg shadow-rose-200">
              <i className="fas fa-utensils"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent leading-none">
                CampusEats
              </span>
              <span className="text-[8px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5">
                Mini Project
              </span>
            </div>
          </div>

          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => setView(View.MENU)}
              className={`${currentView === View.MENU ? 'text-rose-600 font-semibold border-b-2 border-rose-500' : 'text-slate-600 hover:text-rose-500'} transition-all px-1 h-16 flex items-center`}
            >
              Menu
            </button>
            <button 
              onClick={() => setView(View.ORDERS)}
              className={`${currentView === View.ORDERS ? 'text-rose-600 font-semibold border-b-2 border-rose-500' : 'text-slate-600 hover:text-rose-500'} transition-all px-1 h-16 flex items-center`}
            >
              My Orders
            </button>
            <button 
              onClick={() => setView(View.AI_CHAT)}
              className={`${currentView === View.AI_CHAT ? 'text-rose-600 font-semibold border-b-2 border-rose-500' : 'text-slate-600 hover:text-rose-500'} transition-all px-1 h-16 flex items-center`}
            >
              Assistant
            </button>
            <button 
              onClick={() => setView(View.CONTACT)}
              className={`${currentView === View.CONTACT ? 'text-rose-600 font-semibold border-b-2 border-rose-500' : 'text-slate-600 hover:text-rose-500'} transition-all px-1 h-16 flex items-center`}
            >
              Project Info
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setView(View.CART)}
              className="relative p-2 text-slate-600 hover:text-rose-500 transition-colors"
            >
              <i className="fas fa-shopping-cart text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group hover:border-rose-200 transition-colors cursor-pointer">
              <i className="fas fa-user-graduate text-sm group-hover:text-rose-500"></i>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
