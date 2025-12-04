export default function FamilyGroup() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="bg-white dark:bg-background-100 rounded-2xl shadow-lg p-8 border border-background-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-primary-800 mb-3">
            Family Groups Coming Soon
          </h2>

          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary-700 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-primary-100"
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
                Create and manage family groups
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary-700 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-primary-100"
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
                Invite and manage family members
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary-700 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-primary-100"
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
                Share and track shared expenses
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
