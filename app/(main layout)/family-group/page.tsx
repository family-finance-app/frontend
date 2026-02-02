export default function FamilyGroup() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-background-100 rounded-2xl shadow-lg p-8 border border-background-200">
          {/* Heading */}
          <h2 className="text-xl font-bold text-center text-primary-800 mb-3">
            Family Groups coming soon...
          </h2>

          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-1">
              <span className="text-sm text-background-700">
                - Create and manage family groups
              </span>
            </div>

            <div className="flex items-start gap-1">
              <span className="text-sm text-background-700">
                - Invite and manage family members
              </span>
            </div>

            <div className="flex items-start gap-1">
              <span className="text-sm text-background-700">
                - Share and track shared expenses
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
