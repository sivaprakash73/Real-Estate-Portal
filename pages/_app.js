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
        <title>PrimeNest — Real Estate Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Buy, sell and rent properties across South India. Verified listings, trusted agents, EMI calculator and more."
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
