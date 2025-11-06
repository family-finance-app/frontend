export default function Reports() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-background-50 to-background-100">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-background-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-background-900 mb-3">
            Analytics Coming Soon
          </h2>

          {/* Features list */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-primary-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm text-background-700">
                Spending trends and visualizations
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-primary-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm text-background-700">
                Category breakdowns and comparisons
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-primary-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm text-background-700">
                Budget performance and forecasts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
