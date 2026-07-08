import { auth } from "@/shared/lib/auth";
import { NavbarActions } from "./navbar-actions";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavbarActions userName={session?.user?.name ?? null} />
      </div>
    </nav>
  );
}
