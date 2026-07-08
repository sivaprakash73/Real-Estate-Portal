import { useMemo, useState } from 'react';
import { formatINR, formatINRCompact } from '@/lib/format';

// Validated categorical pair (CVD-safe, ≥3:1 on white): blue = principal, amber = interest.
const COLOR_PRINCIPAL = '#2563eb';
const COLOR_INTEREST = '#d97706';

export default function LoanCalculator({ initialPrice = 5000000, compact = false }) {
  const [price, setPrice] = useState(initialPrice);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [showSchedule, setShowSchedule] = useState(false);

  const calc = useMemo(() => {
    const principal = Math.max(0, price * (1 - downPct / 100));
    const n = Math.max(1, Math.round(years * 12));
    const r = rate / 100 / 12;
    const emi =
      r === 0
        ? principal / n
        : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - principal;

    // Year-wise amortization
    const schedule = [];
    let balance = principal;
    for (let y = 1; y <= years; y++) {
      let principalPaid = 0;
      let interestPaid = 0;
      for (let m = 0; m < 12 && balance > 0.01; m++) {
        const interest = balance * r;
        const towardPrincipal = Math.min(emi - interest, balance);
        interestPaid += interest;
        principalPaid += towardPrincipal;
        balance -= towardPrincipal;
      }
      schedule.push({ year: y, principalPaid, interestPaid, balance: Math.max(0, balance) });
      if (balance <= 0.01) break;
    }

    return { principal, emi, totalPayment, totalInterest, schedule };
  }, [price, downPct, rate, years]);

  const downPayment = price * (downPct / 100);
  const principalPct =
    calc.totalPayment > 0 ? (calc.principal / calc.totalPayment) * 100 : 50;

  return (
    <div className={compact ? '' : 'card border-0 shadow-sm'}>
      <div className={compact ? '' : 'card-body p-4'}>
        {!compact && (
          <h5 className="fw-bold mb-4">
            <i className="bi bi-calculator me-2 text-brand" />
            Home Loan EMI Calculator
          </h5>
        )}

        <div className="row g-4">
          <div className="col-lg-6">
            <label className="form-label d-flex justify-content-between">
              <span>Property Price</span>
              <span className="range-value text-brand">{formatINRCompact(price)}</span>
            </label>
            <input
              type="range"
              className="form-range"
              min={500000}
              max={100000000}
              step={100000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <input
              type="number"
              className="form-control form-control-sm mt-1"
              value={price}
              min={0}
              onChange={(e) => setPrice(Number(e.target.value) || 0)}
              aria-label="Property price in rupees"
            />

            <label className="form-label d-flex justify-content-between mt-4">
              <span>Down Payment</span>
              <span className="range-value text-brand">
                {downPct}% · {formatINRCompact(downPayment)}
              </span>
            </label>
            <input
              type="range"
              className="form-range"
              min={0}
              max={90}
              step={5}
              value={downPct}
              onChange={(e) => setDownPct(Number(e.target.value))}
            />

            <label className="form-label d-flex justify-content-between mt-4">
              <span>Interest Rate (p.a.)</span>
              <span className="range-value text-brand">{rate.toFixed(2)}%</span>
            </label>
            <input
              type="range"
              className="form-range"
              min={6}
              max={15}
              step={0.05}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />

            <label className="form-label d-flex justify-content-between mt-4">
              <span>Loan Tenure</span>
              <span className="range-value text-brand">{years} years</span>
            </label>
            <input
              type="range"
              className="form-range"
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </div>

          <div className="col-lg-6">
            <div className="bg-light rounded-3 p-4 h-100 d-flex flex-column">
              <div className="text-center mb-3">
                <div className="text-secondary small text-uppercase fw-semibold">
                  Monthly EMI
                </div>
                <div className="display-6 fw-bold text-brand">
                  {formatINR(Math.round(calc.emi))}
                </div>
              </div>

              {/* Principal vs interest split — 2px surface gap between segments */}
              <div
                className="d-flex rounded overflow-hidden my-3"
                style={{ height: 14, background: '#fff' }}
                role="img"
                aria-label={`Principal ${formatINRCompact(calc.principal)}, interest ${formatINRCompact(calc.totalInterest)}`}
              >
                <div
                  style={{
                    width: `calc(${principalPct}% - 1px)`,
                    background: COLOR_PRINCIPAL,
                    marginRight: 2,
                  }}
                />
                <div style={{ flex: 1, background: COLOR_INTEREST }} />
              </div>

              <div className="d-flex flex-column gap-2 small">
                <div className="d-flex justify-content-between">
                  <span>
                    <span
                      className="d-inline-block rounded-circle me-2"
                      style={{ width: 10, height: 10, background: COLOR_PRINCIPAL }}
                    />
                    Loan Amount (Principal)
                  </span>
                  <strong>{formatINR(Math.round(calc.principal))}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>
                    <span
                      className="d-inline-block rounded-circle me-2"
                      style={{ width: 10, height: 10, background: COLOR_INTEREST }}
                    />
                    Total Interest Payable
                  </span>
                  <strong>{formatINR(Math.round(calc.totalInterest))}</strong>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between">
                  <span>Down Payment</span>
                  <strong>{formatINR(Math.round(downPayment))}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Total Payment (Principal + Interest)</span>
                  <strong>{formatINR(Math.round(calc.totalPayment))}</strong>
                </div>
              </div>

              <button
                className="btn btn-outline-brand btn-sm mt-auto align-self-start mt-3"
                onClick={() => setShowSchedule((s) => !s)}
              >
                <i className={`bi bi-chevron-${showSchedule ? 'up' : 'down'} me-1`} />
                {showSchedule ? 'Hide' : 'Show'} year-wise schedule
              </button>
            </div>
          </div>
        </div>

        {showSchedule && (
          <div className="table-responsive mt-4">
            <table className="table table-sm table-striped align-middle">
              <thead>
                <tr className="text-secondary small text-uppercase">
                  <th>Year</th>
                  <th className="text-end">Principal Paid</th>
                  <th className="text-end">Interest Paid</th>
                  <th className="text-end">Outstanding Balance</th>
                </tr>
              </thead>
              <tbody>
                {calc.schedule.map((row) => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td className="text-end">{formatINR(Math.round(row.principalPaid))}</td>
                    <td className="text-end">{formatINR(Math.round(row.interestPaid))}</td>
                    <td className="text-end">{formatINR(Math.round(row.balance))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
