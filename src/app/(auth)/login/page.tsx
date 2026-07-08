import Link from "next/link";
import { LoginForm } from "./ui/login-form";
import { LogIn } from "lucide-react";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-morphism rounded-3xl p-8">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              С возвращением!
            </h2>
            <p className="text-gray-600">Войдите в свой аккаунт</p>
          </div>

          {/* Форма */}
          <LoginForm />
          {/* Разделитель */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">или</span>
            </div>
          </div>

          {/* Ссылка на регистрацию */}
          <p className="text-center text-gray-600">
            Нет аккаунта?{" "}
            <Link
              href="/register"
              className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1"
            >
              Зарегистрироваться
              <LogIn className="w-4 h-4 rotate-180" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
