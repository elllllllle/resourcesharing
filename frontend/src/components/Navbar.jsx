import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border border-b-[#E0E0E0] p-4 flex justify-between items-center">
      <Link to="/" className="text-[#89D440] text-2xl font-bold">ShareMate</Link>
      <div>
        {user ? (
          <>
            <Link to="/resources" className="mr-4">Find Resources</Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-[#F54949] text-white px-4 py-2 rounded-full hover:bg-[#D84040]"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-[#89D440] text-white px-4 py-2 rounded-full hover:bg-[#66BF0F]"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
