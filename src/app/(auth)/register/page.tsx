import Link from "next/link";
import { RegisterForm } from "./ui/register-form";
import { UserPlus } from "lucide-react";

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-morphism rounded-3xl p-8">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Присоединяйтесь!
            </h2>
            <p className="text-gray-600">
              Создайте аккаунт и начните вести дневник
            </p>
          </div>

          <RegisterForm />

          <p className="text-center text-gray-600 mt-8">
            Уже есть аккаунт?{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
