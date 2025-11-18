import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';

export default function Logo_dark() {
  return (
    <div className="flex items-center justify-center">
      <span className={`${roboto.className} text-3xl font-semibold`}>
        <span className="text-primary-700">Family</span>
        <span className="text-background-700">Finance</span>
      </span>
    </div>
  );
}
