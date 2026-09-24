"use client";

import { useMemo, useState } from "react";
import { Calculator, IndianRupee } from "lucide-react";

export function EmiCalculator() {
  const [amount, setAmount] = useState(1000000);
  const [months, setMonths] = useState(12);
  const [rate, setRate] = useState(12);

  const emi = useMemo(() => {
    const principal = Number(amount);
    const annualRate = Number(rate);
    const tenure = Number(months);

    if (!principal || !tenure) return 0;

    const monthlyRate = annualRate / 12 / 100;

    if (monthlyRate === 0) {
      return principal / tenure;
    }

    const value =
      principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, tenure) /
      (Math.pow(1 + monthlyRate, tenure) - 1);

    return value;
  }, [amount, months, rate]);

  const totalPayment = emi * months;
  const totalInterest = Math.max(totalPayment - amount, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="vv-emi-card">
      <div className="vv-emi-heading">
        <div className="vv-emi-icon">
          <Calculator size={20} />
        </div>

        <div>
          <p className="vv-eyebrow">FINANCING ESTIMATOR</p>
          <h3>Plan your wedding budget</h3>
        </div>
      </div>

      <p className="vv-emi-description">
        Get an indicative monthly payment estimate for your wedding budget.
        Actual financing terms depend on the lender and eligibility.
      </p>

      <div className="vv-emi-grid">
        <div className="vv-emi-field">
          <label htmlFor="emi-amount">Wedding amount</label>

          <div className="vv-emi-input-wrap">
            <IndianRupee size={16} />
            <input
              id="emi-amount"
              type="number"
              min="10000"
              step="10000"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
          </div>
        </div>

        <div className="vv-emi-field">
          <label htmlFor="emi-months">Tenure</label>

          <select
            id="emi-months"
            value={months}
            onChange={(event) => setMonths(Number(event.target.value))}
          >
            <option value={6}>6 months</option>
            <option value={12}>12 months</option>
            <option value={18}>18 months</option>
            <option value={24}>24 months</option>
            <option value={36}>36 months</option>
            <option value={48}>48 months</option>
            <option value={60}>60 months</option>
          </select>
        </div>

        <div className="vv-emi-field">
          <label htmlFor="emi-rate">Annual interest rate</label>

          <div className="vv-emi-input-wrap">
            <input
              id="emi-rate"
              type="number"
              min="0"
              max="50"
              step="0.1"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
            />
            <span>%</span>
          </div>
        </div>
      </div>

      <div className="vv-emi-result">
        <div>
          <span>Estimated monthly payment</span>
          <strong>{formatCurrency(emi)}</strong>
        </div>

        <div className="vv-emi-result-details">
          <div>
            <span>Total payment</span>
            <strong>{formatCurrency(totalPayment)}</strong>
          </div>

          <div>
            <span>Estimated interest</span>
            <strong>{formatCurrency(totalInterest)}</strong>
          </div>
        </div>
      </div>

      <p className="vv-emi-note">
        This calculator is for illustration only and does not constitute a
        loan offer, approval, or financing commitment.
      </p>
    </div>
  );
}
