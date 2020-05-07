import dateformat from "dateformat";

export const LOAN_BASE_COMMISSION = 5;
export const LOAN_DAILY_COMMISSION = 0.5;

export const printDate = (date) => dateformat(date, "dd/mm/yyyy");

export const printLoanDetails = (loanDetailsDB) => {
    const loanDetails = {
        'Loan Amount: ' : loanDetailsDB.loanAmount,
        'Loan Currency: ': loanDetailsDB.loanCurrency,
        'Base Commission: ': LOAN_BASE_COMMISSION,
        'Daily Commission: ': LOAN_DAILY_COMMISSION,
        'Loan Start: ': printDate(loanDetailsDB.loanStart),
        'Loan id: ': loanDetailsDB._id,
    };
    console.log('Loan Details:');
    console.log(loanDetails);
};

export const calcNumberOfDaysBetween = (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return Math.round((endDate - startDate) / oneDay);
};