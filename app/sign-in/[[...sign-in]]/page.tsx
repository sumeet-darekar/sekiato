import { SignIn } from "@clerk/nextjs";

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [{ "sign-in": [] }];
}

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  );
}
