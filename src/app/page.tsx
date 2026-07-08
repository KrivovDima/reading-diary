import Link from "next/link";
import {
  BookOpen,
  PlusCircle,
  TrendingUp,
  Clock,
  Target,
  Star,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const stats = [
    {
      value: "12",
      label: "Книг прочитано",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "3",
      label: "В процессе",
      icon: Clock,
      color: "from-amber-500 to-orange-500",
    },
    {
      value: "25",
      label: "В планах",
      icon: Target,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="text-center max-w-2xl mx-auto animate-fade-in">
        {/* Главная иконка */}
        <div className="mb-8 animate-float">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <BookOpen className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          <span className="gradient-text">Дневник чтения</span>
        </h1>

        {/* Подзаголовок */}
        <p className="text-lg sm:text-xl text-gray-600 mb-12 leading-relaxed">
          Отслеживайте свои книги, пишите рецензии и делитесь впечатлениями. Ваш
          персональный помощник в мире литературы.
        </p>

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/books"
            className="btn-primary inline-flex items-center gap-2 group"
          >
            <BookOpen className="w-5 h-5 transition-transform group-hover:scale-110" />
            Мои книги
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/books/add"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition-all duration-300 group"
          >
            <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90" />
            Добавить книгу
          </Link>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="glass-morphism rounded-2xl p-6 card-hover relative overflow-hidden group"
              >
                <div
                  className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${stat.color} opacity-10 rounded-bl-3xl transition-all duration-300 group-hover:scale-150`}
                />
                <Icon
                  className={`w-8 h-8 mb-3 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                />
                <div className="text-3xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-2">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
