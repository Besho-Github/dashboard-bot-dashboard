import React from 'react';
import { Sparkles } from 'lucide-react';
import { PlanCard } from './PlanCard';

const plans = [
  {
    nameKey: 'monthlyPlan',
    priceKey: 'monthlyPrice',
    durationKey: 'perMonth',
    popular: false,
    price: '$5.99',
  },
  {
    nameKey: 'threeMonthPlan',
    priceKey: 'threeMonthPrice',
    durationKey: 'perThreeMonths',
    popular: false,
    price: '$10.80',
  },
  {
    nameKey: 'sixMonthPlan',
    priceKey: 'sixMonthPrice',
    durationKey: 'perSixMonths',
    popular: true,
    price: '$21.60',
  },
  {
    nameKey: 'yearlyPlan',
    priceKey: 'yearlyPrice',
    durationKey: 'perYear',
    popular: false,
    price: '$32.40',
  },
];

export const PlanSelection = ({ locale, isRTL, showModal }) => {
  const getLocalizedPlan = (plan) => ({
    ...plan,
    name: locale.premium[plan.nameKey],
    price: plan.price,
    duration: locale.premium[plan.durationKey],
  });
  return (
    <div className="flex flex-col items-center px-5 mt-12">
      <div className="w-full fixed" dir="ltr">
        <div className="stars-small animate-pulse"></div>
        <div className="stars-big animate-spin-slow"></div>
      </div>
      <div className="relative flex items-center text-4xl font-bold text-center text-white mb-4">
        <Sparkles className="absolute -top-8 -left-8 text-amber-500" size={48} />
        <span className="relative z-10">{locale.premium.title}</span>
        <Sparkles className="absolute -bottom-8 -right-8 text-amber-500" size={48} />
      </div>
      <div className="mt-6 text-lg font-semibold text-center text-gray-300">{locale.premium.accessMoreFeatures}</div>
      <div className="flex flex-wrap justify-center gap-8 w-full mt-8">
        {plans.map((plan, index) => (
          <PlanCard key={index} plan={getLocalizedPlan(plan)} id={index} locale={locale} showModal={showModal} />
        ))}
      </div>
    </div>
  );
};
