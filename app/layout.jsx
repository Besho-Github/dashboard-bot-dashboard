import '../styles/globals.css';
import { DataProvider } from '../context';
import Layout from '../components/Layout';

export const metadata = {
  title: 'Wicks Bot',
  icons: {
    icon: 'https://i.imgur.com/whFWgyQ.png',
    apple: 'https://i.imgur.com/whFWgyQ.png',
  },
  description:
    "A highly adaptable bot featuring welcome images, detailed logs, social commands, moderation tools, and an array of other functionalities, all customizable to suit your server's needs",
  openGraph: {
    title: 'Wicks Bot',
    description:
      "A highly adaptable bot featuring welcome images, detailed logs, social commands, moderation tools, and an array of other functionalities, all customizable to suit your server's needs",
    url: 'https://wicks.bot/',
    type: 'website',
    images: [
      {
        url: 'https://i.imgur.com/whFWgyQ.png',
        alt: 'Wicks Bot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wicks Bot',
    description:
      "A highly adaptable bot featuring welcome images, detailed logs, social commands, moderation tools, and an array of other functionalities, all customizable to suit your server's needs",
    images: ['https://i.imgur.com/whFWgyQ.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DataProvider>
          <Layout>{children}</Layout>
        </DataProvider>
      </body>
    </html>
  );
}
