import { AbstractBackground } from "@/components/3d/AbstractBackground";
import { AuthForm } from "@/components/auth/AuthForm";

export default function AuthenticationPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden">
      
      {/* Left Side - 3D Background */}
      <div className="relative w-full md:w-1/2 min-h-[40vh] md:min-h-screen z-0">
        <AbstractBackground />
      </div>

      {/* Right Side - Solid Gray Background with Glass Form */}
      <div className="relative z-10 w-full md:w-1/2 min-h-[60vh] md:min-h-screen flex items-center justify-center bg-[#C0C0C0]">
        <div className="w-full max-w-md p-6">
          <AuthForm />
        </div>
      </div>
    </main>
  );
}
