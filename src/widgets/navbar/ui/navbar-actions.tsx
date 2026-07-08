"use client";

import {
  BookOpen,
  ChevronDown,
  Library,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "../actions";

const navLinks = [
  { href: "/books", label: "Мои книги", icon: Library },
  { href: "/books/add", label: "Добавить", icon: PlusCircle },
];

type NavbarActionsProps = { userName: string | null };

export const NavbarActions = ({ userName }: NavbarActionsProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center justify-between h-16">
        {/* Логотип */}
        <Link href="/" className="flex items-center space-x-2 group">
          <BookOpen className="w-8 h-8 text-indigo-600 transition-transform group-hover:scale-110" />
          <span className="text-xl font-bold gradient-text hidden sm:block">
            Дневник чтения
          </span>
        </Link>

        {/* Десктопная навигация */}
        {userName && (
          <>
            <div className="hidden md:flex items-center space-x-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}

              {/* Выпадающее меню пользователя */}
              <div className="relative ml-4">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg transition-all duration-200 group"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Выпадающее меню */}
                {isUserMenuOpen && (
                  <>
                    {/* Оверлей для закрытия по клику вне меню */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-slide-down">
                      {/* Информация о пользователе */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {userName}
                        </p>
                      </div>

                      {/* Ссылки */}
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Настройки профиля
                      </Link>

                      {/* Разделитель */}
                      <div className="border-t border-gray-100 my-2" />

                      {/* Кнопка выхода */}
                      <button
                        onClick={logoutAction}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Выйти
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Мобильное меню */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Мобильное выпадающее меню */}
      {isMenuOpen && userName && (
        <div className="md:hidden pb-4 animate-slide-down">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mt-2 transition-all ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}

          {/* Профиль в мобильном меню */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <Link
              href="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
            >
              <User className="w-5 h-5" />
              Профиль
            </Link>

            <Link
              href="/profile/settings"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
            >
              <Settings className="w-5 h-5" />
              Настройки
            </Link>

            <button
              onClick={logoutAction}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all w-full mt-2"
            >
              <LogOut className="w-5 h-5" />
              Выйти из аккаунта
            </button>
          </div>
        </div>
      )}
    </>
  );
};
