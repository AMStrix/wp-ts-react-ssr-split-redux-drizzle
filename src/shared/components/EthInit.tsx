import React from 'react';
import { connect } from 'react-redux';
import { Steps, Icon } from 'antd';
const { Step } = Steps;
class EthInit extends React.Component<any> {
  render() {
    const {
      accounts,
      contracts,
      drizzleStatus: { initialized },
      web3: { status: web3Status, networkId },
    } = this.props.state;
    const networkStatus =
      networkId || ((!web3Status && 'waiting for web3...') || 'fetching...');
    const accountsStatus = (accounts[0] && accounts[0]) || 'waiting...';
    const contractsReady = Object.keys(contracts).length > 0;
    let step = 0;
    step = (networkId && 1) || step;
    step = (accounts[0] && 2) || step;
    step = (contractsReady && 3) || step;
    step = (initialized && 4) || step;
    return (
      <div>
        <Steps current={step} direction="vertical" size="small">
          <Step
            title="web3"
            description={(web3Status && 'initialized') || 'initializing...'}
          />
          <Step title="network id" description={networkStatus} />
          <Step title="account 0" description={accountsStatus} />
          <Step
            title="contracts"
            description={
              !contractsReady
                ? 'awaiting contracts...'
                : Object.keys(contracts).map(k => (
                    <div key={k}>
                      <b>{k}</b> <span>{Object.keys(contracts[k]).join(', ')}</span>
                    </div>
                  ))
            }
          />
          <Step
            title="drizzle"
            description={initialized ? 'ready!' : 'initializing...'}
            icon={<Icon type="smile-o" />}
          />
        </Steps>
      </div>
    );
  }
}
// this lookup will fail if compiled contract[networkId] is diff from actual web3 connected contract
// web3Contract = new web3.eth.Contract(contractArtifact.abi, contractArtifact.networks[networkId].address, {
const mapStateToProps = (state: any) => ({ state });
export default connect(mapStateToProps)(EthInit);
