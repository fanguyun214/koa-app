import React, { useState } from 'react';
import { Input, Grid, Message, Form } from '@alifd/next';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import styles from './style.module.scss';

const USER_LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      token
    }
  }
`;

const { Row } = Grid;
const Item = Form.Item;

@withRouter
export default function Index(props) {
  const [value, setValue] = useState({
    account: '',
    password: '',
    checkbox: false,
  });

  const formChange = value => {
    setValue(value);
  };

  const handleSubmit = (values, errors, addTodo) => {
    const { history } = props;
    if (errors) {
      console.log('errors', errors);
      return;
    }
    // console.log('values:', values);
    addTodo({
      variables: { email: values.email, password: values.password },
    }).then(res => {
      // 登录成功后做对应的逻辑处理
      const {
        login: { token },
      } = res.data;
      localStorage.setItem('X-CROSS-TOKEN', token);
      Message.success('登录成功！');
      history.push('/app/main');
    });
  };

  return (
    <div className={`${styles.container}`}>
      <div className={styles.header}>
        <a href="#" className={styles.meta}>
          <img
            className={styles.logo}
            src={require('./images/logo.png')}
            alt="logo"
          />
          <span className={styles.title}>Apollo</span>
        </a>
        <p className={styles.desc}>飞冰让前端开发简单而友好</p>
      </div>
      <div className={styles.formContainer}>
        <h4 className={styles.formTitle}>登 录</h4>
        <Mutation mutation={USER_LOGIN}>
          {login => (
            <Form value={value} onChange={formChange} size="large">
              <Item
                required
                requiredMessage="请输入邮箱"
                hasFeedback
                format="email"
                formatMessage="请输入正确的邮箱格式！"
              >
                <Input
                  name="email"
                  size="large"
                  maxLength={40}
                  placeholder="账号"
                />
              </Item>
              <Item
                required
                requiredMessage="请输入密码"
                hasFeedback
                minLength={6}
                maxLength={18}
                minmaxLengthMessage="密码长度为6-18位数字字符"
              >
                <Input
                  name="password"
                  size="large"
                  maxLength={18}
                  htmlType="password"
                  placeholder="密码"
                />
              </Item>

              <Row className={styles.formItem}>
                <Form.Submit
                  type="primary"
                  onClick={(values, errors) =>
                    handleSubmit(values, errors, login)
                  }
                  className={styles.submitBtn}
                  validate
                >
                  登 录
                </Form.Submit>
              </Row>
            </Form>
          )}
        </Mutation>
      </div>
    </div>
  );
}
