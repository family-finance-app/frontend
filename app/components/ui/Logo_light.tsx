import { roboto } from '@/assets/fonts/fonts';

interface LogoProps {
  responsive?: boolean;
  classname?: {
    size?: 'large' | 'medium' | 'small';
  };
}

export default function Logo_light({
  classname,
  responsive = false,
}: LogoProps) {
  const sizeClasses = responsive
    ? 'text-lg sm:text-xl md:text-2xl lg:text-2xl'
    : classname?.size === 'large'
    ? 'text-3xl'
    : classname?.size === 'medium'
    ? 'text-2xl'
    : classname?.size === 'small'
    ? 'text-xl'
    : 'text-3xl';

  return (
    <div className="flex items-center justify-center">
      <span className={`${roboto.className} ${sizeClasses} font-semibold`}>
        <span className="text-background-300">Family</span>
        <span className="text-background-100">Finance</span>
      </span>
    </div>
  );
}
