// src/App.jsx
import React, { useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const App = () => {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState("");
  const [operation, setOperation] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

  const CalculatorABI = `[
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "a",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "b",
            "type": "uint256"
          }
        ],
        "name": "add",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "a",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "b",
            "type": "uint256"
          }
        ],
        "name": "divide",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "a",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "b",
            "type": "uint256"
          }
        ],
        "name": "multiply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "a",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "b",
            "type": "uint256"
          }
        ],
        "name": "subtract",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      }
    ]`;

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.enable();
      setWalletConnected(true);
    } else {
      alert("MetaMask is not installed!");
    }
  };

  const handleCalculate = async () => {
    if (!walletConnected) {
      alert("Please connect your wallet first!");
      return;
    }
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0x7C1fA57DBC5f8EFbe06B6e9B6CdAc15677c01109",
      CalculatorABI,
      signer
    );
  
    let calculatedResult;
    if (operation === "+") {
      calculatedResult = await contract.add(num1, num2);
    } else if (operation === "-") {
      calculatedResult = await contract.subtract(num1, num2);
    } else if (operation === "*") {
      calculatedResult = await contract.multiply(num1, num2);
    } else if (operation === "/") {
      calculatedResult = await contract.divide(num1, num2);
    }
  
    console.log("Calculated Result:", calculatedResult);
  
    if (calculatedResult !== undefined) {
      setResult(calculatedResult.toString());
    } else {
      alert("Calculation failed!");
    }
  };
  

  return (
    <div className="container">
      <div className="calculator">
        <h2>Calculator</h2>
        {!walletConnected && (
          <button onClick={handleConnectWallet}>Connect Wallet</button>
        )}
        {walletConnected && (
          <>
            <div className="input-group">
              <input
                type="number"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
              />
              <select
                defaultValue="+"
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
              >
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="*">*</option>
                <option value="/">/</option>
              </select>
              <input
                type="number"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
              />
            </div>
            <button onClick={handleCalculate}>=</button>
            <div className="result">Result: {result}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
