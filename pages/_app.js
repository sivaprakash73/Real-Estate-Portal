import { useEffect } from 'react';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'leaflet/dist/leaflet.css';
import '@/styles/globals.css';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Bootstrap JS (dropdowns, collapse, modals) is browser-only
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <>
      <Head>
        <title>Vetrivelan Realty | Properties made simple</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Vetrivelan Realty helps you explore property listings, arrange visits and make informed real-estate decisions."
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
