import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Helmet from 'react-helmet';

import DrizzleContext from '../DrizzleContext';
import GetMetaMask from '../components/GetMetaMask';
import PageLoading from '../components/PageLoading';
import { Input, Button, Form } from 'antd';

class MetaCoin extends React.Component<any> {
  render() {
    const {
      drizzleStatus: { initialized },
    } = this.props.state;
    // const web3Injected = typeof window !== 'undefined' && !!(window as any).web3;
    return (
      <div>
        <Helmet>
          <title>MetaCoin</title>
          <meta name="metacoin page" content="metacoin page stuff" />
        </Helmet>
        <div>
          {initialized ? (
            <DrizzleContext.Consumer>
              {drizzle => <Interact drizzle={drizzle} {...this.props} />}
            </DrizzleContext.Consumer>
          ) : (
            <GetMetaMask />
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state: any) => ({ state });
export default connect(mapStateToProps)(translate()(MetaCoin));

const initialState = { account: '', dataKey: '', sendCoinSID: -1, sendCoinStatus: '' };
type State = Readonly<typeof initialState>;

// tslint:disable-next-line:max-classes-per-file
class Interact extends React.Component<any> {
  readonly state: State = initialState;
  componentDidMount() {
    this.triggerGetBalance();
  }
  componentDidUpdate(prevProps: any, prevState: State) {
    if (prevProps.state.accounts[0] !== this.props.state.accounts[0]) {
      this.triggerGetBalance();
    }
  }
  triggerGetBalance() {
    const account = this.props.state.accounts[0];
    this.props.drizzle.contracts.MetaCoin.methods.getBalance.cacheCall(account);
  }
  handleSendCoin(vals: any) {
    const amount = parseInt(vals.amount, 10);
    this.props.drizzle.contracts.MetaCoin.methods.sendCoin.cacheSend(
      vals.address,
      amount,
      // note: important to set from address
      // otherwise MM will use the acct that initially sent,
      // even if subsequent sends happen after switching accts
      { from: this.props.state.accounts[0] },
    );
  }
  render() {
    const {
      status,
      account,
      balance,
      getting,
      sending,
      sendingAmount,
    } = this.props.state.metaCoin;
    if (status !== 'ready') return <PageLoading message="Initializing..." />;
    return (
      <div>
        <div>
          active account: <b>{account}</b>
        </div>
        <div>balance: {getting ? 'getting...' : balance}</div>
        <div>
          sendCoinStatus: {sending ? `Sending ${sendingAmount} coins...` : 'Idle...'}
        </div>
        <MCForm onSendCoins={(vals: any) => this.handleSendCoin(vals)} />
      </div>
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
class MCFormInner extends React.Component<any> {
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      this.props.onSendCoins(values);
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const address = getFieldDecorator('address')(
      <Input placeholder="Send to address 0x..." style={{ width: '28em' }} />,
    );
    const amount = getFieldDecorator('amount')(
      <Input placeholder="Amount" style={{ width: '6em' }} />,
    );
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item>{address}</Form.Item>
        <Form.Item>{amount}</Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Send
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
const MCForm = Form.create()(MCFormInner);
