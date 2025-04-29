import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Coffee, KeyRound } from 'lucide-react';

const Login: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (studentId.trim()) {
      login(studentId, isAdmin);
      navigate(isAdmin ? '/admin/dashboard' : '/menu');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <Coffee className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Campus Canteen</h1>
          <p className="text-gray-600 mt-2">Delicious food, delivered fast.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
              College ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="studentId"
                className="input pl-10"
                placeholder="Enter your College ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
              <KeyRound className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="isAdmin"
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">
              Login as Admin
            </label>
          </div>
          
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Just enter any ID to continue. This is a demo app.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;