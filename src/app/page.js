'use client'
import { useState } from 'react';
import { Importer, ImporterField } from 'react-csv-importer';
import { Contract, ethers } from "ethers";
import multisendJson from './multisend.json'

const blockchainExplorerUrls = {
  "84532": "https://sepolia.basescan.org/tx"
}

export default function Home() {
  const [payments, setPayments] = useState(undefined);
  const [sending, setSending] = useState(false);
  const [blockchainExplorer, setBlockchainExplorer] = useState(undefined);
  const [error, setError] = useState(false);
  const [transaction, setTransaction] = useState(false);
  
  const sendPayments = async () => {
    console.log("sending payments");
    console.log(payments);

    // Connect to Metamask
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const { chainId } = await provider.getNetwork();
    setBlockchainExplorer(blockchainExplorerUrls[chainId.toString()]);

    // Show feedback to user
    setSending(true);

    // Format arguments for smart contract function
    const { recipients, amounts, total } = payments.reduce((acc, val) => {
      acc.recipients.push(val.recipient);
      const amount = val.amount.trim(); // Trim any leading/trailing whitespace
      acc.amounts.push(ethers.parseUnits(amount, 'wei')); // Ensure amounts are in wei
      acc.total += parseInt(amount, 10);
      return acc;
    }, { recipients: [], amounts: [], total: 0 });

    console.log(recipients);

    // Send transaction
    const multisend = new Contract(multisendJson.address, multisendJson.abi, signer);
    try {
      const tx = await multisend.send(recipients, amounts, { value: ethers.parseUnits(total.toString(), 'wei') });
      const txReceipt = await tx.wait();
      setTransaction(txReceipt.hash);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container-fluid mt-5 d-flex justify-content-center">
      <div id="content" className="row">
        <div id="content-inner" className="col">
          <div className="text-center">
            <h1 id="title" className="fw-bold">MULTISEND</h1>
            <p id="sub-title" className="mt-4 fw-bold"><span>Send many payments <br /> in just 1 transaction</span></p>
          </div>

          <Importer
            dataHandler={rows => setPayments(rows)}
            defaultNoHeader={false} // optional, keeps "data has headers" checkbox off by default
            restartable={false} // optional, lets user choose to upload another file when import is complete
          >
            <ImporterField name="recipient" label="Recipient" />
            <ImporterField name="amount" label="Amount" />
            <ImporterField name="currency" label="Currency" />
          </Importer>

          <div className='text-center'>
            <button
              className='btn btn-primary mt-5'
              onClick={sendPayments}
              disabled={sending || typeof payments === "undefined"}
            >
              Send payments
            </button>
          </div>

          {sending && <div className='alert alert-info mt-4 mb-0'>Your payments are processing. Please wait until the transaction is mined.</div>}
          {transaction && <div className='alert alert-success mt-4 mb-0'>Congrats! The payments were sent at <a href={`${blockchainExplorer}/${transaction}`} target='_blank'>{`${transaction.substr(0, 20)}....`}</a></div>}
          {error && <div className='alert alert-danger mt-4 mb-0'>There was a problem. Your payments were not sent. Please try again later.</div>}
        </div>
      </div>
    </div>
  );
}
