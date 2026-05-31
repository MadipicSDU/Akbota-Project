import { useState } from 'react';
import { Link } from 'react-router';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

type PlanType = 'freelancer' | 'company';

interface Plan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

const freelancerPlans: Plan[] = [
  {
    name: 'Basic',
    price: 5000,
    period: 'year',
    description: 'Essential features for getting started',
    features: [
      'Profile listing',
      'Apply to up to 10 projects per month',
      'Basic profile customization',
      'Email notifications',
      'Standard support',
    ],
    cta: 'Start Basic',
  },
  {
    name: 'Pro',
    price: 10000,
    period: 'year',
    description: 'Advanced tools for active freelancers',
    features: [
      'Everything in Basic',
      'Unlimited project applications',
      'Priority listing in search',
      'Portfolio showcase',
      'Advanced analytics',
      'Priority support',
    ],
    popular: true,
    cta: 'Start Pro',
  },
  {
    name: 'Premium',
    price: 20000,
    period: 'year',
    description: 'Full platform access for professionals',
    features: [
      'Everything in Pro',
      'Featured profile badge',
      'Direct client invitations',
      'Custom profile URL',
      'API access',
      'Dedicated account manager',
      'White-label proposals',
    ],
    cta: 'Start Premium',
  },
];

const companyPlans: Plan[] = [
  {
    name: 'Basic',
    price: 50000,
    period: 'year',
    description: 'Perfect for small teams and startups',
    features: [
      'Post up to 10 projects per month',
      'Access to all freelancers',
      'Basic candidate filtering',
      'Team collaboration (up to 3 members)',
      'Email support',
    ],
    cta: 'Start Basic',
  },
  {
    name: 'Pro',
    price: 100000,
    period: 'year',
    description: 'Built for growing businesses',
    features: [
      'Everything in Basic',
      'Unlimited project postings',
      'Advanced candidate matching',
      'Team collaboration (up to 10 members)',
      'Priority project visibility',
      'Dedicated account manager',
      'Custom workflows',
    ],
    popular: true,
    cta: 'Start Pro',
  },
  {
    name: 'Enterprise',
    price: 250000,
    period: 'year',
    description: 'Comprehensive solution for large organizations',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Custom integrations',
      'API access',
      'Advanced security features',
      'SLA guarantee',
      'White-label options',
      'Custom training & onboarding',
    ],
    cta: 'Contact Sales',
  },
];

export default function Pricing() {
  const [planType, setPlanType] = useState<PlanType>('freelancer');

  const plans = planType === 'freelancer' ? freelancerPlans : companyPlans;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Unlock the full potential of our platform with plans designed for your needs
          </p>
        </div>

        {/* Plan Type Toggle */}
        <div className="mt-12 flex justify-center">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex gap-1">
            <button
              onClick={() => setPlanType('freelancer')}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                planType === 'freelancer'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For Freelancers
            </button>
            <button
              onClick={() => setPlanType('company')}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                planType === 'company'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For Companies
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl border-2 transition-all hover:shadow-xl ${
                plan.popular
                  ? 'border-indigo-600 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-indigo-600 text-white border-0 px-4 py-1 gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600">KZT</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">per {plan.period}</p>
                </div>

                {/* CTA */}
                <Button
                  asChild
                  className={`w-full mb-8 ${
                    plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  size="lg"
                >
                  <Link to={plan.name === 'Enterprise' ? '/contact' : '/register'}>
                    {plan.cta}
                  </Link>
                </Button>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                      </div>
                      <span className="text-sm text-gray-700 leading-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Not sure which plan is right for you?
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
