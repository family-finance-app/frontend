import { RiCheckFill } from '@remixicon/react';

interface SuccessMessageProps {
  message: string;
  classname?: string;
}

export default function SuccessMessage({
  message,
  classname,
}: SuccessMessageProps) {
  return (
    <div
      className={`${
        classname ? classname : ''
      } rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top`}
    >
      <div className="shrink-0">
        <RiCheckFill className="text-success-700" />
      </div>
      <div>
        <p className="text-sm font-medium text-primary-700">{message}</p>
      </div>
    </div>
  );
}
