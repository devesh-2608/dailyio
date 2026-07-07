import { useState } from "react";
import convert from "convert-units";
import "./unitconverter.css";

const UnitConverter = () => {
    const [measure, setMeasure] = useState("length");
    const [fromUnit, setFromUnit] = useState("m");
    const [toUnit, setToUnit] = useState("km");
    const [inputValue, setInputValue] = useState("");
    const [result, setResult] = useState("");

    const measures = convert().measures();
    const units = convert().possibilities(measure);
    const allUnits = convert().list(measure);

    const handleConvert = (e) => {
        e.preventDefault();
        if (!inputValue || isNaN(inputValue)) {
            alert("Please enter a valid number");
            return;
        }

        try {
            let output;
            if (measure === "temperature") {
                output = convert(parseFloat(inputValue)).from(fromUnit).to(toUnit);
            } else {
                output = convert(parseFloat(inputValue)).from(fromUnit).to(toUnit);
            }
            
            setResult(`${inputValue} ${fromUnit} = ${output.toFixed(4)} ${toUnit}`);
        } catch (error) {
            setResult("Invalid conversion combination");
        }
    };

    const swapUnits = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    return (
        <div className="unit-converter-container">
            <div className="unit-converter-content">
                <div className="unit-converter-header">
                    <h1>Unit <span>Converter</span></h1>
                    <p className="unit-converter-subtitle">Convert between different units of measurement</p>
                </div>

                <div className="unit-converter-card">
                    <form className="unit-converter-form" onSubmit={handleConvert}>
                        <div className="unit-converter-form-group">
                            <label>Measurement Type:</label>
                            <select 
                                className="unit-converter-select"
                                value={measure} 
                                onChange={(e) => {
                                    setMeasure(e.target.value);
                                    setFromUnit(convert().possibilities(e.target.value)[0]);
                                    setToUnit(convert().possibilities(e.target.value)[1]);
                                }}
                            >
                                {measures.map(m => (
                                    <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="unit-converter-form-group">
                            <label>Value:</label>
                            <input
                                className="unit-converter-input"
                                type="number"
                                step="any"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter value"
                            />
                        </div>

                        <div className="unit-converter-selectors">
                            <div className="unit-converter-select-group">
                                <label>From:</label>
                                <select
                                    className="unit-converter-select"
                                    value={fromUnit}
                                    onChange={(e) => setFromUnit(e.target.value)}
                                >
                                    {units.map(unit => {
                                        const desc = allUnits.find(u => u.abbr === unit);
                                        return <option key={unit} value={unit}>{desc?.plural || unit}</option>;
                                    })}
                                </select>
                            </div>

                            <button 
                                type="button" 
                                className="unit-converter-swap-btn" 
                                onClick={swapUnits}
                            >
                                ↔
                            </button>

                            <div className="unit-converter-select-group">
                                <label>To:</label>
                                <select
                                    className="unit-converter-select"
                                    value={toUnit}
                                    onChange={(e) => setToUnit(e.target.value)}
                                >
                                    {units.map(unit => {
                                        const desc = allUnits.find(u => u.abbr === unit);
                                        return <option key={unit} value={unit}>{desc?.plural || unit}</option>;
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="unit-converter-button-group">
                            <button className="unit-converter-button" type="submit">
                                Convert
                            </button>
                        </div>
                    </form>

                    {result && (
                        <div className="unit-converter-result">
                            {result}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnitConverter;