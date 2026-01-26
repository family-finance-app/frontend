import { roboto } from '@/assets/fonts/fonts';
import { RiQuestionLine } from '@remixicon/react';

interface NotFoundActionProps {
  header: string;
  text: string;
  actionElement: 'link' | 'button';
  action: {
    fn: () => void;
    label: string;
  };
}

export default function NotFoundAction({
  header,
  text,
  actionElement,
  action,
}: NotFoundActionProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 flex items-center justify-center mx-auto">
        <RiQuestionLine
          size={32}
          className="text-background-600 dark:text-background-100"
        />
      </div>
      <h3
        className={`${roboto.className} text-lg font-semibold text-background-700 mb-2`}
      >
        {header}
      </h3>
      <p className="text-background-700 mb-4">
        {text}{' '}
        {actionElement === 'button' && (
          <button
            className="text-background-600 hover:text-background-400 dark:text-background-700 dark:hover:text-background-100"
            onClick={action.fn}
          >
            {action.label}
          </button>
        )}
      </p>
    </div>
  );
}
