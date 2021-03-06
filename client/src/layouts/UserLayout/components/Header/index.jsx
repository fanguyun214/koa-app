import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Balloon, Icon, Nav } from '@alifd/next';
import FoundationSymbol from '@icedesign/foundation-symbol';
import IceImg from '@icedesign/img';
import { headerMenuConfig } from '@/menuConfig';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Logo from '../Logo';
import styles from './index.module.scss';

const USER_ONE = gql`
  query user {
    user {
      name
      email
      avatar
    }
  }
`;

function Header(props) {
  const { location = {}, history } = props;
  const { pathname } = location;

  const logout = () => {
    localStorage.clear('X-CROSS-TOKEN');
    history.replace('/user/login');
  };

  return (
    <div className={styles.headerContainer}>
      {/* <Logo isDark /> */}
      <p />
      <div className={styles.headerNavbar}>
        <Nav
          className={styles.headerNavbarMenu}
          selectedKeys={[pathname]}
          defaultSelectedKeys={[pathname]}
          direction="hoz"
        >
          {headerMenuConfig &&
            headerMenuConfig.length > 0 &&
            headerMenuConfig.map((nav, index) => {
              if (nav.children && nav.children.length > 0) {
                return (
                  <Nav.SubNav
                    triggerType="click"
                    key={index}
                    title={
                      <span>
                        {nav.icon ? (
                          <FoundationSymbol
                            style={{ marginRight: '8px' }}
                            size="small"
                            type={nav.icon}
                          />
                        ) : null}
                        <span>{nav.name}</span>
                      </span>
                    }
                  >
                    {nav.children.map(item => {
                      const linkProps = {};
                      if (item.external) {
                        if (item.newWindow) {
                          linkProps.target = '_blank';
                        }

                        linkProps.href = item.path;
                        return (
                          <Nav.Item key={item.path}>
                            <a {...linkProps}>
                              <span>{item.name}</span>
                            </a>
                          </Nav.Item>
                        );
                      }
                      linkProps.to = item.path;
                      return (
                        <Nav.Item key={item.path}>
                          <Link {...linkProps}>
                            <span>{item.name}</span>
                          </Link>
                        </Nav.Item>
                      );
                    })}
                  </Nav.SubNav>
                );
              }
              const linkProps = {};
              if (nav.external) {
                if (nav.newWindow) {
                  linkProps.target = '_blank';
                }
                linkProps.href = nav.path;
                return (
                  <Nav.Item key={nav.path}>
                    <a {...linkProps}>
                      <span>
                        {nav.icon ? (
                          <FoundationSymbol
                            style={{ marginRight: '8px' }}
                            size="small"
                            type={nav.icon}
                          />
                        ) : null}
                        {nav.name}
                      </span>
                    </a>
                  </Nav.Item>
                );
              }
              linkProps.to = nav.path;
              return (
                <Nav.Item key={nav.path}>
                  <Link {...linkProps}>
                    <span>
                      {nav.icon ? (
                        <FoundationSymbol
                          style={{ marginRight: '8px' }}
                          size="small"
                          type={nav.icon}
                        />
                      ) : null}
                      {nav.name}
                    </span>
                  </Link>
                </Nav.Item>
              );
            })}
        </Nav>
        <Query query={USER_ONE}>
          {({ loading, error, data: { user } }) => {
            if (loading) return <p style={{lineHeight: '20px'}}>Loading...</p>;
            if (error) return `Error! ${error.message}`;
            console.log(user);
            return (
              <Balloon
                triggerType="hover"
                trigger={
                  <div
                    className={styles.iceHeaderUserpannel}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 12,
                    }}
                  >
                    <IceImg
                      height={40}
                      width={40}
                      src={user && user.avatar}
                      className={styles.userAvatar}
                    />
                    <div className={styles.userProfile}>
                      <span
                        className={styles.userName}
                        style={{ fontSize: '13px' }}
                      >
                        {user && user.name}
                      </span>
                      {/* <br />
                <span className={styles.userDepartment}>技术部</span> */}
                    </div>
                    &nbsp;&nbsp;
                    <Icon
                      type="arrow-down"
                      size="xxs"
                      className={styles.iconDown}
                    />
                  </div>
                }
                closable={false}
                className={styles.userProfileMenu}
              >
                <ul>
                  <li className={styles.userProfileMenuItem} onClick={logout}>
                    退出登录
                  </li>
                  {/* <li className={styles.userProfileMenuItem}>
              <Link to="/setting/my">个人设置</Link>
            </li> */}
                </ul>
              </Balloon>
            );
          }}
        </Query>
      </div>
    </div>
  );
}

export default withRouter(Header);
