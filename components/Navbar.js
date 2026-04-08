'use client';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold hover:text-gray-300">
            📝 Notes App with AI
          </Link>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              Welcome, {user?.name || 'User'}!
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}