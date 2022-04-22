import React from 'react';
import { useContractKit } from '@celo-tools/use-contractkit';
import { newKit, StableToken } from '@celo/contractkit';
import '@celo-tools/use-contractkit/lib/styles.css';
import { ABI, ContractAddress } from '../../pages/Constants';
import { debounce } from 'lodash';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const URL = 'https://alfajores-forno.celo-testnet.org';
export function Home() {

    const [walletAddress, setWalletAddress] = React.useState();
    const [contract, setContract] = React.useState();
    const { address, connect, kit, destroy, account, network } = useContractKit();


    const initContract = async () => {
        const contract = new kit.web3.eth.Contract(ABI as any, ContractAddress);
        setContract(contract);
    };

    React.useEffect(() => { initContract(); }, [address]);

    const resolveName = React.useCallback(async (name) => {

        try {

            const result = await contract.methods.showNameForWallet(name).call();
            setWalletAddress(result);
            console.log(result);
            return result;
        } catch (error) {
            throw error;
        }
        // const result1 = await contract.methods.addNameForWallet('testab').call();


        // const account = kit.web3.eth.accounts.create();
        // const address = account.address;
        // const secret = account.privateKey;

    }, [contract]);


    const sendCurrency = React.useCallback(async (recepient, amount) => {
        try {

            const resolvedWalletAddress = await resolveName(recepient);
            let cUSDContract = await kit.contracts.getStableToken(StableToken.cUSD);
            let tx = await cUSDContract
                .transfer(resolvedWalletAddress, amount)
                .send({feeCurrency: cUSDContract.address});
            const txReceipt = await tx.waitReceipt();
            console.log(tx);
        }
        catch (error) {
            throw error;
        }
    }, [kit]);

    const onInputChange = debounce((evt) => {
        const name = evt.target.value;
        resolveName(name);

        evt.persist();
    }, 500);

    return (
        <div>
            <main>
                Name service
            <div>
                    Connected to network : {network.name}
                </div>


                <div>
                    {!address ? (<button onClick={connect}>Connect wallet</button>) : (<div> Connected to Wallet : {address}</div>)}
                </div>
                <div>
                    {address ? <button onClick={destroy}>Disconnect</button> : <></>}
                </div>

                <div>
                    Enter the friendly name here : <input type='text' onChange={onInputChange} />
                </div>
            Resolved wallet address is: {walletAddress}
            </main>
            <div>
                Send currency:

                <Formik
                    initialValues={{ name: '', amount: 0 }}
                    onSubmit={(values, { setSubmitting }) => {
                        console.log(values);
                        const { amount, name } = values;
                        sendCurrency(name, amount);
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <Field type="text" name="name" />
                            <Field type="text" name="amount" />

                            <button type="submit" disabled={isSubmitting}>
                                Send
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}