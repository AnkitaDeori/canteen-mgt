import React from 'react';
import { CheckCircle, Clock, CookingPot } from 'lucide-react';
import { OrderStatus } from '../types';

interface StatusTrackerProps {
  status: OrderStatus;
}

const StatusTracker: React.FC<StatusTrackerProps> = ({ status }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'pending' || status === 'preparing' || status === 'ready' ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}>
            <Clock className="h-5 w-5" />
          </div>
          <span className="mt-2 text-sm font-medium">Pending</span>
        </div>
        
        <div className={`flex-1 h-1 mx-2 ${status === 'preparing' || status === 'ready' ? 'bg-amber-500' : 'bg-gray-200'}`} />
        
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'preparing' || status === 'ready' ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}>
            <CookingPot className="h-5 w-5" />
          </div>
          <span className="mt-2 text-sm font-medium">Preparing</span>
        </div>
        
        <div className={`flex-1 h-1 mx-2 ${status === 'ready' ? 'bg-amber-500' : 'bg-gray-200'}`} />
        
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'ready' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
            <CheckCircle className="h-5 w-5" />
          </div>
          <span className="mt-2 text-sm font-medium">Ready</span>
        </div>
      </div>
    </div>
  );
};

export default StatusTracker;