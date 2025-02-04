import { SignupForm } from "@/components/forms/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <section className="max-w-md w-full">
        <SignupForm />
      </section>
    </div>
  );
}
