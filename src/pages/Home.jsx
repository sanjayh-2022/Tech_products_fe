import { useAuth } from '../context/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to TechStore</h1>
      <p className="text-xl text-gray-600 mb-8">
        Discover the latest in technology
      </p>
      <div className="max-w-2xl mx-auto">
        <p className="text-gray-600 mb-4">
          Browse our collection of premium electronics and gadgets.
          {!user && " Login to start shopping!"}
        </p>
      </div>
    </div>
  );
}

export default Home;