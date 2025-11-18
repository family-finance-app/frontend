'use client';

import { useState, useEffect } from 'react';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';

export default function AnimatedProductPreview() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`mt-20 transition-all duration-1500 delay-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <div className="relative mx-auto max-w-5xl">
        <div className="bg-white rounded-2xl shadow-2xl border border-background-200 overflow-hidden">
          {/* Fake window header */}
          <div className="bg-linear-to-r from-primary-600 to-primary-700 p-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <div className="flex-1 text-center">
                <span
                  className={`${jetbrainsMono.className} text-white/80 text-xs md:text-sm`}
                >
                  /dashboard
                </span>
              </div>
            </div>
          </div>

          {/* Body – mini version of real dashboard layout */}
          <div className="p-6 md:p-8 bg-linear-to-br from-white to-background-50">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2
                  className={`${roboto.className} text-xl md:text-2xl font-bold text-background-900`}
                >
                  Personal Dashboard
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {['Week', 'Month', 'Year'].map((label, index) => {
                  const isActive = label === 'Month';
                  return (
                    <button
                      key={label}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'bg-background-100 text-background-600 hover:bg-background-200'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* First row: Balance (left) + Stats (right) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              {/* Balance Section (mini) */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-xl border border-background-200 p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-background-700 mb-2">
                    Total Balance
                  </h3>
                  <p
                    className={`${jetbrainsMono.className} text-2xl font-bold text-background-900 mb-4`}
                  >
                    285 129.50 UAH
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-background-500">
                        Personal Debit Card
                      </span>
                      <span
                        className={`${jetbrainsMono.className} text-background-800`}
                      >
                        52 819.50 UAH
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-background-500">Savings</span>
                      <span
                        className={`${jetbrainsMono.className} text-background-800`}
                      >
                        196 000.00 UAH
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-background-500">Cash</span>
                      <span
                        className={`${jetbrainsMono.className} text-background-800`}
                      >
                        36 310.00 UAH
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section (mini) */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-xl border border-background-200 p-4 shadow-sm h-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-success-50 border border-success-200 rounded-lg p-3">
                      <p className="text-xs text-success-700 font-medium mb-1">
                        Monthly Income
                      </p>
                      <p
                        className={`${jetbrainsMono.className} text-lg font-bold text-success-800`}
                      >
                        55 230.00 UAH
                      </p>
                      <p className="text-xs text-success-700 mt-1">
                        +2 300.00 vs last month
                      </p>
                    </div>
                    <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                      <p className="text-xs text-warning-700 font-medium mb-1">
                        Monthly Expenses
                      </p>
                      <p
                        className={`${jetbrainsMono.className} text-lg font-bold text-warning-800`}
                      >
                        2 410.50 UAH
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        -32 519.50 vs last month
                      </p>
                    </div>
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                      <p className="text-xs text-primary-700 font-medium mb-1">
                        Monthly Savings
                      </p>
                      <p
                        className={`${jetbrainsMono.className} text-lg font-bold text-primary-800`}
                      >
                        14 000.00
                      </p>
                      <p className="text-xs text-primary-700 mt-1">
                        <span className="font-semibold">26.3%</span> of income
                        this month
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second row: Transactions (left) + Expenses by Category (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Transactions mini table */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-background-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-background-900">
                      Recent Transactions
                    </h3>
                    <span className="text-xs text-primary-600 cursor-pointer">
                      View all
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        name: 'Lidl',
                        amount: '-1 000.00 UAH',
                        category: 'Grocery • Personal Debit Card • 6.11.2025',
                        positive: false,
                      },
                      {
                        name: 'October Salary',
                        amount: '+55 230.00 UAH',
                        category: 'Salary • Personal Debit Card • 5.11.2025',
                        positive: true,
                      },
                      {
                        name: 'Electricity Bill',
                        amount: '-890.50 UAH',
                        category: 'Utilities • Cash • 4.11.2025',
                        positive: false,
                      },
                      {
                        name: 'Cinema Night',
                        amount: '-520.00 UAH',
                        category: 'Entertainment • Cash • 4.11.2025',
                        positive: false,
                      },
                    ].map((tx, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 border-b border-background-50 last:border-b-0"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-background-900">
                            {tx.name}
                          </span>
                          <span className="text-xs text-background-500">
                            {tx.category}
                          </span>
                        </div>
                        <span
                          className={`${
                            jetbrainsMono.className
                          } text-sm font-semibold ${
                            tx.positive ? 'text-success-600' : 'text-red-600'
                          }`}
                        >
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-xl border border-background-200 p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-background-900 mb-3">
                    Monthly Spending by Category
                  </h3>
                  <div className="space-y-3 text-xs">
                    {[
                      {
                        label: 'Groceries',
                        color: 'bg-primary-400',
                        value: 41.5,
                      },
                      {
                        label: 'Utilities',
                        color: 'bg-warning-400',
                        value: 36.9,
                      },
                      {
                        label: 'Entertainment',
                        color: 'bg-background-400',
                        value: 21.6,
                      },
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${item.color}`}
                            />
                            <span className="text-background-600">
                              {item.label}
                            </span>
                          </div>
                          <span
                            className={`${jetbrainsMono.className} text-background-800`}
                          >
                            {item.value}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-background-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.color}`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
