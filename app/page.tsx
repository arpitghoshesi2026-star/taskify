import { AbstractBackground } from "@/components/3d/AbstractBackground";
import { AuthForm } from "@/components/auth/AuthForm";

export default function AuthenticationPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col lg:flex-row bg-background overflow-hidden">
      
      {/* Left Side - 3D Background (Hidden on mobile and tablets) */}
      <div className="hidden lg:block relative w-full lg:w-1/2 min-h-screen z-0">
        <AbstractBackground />
      </div>

      {/* Right Side - Form with subtle background */}
      <div className="relative z-10 w-full lg:w-1/2 min-h-screen flex items-center justify-center bg-gray-100/50 dark:bg-black/50">
        <div className="w-full max-w-md p-6">
          <AuthForm />
        </div>
      </div>
    </main>
  );
}
