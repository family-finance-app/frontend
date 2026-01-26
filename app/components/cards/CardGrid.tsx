import { FinancialCard, type FinancialCardProps } from './index';

interface CardGridProps {
  data: (FinancialCardProps & { section?: string })[];
  classname?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onClickAction?: (section: string) => void;
  activeSection?: string;
}

export default function CardGrid({
  data,
  classname,
  size,
  onClickAction,
  activeSection,
}: CardGridProps) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
      {onClickAction
        ? data.map((cardData, index) => (
            <button
              key={cardData.title}
              onClick={() =>
                cardData.section && onClickAction(cardData.section)
              }
              className={`text-left transition-all ${
                activeSection === cardData.section
                  ? 'ring-2 ring-primary-300 dark:ring-primary-600 rounded-2xl'
                  : 'hover:ring-2 hover:ring-primary-200 dark:hover:ring-primary-700 hover:rounded-2xl'
              }`}
            >
              <FinancialCard
                key={cardData.title || index}
                {...cardData}
                className={classname}
                size={size}
              />
            </button>
          ))
        : data.map((cardData, index) => (
            <FinancialCard
              key={cardData.title || index}
              {...cardData}
              className={classname}
              size={size}
            />
          ))}
    </section>
  );
}
