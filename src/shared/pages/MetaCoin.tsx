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

const initialState = { account: '', dataKey: '', sendCoinDK: '' };
type State = Readonly<typeof initialState>;

// tslint:disable-next-line:max-classes-per-file
class Interact extends React.Component<any> {
  readonly state: State = initialState;
  componentDidMount() {
    this.handleGetBalance();
  }
  componentDidUpdate(prevProps: any, prevState: State) {
    if (prevProps.state.accounts[0] !== this.props.state.accounts[0]) {
      this.handleGetBalance();
    }
  }
  handleGetBalance() {
    const account = this.props.state.accounts[0];
    const dataKey = this.props.drizzle.contracts.MetaCoin.methods.getBalance.cacheCall(
      account,
    );
    this.setState({ account, dataKey });
  }
  handleSendCoin(vals: any) {
    console.log('handleSendCoins', vals);
    const ammount = parseInt(vals.ammount, 10);
    const sendCoinDK = this.props.drizzle.contracts.MetaCoin.methods.sendCoin.cacheSend(
      vals.address,
      ammount,
    );
    this.setState({ sendCoinDK });
  }
  render() {
    console.log(this.props.drizzle.contracts.MetaCoin);
    const {
      // accounts,
      // contracts,
      drizzleStatus: { initialized },
    } = this.props.state;
    let getBalanceRes: string;
    if (!(this.state.dataKey in this.props.state.contracts.MetaCoin.getBalance)) {
      getBalanceRes = 'loading...';
    } else {
      getBalanceRes = this.props.state.contracts.MetaCoin.getBalance[this.state.dataKey]
        .value;
    }
    let sendCoinRes: string = 'inactive';
    if (this.state.sendCoinDK && this.props.state.contracts.MetaCoin.sendCoin) {
      if (!(this.state.sendCoinDK in this.props.state.contracts.MetaCoin.sendCoin)) {
        sendCoinRes = 'loading...';
      } else {
        sendCoinRes = this.props.state.contracts.MetaCoin.sendCoin[this.state.sendCoinDK]
          .value;
      }
    }
    if (!initialized) return <PageLoading message="Initializing..." />;
    return (
      <div>
        <div>
          active account: <b>{this.props.state.accounts[0]}</b>
        </div>
        <div>
          drizzle.contracts: {Object.keys(this.props.drizzle.contracts).join(', ')}
        </div>
        <div>dataKey: {this.state.dataKey}</div>
        <div>balance: {getBalanceRes}</div>
        <div>sendCoinDK: {this.state.sendCoinDK}</div>
        <div>sendCoinRes: {sendCoinRes}</div>
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
    const ammount = getFieldDecorator('ammount')(
      <Input placeholder="Amount" style={{ width: '6em' }} />,
    );
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item>{address}</Form.Item>
        <Form.Item>{ammount}</Form.Item>
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
