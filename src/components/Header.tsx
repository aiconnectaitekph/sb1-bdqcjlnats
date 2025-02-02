import React from 'react';
import { MessageCircle } from 'lucide-react';

const Header = () => (
  <div className="flex items-center justify-between p-4 border-b border-gray-800">
    <div className="flex items-center space-x-4">
      <h1 className="text-2xl font-bold">Supremo</h1>
    </div>
    <div className="flex items-center space-x-4">
      <MessageCircle className="w-6 h-6" />
      <button className="p-2">
        <span className="sr-only">Menu</span>
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  </div>
);