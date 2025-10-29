import Button from '@/components/ui/Button_financial';
import { roboto } from '@/assets/fonts/fonts';

interface DangerZoneProps {
  onDeleteAccount: () => void;
}

export default function DangerZone({ onDeleteAccount }: DangerZoneProps) {
  return (
    <div className="bg-brown-50 border border-brown-200 rounded-2xl p-6">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-brown-100 rounded-xl flex items-center justify-center">
          <svg
            className="w-5 h-5 text-brown-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3
            className={`${roboto.className} text-lg font-semibold text-brown-900 mb-2`}
          >
            Danger Zone
          </h3>
          <p className="text-sm text-brown-700 mb-4">
            Irreversible actions that will permanently affect your account and
            all associated data.
          </p>
          <Button
            text="Delete Account"
            type="button"
            variant="brown"
            size="sm"
            onClick={onDeleteAccount}
          />
        </div>
      </div>
    </div>
  );
}
