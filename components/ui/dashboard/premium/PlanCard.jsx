import React from 'react';
import { Icon } from '@iconify/react';

export const PlanCard = ({ plan, locale, showModal, id }) => {
  const isRTL = locale.getLanguage() == 'ar';
  return (
    <div
      className={`lg:w-[232px] w-[300px] relative bg-[#1f2937] rounded-lg shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-2xl ${
        plan.popular ? 'border-2 border-blue-400' : ''
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div
          className={`absolute -top-3 ${isRTL ? 'right-4' : 'left-4'} bg-blue-500 text-white text-xs font-bold px-3 py-1 ${
            isRTL ? 'rounded-br-lg rounded-tl-lg' : 'rounded-bl-lg rounded-tr-lg'
          } shadow-md`}
        >
          {locale.premium.bestValue}
        </div>
      )}

      {/* Plan Details */}
      <div>
        <h3 className="text-xl font-semibold mb-2 text-white">{plan.name}</h3>
        <p className="text-3xl font-bold mb-1 text-blue-400">{plan.price}</p>
        <p className="text-gray-400 mb-4">{plan.duration}</p>
      </div>

      {/* Features List */}
      <ul className="mb-6 space-y-2">
        {[locale.premium.customBot, locale.premium.customerSupport, locale.premium.cancelAnytime].map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300">
            <Icon icon="simple-line-icons:check" className={`text-green-500 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Choose Plan Button */}
      <button
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        onClick={() => showModal(id)}
        aria-label={`${locale.premium.choosePlan} for ${plan.name}`}
      >
        {locale.premium.choosePlan}
      </button>
    </div>
  );
};
