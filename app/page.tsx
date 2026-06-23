import { AbstractBackground } from "@/components/3d/AbstractBackground";
import { AuthForm } from "@/components/auth/AuthForm";

export default function AuthenticationPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden">
      
      {/* Left Side - 3D Background (Hidden on mobile) */}
      <div className="hidden md:block relative w-full md:w-1/2 min-h-screen z-0">
        <AbstractBackground />
      </div>

      {/* Right Side - Form with Rainbow Mesh Background */}
      <div className="relative z-10 w-full md:w-1/2 min-h-screen flex items-center justify-center bg-mesh">
        <div className="w-full max-w-md p-6">
          <AuthForm />
        </div>
      </div>
    </main>
  );
}
