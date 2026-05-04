import { Button } from "@/components/ui/button";
import background from "@/assets/images/background.webp";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

const Hero = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate({ to: "/sign-in" });
  };

  return (
    <section className="relative w-full py-16 lg:py-24 overflow-hidden flex items-center min-h-150">
      {/* Background Image */}
      <img
        src={background}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover rounded-lg"
      />

      {/* Content Layer */}
      <div className="relative h-full z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col justify-end">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-semibold tracking-tight leading-tight text-white">
              Ajeya AI — Your AI Product Co-Pilot
            </h1>

            <p className="mt-6 text-muted-foreground max-w-md text-lg md:text-xl">
              Upload customer feedback, ask AI, get actionable feature ideas and
              roadmap suggestions.
            </p>

            <div className="flex">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="mt-8 rounded-sm h-12 px-8 text-base font-medium bg-foreground text-background hover:bg-foreground hover:text-background transition-colors cursor-pointer"
                >
                  Start for Free
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column (Empty for spacing balance) */}
          <div className="hidden lg:flex" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
