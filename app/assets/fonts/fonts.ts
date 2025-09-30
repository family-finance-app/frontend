import { Poppins } from 'next/font/google';

export const poppins = Poppins({
  weight: ['200', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// here it is possible to add other fonts and use it on separate elemets, for example:
// import { Poppins, Lusitana } from 'next/font/google';
// export const lusitana = Lusitana({
//   weight: ['400', '700'],
//   subsets: ['latin'],
// });

// pass it to any element, and use this way:
// import {lusitana} from '@app/ui/fonts.ts'
// <p className={lusitana.className} text-xl>Some text</p>
