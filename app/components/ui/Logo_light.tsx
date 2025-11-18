import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';

export default function Logo_light() {
  return (
    <div className="flex items-center justify-center">
      <span className={`${roboto.className} text-3xl font-semibold`}>
        <span className="text-background-300">Family</span>
        <span className="text-background-100">Finance</span>
      </span>
    </div>
  );
}
