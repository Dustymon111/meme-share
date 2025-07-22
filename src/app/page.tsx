'use client';
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";
import { useAuthRedirectIfNoUsername } from "@/lib/hooks/userAuthRedirectIfNoUsername";

export default function Home() {
  useAuthRedirectIfNoUsername()
  return (
    <div className="text-3xl">
      Home Page
    </div>
  );
}
