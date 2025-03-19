import { SignUp } from "@clerk/nextjs";

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [{ "sign-up": [] }];
}

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp />
    </div>
  );
}
