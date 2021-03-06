import React from 'react';
import Layout from '@icedesign/layout';
import Header from './components/Header';
import Aside from './components/Aside';
import Footer from './components/Footer';
import styles from './index.module.scss';

export default function UserLayout(props) {
	const { history } = props;
	if (!localStorage.getItem('X-CROSS-TOKEN')) {
		history.replace('/user/login');
	}
  return (
    <Layout fixable style={{ minHeight: '100vh' }} className={styles.iceLayout}>
      <Layout.Section>
        <Layout.Aside width={240}>
          <Aside />
        </Layout.Aside>

        <Layout.Main scrollable>
          <Layout.Header>
            <Header />
          </Layout.Header>
          <div className={styles.mainContainer}>{props.children}</div>
          <Footer />
        </Layout.Main>
      </Layout.Section>
    </Layout>
  );
}
