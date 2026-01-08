import { RiSearchLine } from '@remixicon/react';

interface SearchInputProps {
  value: string;
  setValue: (value: string) => void;
}

export default function SearchInput({ value, setValue }: SearchInputProps) {
  return (
    <div className="p-4 border-b border-background-100">
      <div className="relative">
        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-background-400 " />
        <input
          type="text"
          placeholder="Search accounts..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-background-50 dark:bg-background-100 border border-background-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
}
