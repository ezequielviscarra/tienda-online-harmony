// pages/_app.js

import { SessionProvider } from 'next-auth/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
    return (
    
        <SessionProvider session={pageProps.session}>
          <Layout>
            <Component {...pageProps} />
            </Layout>
        </SessionProvider>
       
    );
}

export default MyApp;