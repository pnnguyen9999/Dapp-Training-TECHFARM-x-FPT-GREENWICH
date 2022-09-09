import Web3 from "web3";
import { useEffect, useState } from "react";
import HERA_ABI from "./HERA.abi.json";

function Dapp() {
    const CHAIN_ID = "97";
    const HERA_ADDRESS = "0x98FBF57eE948694E2195c92da818E1628b76017D";
    /** BASIC INFO STATE*/
    const [web3Info, setWeb3Info] = useState();
    const [userAddress, setUserAddress] = useState();
    const [nativeBalance, setNativeBalance] = useState();
    /** SMART CONTRACT (HEGEM) INFO STATE*/
    const [heraBalance, setHeraBalance] = useState();
    /** UI STATE */
    const [recipientAddress, setRecipientAddress] = useState();
    const [heraAmount, setHeraAmount] = useState();

    useEffect(() => {
        /* -> check ethereum env */
        if (window.ethereum) {
            console.log(window.ethereum.networkVersion);
            console.log("this browser has an ethereum env");
        }
    }, []);

    useEffect(() => {
        /* -> set web3Info */
        async function watchWeb3Info() {
            if (web3Info) {
                /** BASIC INFO */
                /* -> get address[] (addresses) */
                const addresses = await web3Info.eth.getAccounts();
                /* -> get native balance (wei)*/
                const balance = await web3Info.eth.getBalance(addresses[0]);
                /* -> convert wei to ether */
                /** refs: https://eth-converter.com/ */
                const balanceFromWei = Web3.utils.fromWei(`${balance}`, "ether");
                /* Set variables to state */
                /* -> set address */
                setUserAddress(addresses[0]);
                /* -> set balance */
                setNativeBalance(balanceFromWei);
                /** SMART CONTRACT (HEGEM) INFO */
                /* -> init new connection to smart contract */
                const heraContract = new web3Info.eth.Contract(HERA_ABI, HERA_ADDRESS);
                /* -> get HERA token balance (wei)*/
                const heraBalance = await heraContract.methods.balanceOf(addresses[0]).call();
                /* -> convert wei to ether */
                const heraBalanceFromWei = Web3.utils.fromWei(`${heraBalance}`, "ether");
                /* -> set HERA balance */
                setHeraBalance(heraBalanceFromWei);
            }
        }
        watchWeb3Info();
    }, [web3Info]);

    async function connectWallet() {
        if (window.ethereum.networkVersion !== CHAIN_ID) {
            /* -> wrong chain ID, call wallet to change network */
            console.log("wrong chain");
            const chainID_HEX = await Web3.utils.numberToHex(CHAIN_ID);
            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: chainID_HEX }],
                });
                /* -> set web3Info */
                setWeb3Info(new Web3(window.ethereum));

            } catch (err) {
                console.log(err);
                return false;
            }
        } else {
            /* -> right chain ID */
            /* -> set web3Info */
            setWeb3Info(new Web3(window.ethereum));
        }
    }

    async function transferToken() {
        const heraContract = new web3Info.eth.Contract(HERA_ABI, HERA_ADDRESS);
        const heraAmountToWei = Web3.utils.toWei(`${heraAmount}`, "ether");
        await heraContract.methods
            .transfer(recipientAddress, heraAmountToWei)
            .send({ from: userAddress })
            .on("transactionHash", (hash) => {
                console.log(`on transactionHash (submit) -> txID: ${hash}`);
            })
            .on("error", (error) => {
                console.log(error);
                console.log(`on transactionError (fail) -> error: ${error.message}`);
            })
            .then(async (receipt) => {
                if (receipt.status === true) {
                    console.log(`on transactionSuccess (success) -> txID: ${receipt.transactionHash}`);
                }
            })
            .catch((err) => {
                console.log(`on transactionError (fail) -> error: ${err.message}`);
            });
    }

    return (<div>
        {!web3Info && <button onClick={connectWallet}>Connect wallet</button>}
        {web3Info && <div>
            User address: {userAddress}<br />
            BNB Balance: {nativeBalance}<br />
            HERA Balance: {heraBalance}<br />
            <div>
                <input placeholder="Recipient address..." value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} /><br />
                <input placeholder="HERA amount..." value={heraAmount} onChange={(e) => setHeraAmount(e.target.value)} /><br />
                <button onClick={transferToken}>Send HERA</button>
            </div>
        </div>}


    </div>);
}
export default Dapp;