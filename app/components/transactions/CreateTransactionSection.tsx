import { roboto } from '@/assets/fonts/fonts';
import CreateTransactionForm from '@/components/transactions/CreateTransactionForm';

interface CreateTransactionSectionProps {
  isVisible: boolean;
  onSuccess: (transactionId: number) => void;
  onCancel: () => void;
}

export default function CreateTransactionSection({
  isVisible,
  onSuccess,
  onCancel,
}: CreateTransactionSectionProps) {
  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6 animate-scale-in">
      <h3
        className={`${roboto.className} text-lg font-semibold mb-6 text-background-900`}
      >
        Add New Transaction
      </h3>
      <CreateTransactionForm onSuccess={onSuccess} onCancel={onCancel} />
    </div>
  );
}
