import Link from 'next/link';
import Image from 'next/image';

export default function HomeButton() {
  return (
    <>
      <Link href="/" className="flex ml-2 md:mr-24">
        <Image
          src="icons/logo-icon.svg"
          className="h-8 mr-3"
          alt="FamilyFinance Logo"
          width={32}
          height={32}
        />
        <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
          FamilyFinance
        </span>
      </Link>
    </>
  );
}
