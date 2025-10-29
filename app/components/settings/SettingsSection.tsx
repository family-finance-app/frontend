import Button from '@/components/ui/Button_financial';
import { roboto } from '@/assets/fonts/fonts';
import { SettingSection } from '@/utils/settings';
import SettingItem from './SettingItem';

interface SettingsSectionProps {
  section: SettingSection;
}

export default function SettingsSection({ section }: SettingsSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Section Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-lg">
            {section.icon}
          </div>
          <div>
            <h3
              className={`${roboto.className} text-lg font-semibold text-background-900`}
            >
              {section.title}
            </h3>
            <p className="text-sm text-background-600 mt-1">
              {section.description}
            </p>
          </div>
        </div>
      </div>

      {/* Section Items */}
      <div className="space-y-4 mb-6">
        {section.items.map((item, itemIndex) => (
          <SettingItem key={itemIndex} item={item} />
        ))}
      </div>

      {/* Primary Action */}
      {section.primaryAction && (
        <Button
          text={section.primaryAction.label}
          type="button"
          variant={section.primaryAction.variant || 'outline'}
          size="sm"
          onClick={section.primaryAction.action}
          className="w-full"
        />
      )}
    </div>
  );
}
