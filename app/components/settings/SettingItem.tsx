import { jetbrainsMono } from '@/assets/fonts/fonts';
import { SettingItem } from '@/utils/settings';

interface SettingItemProps {
  item: SettingItem;
}

export default function SettingItemComponent({ item }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-background-100 last:border-b-0">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-background-900 text-sm">
            {item.label}
          </span>
          <div className="flex items-center space-x-3">
            {item.type === 'display' && (
              <span
                className={`${jetbrainsMono.className} text-sm text-background-600`}
              >
                {item.value}
              </span>
            )}

            {item.type === 'action' && (
              <>
                <span
                  className={`${jetbrainsMono.className} text-sm text-background-600`}
                >
                  {item.value}
                </span>
                {item.actionLabel && (
                  <button
                    onClick={item.action}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                  >
                    {item.actionLabel}
                  </button>
                )}
              </>
            )}

            {item.type === 'toggle' && (
              <button
                onClick={item.action}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  item.enabled ? 'bg-primary-600' : 'bg-background-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    item.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            )}

            {item.type === 'select' && (
              <select className="text-sm border border-background-300 rounded-lg px-3 py-1 text-background-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                {item.options?.map((option: string, optionIndex: number) => (
                  <option
                    key={optionIndex}
                    value={option}
                    selected={option === item.value}
                  >
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        {item.description && (
          <p className="text-xs text-background-500 mt-1">{item.description}</p>
        )}
      </div>
    </div>
  );
}
