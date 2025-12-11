import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';

export default function Logo_dark() {
  return (
    <div className="flex items-center justify-center">
      <span className={`${roboto.className} text-3xl font-semibold`}>
        <span className="bg-linear-to-r from-primary-700 to-background-600 bg-clip-text text-transparent">
          Family
        </span>
        <span className="bg-linear-to-r from-background-600 to-background-400 bg-clip-text text-transparent">
          Finance
        </span>
      </span>
    </div>
  );
}
