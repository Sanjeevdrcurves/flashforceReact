import { KeenIcon } from "@/components";

const AddOnShowcase = () => {
  const reviews = [
    {
      avatar: "/media/avatars/avatar1.jpg",
      name: "Екатерина Лужецкая",
      date: "месяц назад",
      rating: 5,
      comment:
        "Заказывала у ребят разработку интернет-магазина. Магазин сделали под ключ с базовыми настройками для SEO. Рекомендую, цена, качество и коммуникация на 100%.",
    },
    {
      avatar: "/media/avatars/avatar2.jpg",
      name: "Armen Sargsyan",
      date: "6 дней назад",
      rating: 5,
      comment:
        "Пишу отзыв спустя 4 месяца после сдачи проекта. Всё работает стабильно. Сотрудничаем дальше.",
    },
  ];

  return (
    <div className="p-8 bg-white rounded-lg shadow-md mt-10 w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Add-On Showcase</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <KeenIcon icon="close" className="text-2xl" />
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section */}
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Advanced Analytics Pro
          </h3>
          <p className="text-sm text-gray-600">Developer name</p>
          <p className="text-sm text-gray-700 mt-4">
            Transform your CRM with powerful analytics and insights
          </p>

          {/* Add-On Details Section */}
          <div className="flex items-center gap-6 p-4 bg-white  mt-6">
            {/* Logo */}
            <img
              src="https://dummyimage.com/80x80/000/fff"
              alt="Add-On Logo"
              className="w-16 h-16 rounded-lg"
            />

            {/* Details */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-800">5.0</span>
                <KeenIcon icon="star" className="text-yellow-500" />
              </div>
              <p className="text-xs text-gray-600">150 thousand ratings</p>
            </div>

            {/* Divider */}
            <div className="border-l border-gray-300 h-12"></div>

            {/* Downloads */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-gray-800">5 mi+</span>
              <span className="text-xs text-gray-600">Downloads</span>
            </div>

            {/* Divider */}
            <div className="border-l border-gray-300 h-12"></div>

            {/* Monthly Cost */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-gray-800">$25</span>
              <span className="text-xs text-gray-600">Monthly</span>
            </div>

            {/* Divider */}
            <div className="border-l border-gray-300 h-12"></div>

            {/* Users */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-gray-800">30</span>
              <span className="text-xs text-gray-600">Number Users</span>
            </div>
          </div>

          <button className="btn btn-sm btn-primary mt-10 w-40 p-5 flex justify-center items-center">
            Activate Add-On
          </button>
        </div>

        {/* Right Section */}
        <div className="flex justify-center items-center">
          <img
            src="https://dummyimage.com/600x400/000/fff"
            alt="Dashboard Preview"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Divider */}
      <hr className="my-8 border-gray-200" />

      {/* Reviews Section */}
      <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {reviews.map((review, index) => (
    <div
      key={index}
      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg"
    >
      <img
        src={"https://dummyimage.com/80x80/000/fff"}
        alt={review.name}
        className="w-12 h-12 rounded-full"
      />
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-gray-900">
            {review.name}
          </h4>
          <span className="text-xs text-gray-500">{review.date}</span>
        </div>
        <div className="flex items-center text-yellow-400 mb-2">
          {"★".repeat(review.rating)}
          {"☆".repeat(5 - review.rating)}
        </div>
        <p className="text-sm text-gray-600">{review.comment}</p>
      </div>
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export { AddOnShowcase };
