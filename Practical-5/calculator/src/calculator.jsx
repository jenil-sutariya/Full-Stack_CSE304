import React, { useState } from "react";
import "./Calculator.css";

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value) => {
    if (value === "DEL") {
      setExpression((prev) => prev.slice(0, -1));
    } else if (value === "=") {
      try {
        const evalResult = eval(expression);
        setResult(evalResult);
      } catch {
        setResult("Error");
      }
    } else {
      setExpression((prev) => prev + value);
    }
  };

  const buttons = [
    ["/", "*", "+", "-", "DEL"],
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["0", ".", "="],
  ];

  return (
    <div className="calculator">
      <div className="display">
        <div className="result">({result || 0})</div>
        <div className="expression">{expression || "0"}</div>
      </div>

      <div className="row top-row">
        {buttons[0].map((btn) => (
          <button
            key={btn}
            onClick={() => handleClick(btn)}
            className="btn top"
          >
            {btn}
          </button>
        ))}
      </div>

      {buttons.slice(1).map((row, i) => (
        <div className="row" key={i}>
          {row.map((btn) => (
            <button key={btn} onClick={() => handleClick(btn)} className="btn">
              {btn}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
