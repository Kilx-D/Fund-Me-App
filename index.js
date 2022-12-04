import {ethers} from "./ethers.js";
import {abi, contractAddress} from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fund");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

withdrawButton.onclick = withdraw;
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;

async function connect ()  {
    //this if statement checks if the browser has the metamask extension in the first place
    if (typeof window.ethereum !== "undefined") {
        //opens up metamask for the website to use
        window.ethereum.request({ method: "eth_requestAccounts" });
        alert("connected!")
        console.log(ethers)
    } else {
        alert("metamask not detected")
    }
}

async function fund(){
    const ethAmount = document.getElementById("ethAmount").value;
    alert(`Funding with ${ethAmount}`)
   
    if(typeof window.ethereum !== "undefined"){
        //provider / connection to the blockchain
        // signer / wallet / someone with some gas
        // contract that we are intereracting with
        // ^ ABI & address

        //uses a http endpoint as a provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        //gets the person's address 
        const signer = provider.getSigner();
        //gets the contract and identify the user with the signer variable
        const contract = new ethers.Contract(contractAddress, abi, signer) // ?
    
        //send the transaction

        try {
            const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)});
            //listen for the tx to be mined
            await listenForTransactionMine(transactionResponse, provider)
        } catch(error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse,provider) {
    console.log(`Mining ${transactionResponse.hash}. . .`);

    //uses the promise to make the function wait until the callback is done
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Complete with ${transactionReceipt.confirmations} confirmations`)
            resolve()
        })
    })
    //create a listener for the blockchain
}


async function getBalance() {
    if(typeof window.ethereum !== "undefined"){
        //gets the provider (mainnet, testnet, localhost, etc)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        //gets the amount of eth the contract is currently holding
        const balance = await provider.getBalance(contractAddress);
        //displays the amount of etha nd formats it
        alert(ethers.utils.formatEther(balance))
    }
}

async function withdraw() { 
    if(typeof window.ethereum != "undefined"){
        console.log("Withdrawing . . . ")
        //gets the provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        //gets the signer
        const signer = provider.getSigner();

        const contract = new ethers.Contract(contractAddress, abi, signer);
        console.log(contract)
        try {
            //runs the withdraw function
            const transactionReponse = await contract.withdraw();
            //listens till it gets the receipt for the transaction
            await listenForTransactionMine(transactionReponse, provider) 
        }catch(error) {
            console.log(error)
        }
    }
}