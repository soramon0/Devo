import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { Layout } from 'antd'

const { Header, Footer, Content } = Layout

const Page = ({ pageTitle, children }) => (
  <Fragment>
    <Head>
      <meta charSet='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <meta httpEquiv='X-UA-Compatible' content='ie=edge' />
      <title>{pageTitle || 'Devo'}</title>
    </Head>
    <Layout>
      <Header
        style={{ textAlign: 'center', color: 'white', marginBottom: '2em' }}
      >
        Header
      </Header>
      <Content style={{ textAlign: 'center' }}>{children}</Content>
      <Footer style={{ textAlign: 'center' }}>
        Devo ©{new Date().getFullYear()} Created by Karim Laayoun
      </Footer>
    </Layout>
  </Fragment>
)

Page.propTypes = {
  pageTitle: PropTypes.string,
  children: PropTypes.object
}

export default Page
