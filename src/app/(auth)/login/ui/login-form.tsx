"use client";

import { useActionState, useState } from "react";
import { loginAction, LoginActionState } from "../actions";
import { LogIn, Mail, Lock, EyeOff, Eye, AlertCircle } from "lucide-react";

export const LoginForm = () => {
  const [state, action] = useActionState<LoginActionState, FormData>(
    loginAction,
    undefined,
  );

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="space-y-5">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            className={`input-field pl-12 ${state?.error ? "border-red-300 focus:border-red-500 focus:shadow-red-100" : ""}`}
            placeholder="your@email.com"
          />
        </div>
      </div>

      {/* Пароль */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Пароль
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className={`input-field pl-12 pr-12 ${state?.error ? "border-red-300 focus:border-red-500 focus:shadow-red-100" : ""}`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {state?.error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {state.error}
        </p>
      )}

      {/* Запомнить меня */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-600">Запомнить меня</span>
        </label>
        <button
          type="button"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Забыли пароль?
        </button>
      </div>

      {/* Кнопка входа */}
      <button type="submit" className="btn-primary">
        <LogIn className="w-5 h-5" />
        Войти
      </button>
    </form>
  );
};
