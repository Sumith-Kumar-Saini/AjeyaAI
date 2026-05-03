import Logo from "@/assets/logo.png";

const LoadingScreen = () => {
  return (
    <div className="w-full h-screen bg-background flex justify-center items-center">
      <img src={Logo} alt="Logo" className="size-12 animate-pulse" />
    </div>
  );
};

export default LoadingScreen;
