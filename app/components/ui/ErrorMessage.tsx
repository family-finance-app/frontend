import { RiCloseFill, RiErrorWarningFill } from '@remixicon/react';

interface ErrorMessageProps {
  message: string;
  classname?: string;
}

export default function ErrorMessage({
  message,
  classname,
}: ErrorMessageProps) {
  return (
    <div
      className={` ${
        classname ? classname : 'bg-warning-100 border-red-200'
      } mb-6 p-2 border rounded-lg flex items-center gap-3`}
    >
      <RiCloseFill className="text-danger-700" />
      <p className="text-sm font-medium text-danger-800">{message}</p>
    </div>
  );
}
