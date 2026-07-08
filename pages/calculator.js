import Head from 'next/head';
import LoanCalculator from '@/components/LoanCalculator';

export default function CalculatorPage() {
  return (
    <>
      <Head>
        <title>Home Loan EMI Calculator — PrimeNest</title>
      </Head>
      <section className="bg-brand text-white py-5">
        <div className="container text-center">
          <h1 className="h2 fw-bold">Home Loan EMI Calculator</h1>
          <p className="opacity-75 mb-0">
            Plan your budget before you fall in love with a home. Adjust price,
            down payment, interest rate and tenure to see your monthly EMI.
          </p>
        </div>
      </section>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <LoanCalculator />
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-lg-10">
            <h4 className="section-title mb-4">Good to know</h4>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <i className="bi bi-percent fs-3 text-brand" />
                    <h6 className="fw-bold mt-2">How EMI is calculated</h6>
                    <p className="text-secondary small mb-0">
                      EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where P is the loan
                      amount, r the monthly interest rate and n the number of
                      months. Early EMIs are interest-heavy; later ones repay
                      more principal.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <i className="bi bi-piggy-bank fs-3 text-brand" />
                    <h6 className="fw-bold mt-2">Down payment matters</h6>
                    <p className="text-secondary small mb-0">
                      Most lenders finance 75–90% of the property value. A larger
                      down payment lowers both your EMI and the total interest
                      you pay over the life of the loan.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <i className="bi bi-graph-down-arrow fs-3 text-brand" />
                    <h6 className="fw-bold mt-2">Shorter tenure, less interest</h6>
                    <p className="text-secondary small mb-0">
                      A 15-year loan has a higher EMI than a 30-year loan, but the
                      total interest paid can be dramatically lower. Use the
                      year-wise schedule to compare.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-secondary small mt-4 mb-0">
              * This calculator provides indicative figures only. Actual EMI,
              eligibility and rates depend on your lender.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
