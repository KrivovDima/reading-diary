"use client";

import { useActionState, useState } from "react";
import { RegisterAction, registerAction } from "../actions";
import {
  User,
  AlertCircle,
  Mail,
  EyeOff,
  Eye,
  CheckCircle,
  UserPlus,
  Lock,
} from "lucide-react";

export const RegisterForm = () => {
  const [state, action] = useActionState<RegisterAction, FormData>(
    registerAction,
    {},
  );

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="space-y-4">
      {/* Имя */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Имя
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="name"
            className={`input-field pl-12 ${state.error ? "border-red-300" : ""}`}
            placeholder="Ваше имя"
          />
        </div>
      </div>

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
            className={`input-field pl-12 ${state.error ? "border-red-300" : ""}`}
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
            className={`input-field pl-12 pr-12 ${state.error ? "border-red-300" : ""}`}
            placeholder="Минимум 6 символов"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Подтверждение пароля */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Подтвердите пароль
        </label>
        <div className="relative">
          <CheckCircle
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 `}
          />
          <input
            type="password"
            name="confirmPassword"
            className={`input-field pl-12 ${state.error ? "border-red-300" : ""}`}
            placeholder="Повторите пароль"
          />
        </div>
      </div>

      {state.error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {state.error}
        </p>
      )}

      <button type="submit" className="btn-primary mt-6">
        <UserPlus className="w-5 h-5" />
        Зарегистрироваться
      </button>
    </form>
  );
};
