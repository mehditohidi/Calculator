// src/App.jsx
import React, { useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const App = () => {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState("");
  const [operation, setOperation] = useState("+");
  const [walletConnected, setWalletConnected] = useState(false);

  const CalculatorABI = `[
      {
        "inputs": [
          { "internalType": "uint256", "name": "a", "type": "uint256" },
          { "internalType": "uint256", "name": "b", "type": "uint256" }
        ],
        "name": "add",
        "outputs": [
          { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "a", "type": "uint256" },
          { "internalType": "uint256", "name": "b", "type": "uint256" }
        ],
        "name": "divide",
        "outputs": [
          { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "a", "type": "uint256" },
          { "internalType": "uint256", "name": "b", "type": "uint256" }
        ],
        "name": "multiply",
        "outputs": [
          { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "a", "type": "uint256" },
          { "internalType": "uint256", "name": "b", "type": "uint256" }
        ],
        "name": "subtract",
        "outputs": [
          { "internalType": "uint256", "name": "", "type": "uint256" }
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
      "0x1afEB4A1Ffe2911B9cB83b111929b2d672CAE080",
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

    if (calculatedResult !== undefined) {
      setResult(calculatedResult.toString());
    } else {
      alert("Calculation failed!");
    }
  };

  return (
    <div className="container">
      <div className="calculator">
        <h1 className="title">Ethereum Calculator</h1>
        {!walletConnected && (
          <button className="btn connect-btn" onClick={handleConnectWallet}>
            Connect Wallet
          </button>
        )}
        {walletConnected && (
          <>
            <div className="input-group">
              <input
                type="number"
                className="input-field"
                placeholder="Enter number 1"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
              />
              <select
                className="operation-select"
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
                className="input-field"
                placeholder="Enter number 2"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
              />
            </div>
            <button className="btn calculate-btn" onClick={handleCalculate}>
              Calculate
            </button>
            <div className="result">
              <span>Result:</span> {result || "N/A"}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
