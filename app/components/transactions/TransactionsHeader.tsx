import { roboto } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button';

interface TransactionsHeaderProps {
  onAddClick: () => void;
}

export default function TransactionsHeader({
  onAddClick,
}: TransactionsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1
          className={`${roboto.className} text-2xl md:text-3xl font-bold text-background-900`}
        >
          My Transactions
        </h1>
        <p className="text-background-600 mt-1">
          Manage and track your personal transactions
        </p>
      </div>
      <div className="mt-4 md:mt-0">
        <Button text="Add Transaction" type="button" onClick={onAddClick} />
      </div>
    </div>
  );
}
