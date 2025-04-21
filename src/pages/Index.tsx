
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to auth page on initial load
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-safehaven-soft-purple to-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-safehaven-primary">SafeHaven</h1>
        <p className="text-xl text-safehaven-neutral-gray">Your digital shield for protection</p>
      </div>
    </div>
  );
};

export default Index;
