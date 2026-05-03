import { SignupForm } from "@/components/signup-form";
import { createLazyFileRoute } from "@tanstack/react-router";
import Logo from "@/assets/logo.png";
import { signup } from "@/lib/api-endpoints";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(non-public)/sign-up/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await signup(name, email, password);

      toast.success("Account created successfully 🎉");

      // optional redirect
      navigate({ to: "/dashboard" });
      
    } catch (error: unknown) {
      console.error(error);

      toast.error(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        error?.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <img src={Logo} alt="Ajeya Logo" />
            </div>
            Ajeya AI.
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm onSubmit={handleSubmit} disabled={loading} />
          </div>
        </div>
      </div>

      <div className="relative hidden bg-muted lg:block">
        <img
          src={Logo}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
