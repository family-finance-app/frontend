interface TransactionSuccessMessageProps {
  visible: boolean;
}

export default function TransactionSuccessMessage({
  visible,
}: TransactionSuccessMessageProps) {
  if (!visible) return null;

  return (
    <div className="bg-success-50 border border-success-200 rounded-xl p-4 animate-scale-in">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-success-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-success-800">
            Transaction created successfully!
          </p>
        </div>
      </div>
    </div>
  );
}
