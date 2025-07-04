import { SignUp, useUser } from "@clerk/clerk-react";

export default function SignUpPage() {
  const { isSignedIn, user } = useUser();

  const emailStatus = user?.emailAddresses?.[0]?.verification?.status;
  const needsVerification = isSignedIn && emailStatus !== "verified";

  if (needsVerification) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-lg">📧 please verify your email to continue.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </div>
  );
}
