import React, { useState } from 'react'
import '../css/DrugCalculator.css'

interface DrugCalculatorProps {
  isOpen: boolean
  onClose: () => void
}

const DrugCalculator: React.FC<DrugCalculatorProps> = ({ isOpen, onClose }) => {
  const [calculatorType, setCalculatorType] = useState<'dose' | 'infusion' | 'opioid'>('dose')
  
  // Dose Calculator State
  const [weight, setWeight] = useState('')
  const [dosePerKg, setDosePerKg] = useState('')
  const [doseResult, setDoseResult] = useState('')

  // Infusion Calculator State
  const [drugAmount, setDrugAmount] = useState('')
  const [volumeTotal, setVolumeTotal] = useState('')
  const [desiredRate, setDesiredRate] = useState('')
  const [infusionResult, setInfusionResult] = useState('')

  // Opioid Conversion State
  const [fromDrug, setFromDrug] = useState('morphine-oral')
  const [toDrug, setToDrug] = useState('morphine-iv')
  const [fromDose, setFromDose] = useState('')
  const [opioidResult, setOpioidResult] = useState('')

  // Opioid conversion factors (morphine oral = 1)
  const opioidFactors: { [key: string]: { name: string; factor: number } } = {
    'morphine-oral': { name: 'Morphine (Oral)', factor: 1 },
    'morphine-iv': { name: 'Morphine (IV/SC)', factor: 3 },
    'oxycodone-oral': { name: 'Oxycodone (Oral)', factor: 1.5 },
    'fentanyl-patch': { name: 'Fentanyl Patch (mcg/hr)', factor: 100 },
    'tramadol-oral': { name: 'Tramadol (Oral)', factor: 0.1 },
  }

  const calculateDose = () => {
    const w = parseFloat(weight)
    const d = parseFloat(dosePerKg)
    if (isNaN(w) || isNaN(d)) {
      setDoseResult('Please enter valid numbers')
      return
    }
    const total = w * d
    setDoseResult(`Total dose: ${total.toFixed(2)} mg`)
  }

  const calculateInfusion = () => {
    const amount = parseFloat(drugAmount)
    const volume = parseFloat(volumeTotal)
    const rate = parseFloat(desiredRate)
    
    if (isNaN(amount) || isNaN(volume) || isNaN(rate)) {
      setInfusionResult('Please enter valid numbers')
      return
    }
    
    const concentration = amount / volume
    const mlPerHour = rate / concentration
    
    setInfusionResult(`Concentration: ${concentration.toFixed(2)} mg/mL\nInfusion rate: ${mlPerHour.toFixed(2)} mL/hour`)
  }

  const calculateOpioid = () => {
    const dose = parseFloat(fromDose)
    if (isNaN(dose)) {
      setOpioidResult('Please enter a valid dose')
      return
    }

    // Convert to morphine oral equivalent
    const morphineEquivalent = dose * opioidFactors[fromDrug].factor
    // Convert to target drug
    const targetDose = morphineEquivalent / opioidFactors[toDrug].factor

    setOpioidResult(`${dose} mg ${opioidFactors[fromDrug].name}\n≈ ${morphineEquivalent.toFixed(1)} mg Morphine Oral Equivalent\n≈ ${targetDose.toFixed(2)} ${toDrug.includes('patch') ? 'mcg/hr' : 'mg'} ${opioidFactors[toDrug].name}`)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content calculator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💊 Drug Calculator</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="calculator-tabs">
          <button 
            className={`tab-btn ${calculatorType === 'dose' ? 'active' : ''}`}
            onClick={() => setCalculatorType('dose')}
          >
            Dose by Weight
          </button>
          <button 
            className={`tab-btn ${calculatorType === 'infusion' ? 'active' : ''}`}
            onClick={() => setCalculatorType('infusion')}
          >
            Infusion Rate
          </button>
          <button 
            className={`tab-btn ${calculatorType === 'opioid' ? 'active' : ''}`}
            onClick={() => setCalculatorType('opioid')}
          >
            Opioid Conversion
          </button>
        </div>

        <div className="calculator-body">
          {calculatorType === 'dose' && (
            <div className="calc-section">
              <h3>Calculate Total Dose by Patient Weight</h3>
              <div className="input-group">
                <label>Patient Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 65"
                />
              </div>
              <div className="input-group">
                <label>Dose per kg (mg/kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={dosePerKg}
                  onChange={(e) => setDosePerKg(e.target.value)}
                  placeholder="e.g., 0.1"
                />
              </div>
              <button className="calc-btn" onClick={calculateDose}>Calculate</button>
              {doseResult && <div className="calc-result">{doseResult}</div>}
            </div>
          )}

          {calculatorType === 'infusion' && (
            <div className="calc-section">
              <h3>Calculate Infusion Pump Settings</h3>
              <div className="input-group">
                <label>Drug Amount (mg)</label>
                <input
                  type="number"
                  value={drugAmount}
                  onChange={(e) => setDrugAmount(e.target.value)}
                  placeholder="e.g., 50"
                />
              </div>
              <div className="input-group">
                <label>Total Volume (mL)</label>
                <input
                  type="number"
                  value={volumeTotal}
                  onChange={(e) => setVolumeTotal(e.target.value)}
                  placeholder="e.g., 500"
                />
              </div>
              <div className="input-group">
                <label>Desired Drug Rate (mg/hour)</label>
                <input
                  type="number"
                  step="0.1"
                  value={desiredRate}
                  onChange={(e) => setDesiredRate(e.target.value)}
                  placeholder="e.g., 5"
                />
              </div>
              <button className="calc-btn" onClick={calculateInfusion}>Calculate</button>
              {infusionResult && <div className="calc-result" style={{ whiteSpace: 'pre-line' }}>{infusionResult}</div>}
            </div>
          )}

          {calculatorType === 'opioid' && (
            <div className="calc-section">
              <h3>Opioid Equianalgesic Conversion</h3>
              <p className="calc-warning">⚠️ For reference only. Always verify with clinical guidelines.</p>
              <div className="input-group">
                <label>From Drug</label>
                <select value={fromDrug} onChange={(e) => setFromDrug(e.target.value)}>
                  {Object.entries(opioidFactors).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Dose ({fromDrug.includes('patch') ? 'mcg/hr' : 'mg'})</label>
                <input
                  type="number"
                  value={fromDose}
                  onChange={(e) => setFromDose(e.target.value)}
                  placeholder="e.g., 30"
                />
              </div>
              <div className="input-group">
                <label>To Drug</label>
                <select value={toDrug} onChange={(e) => setToDrug(e.target.value)}>
                  {Object.entries(opioidFactors).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
              </div>
              <button className="calc-btn" onClick={calculateOpioid}>Convert</button>
              {opioidResult && <div className="calc-result" style={{ whiteSpace: 'pre-line' }}>{opioidResult}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DrugCalculator
