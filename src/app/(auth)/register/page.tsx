import Link from "next/link";
import { RegisterForm } from "./ui/register-form";
import { LOGIN_URL } from "./lib/constants";

export default function Register() {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
      <RegisterForm />
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href={LOGIN_URL}
          className="text-indigo-600 hover:text-indigo-500"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
