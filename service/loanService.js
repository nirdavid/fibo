import LoanModel from '../models/loan.js'
import {printLoanDetails, printDate} from "./consts.js";
import asyncCurrencyConverter from './currencyConverterService.js'
import {calcNumberOfDaysBetween, LOAN_BASE_COMMISSION, LOAN_DAILY_COMMISSION} from "./consts.js";

export const saveNewLoan = (loanDetails) => {
    const {loanAmount, loanCurrency, loanStart} = loanDetails;
    const loanData = new LoanModel({loanAmount, loanCurrency, loanStart});
    loanData.save()
        .then(item => {
            printLoanDetails(item);
            process.exit();
        })
        .catch(err => {
            console.log(err);
        });
};

export const findAndRemoveLoan = (loanId) => {
    if (loanId.match(/^[0-9a-fA-F]{24}$/)) {
        return LoanModel.findByIdAndRemove({_id: loanId});
    }
    throw new Error('Loan id is illegal');
};

export const endLoan = (loanId, paidCurrency) => {
    findAndRemoveLoan(loanId).then(loanDetails => {
        if (!loanDetails) {
            console.log('Loan does not exist');
            process.exit();
        }
        const loanEndDate = Date.now();
        const numOfDays = calcNumberOfDaysBetween(loanDetails.loanStart, loanEndDate);
        const totalCommission = LOAN_BASE_COMMISSION + numOfDays * LOAN_DAILY_COMMISSION;
        asyncCurrencyConverter({
            inputCashAmount: loanDetails.loanAmount,
            currencyCodeSource: loanDetails.loanCurrency,
            currencyCodeTarget: paidCurrency
        }).then((result) => {
            const paidAmountBeforeCommission = parseFloat(result.Amount);
            console.log('Loan end: ');
            console.log({
                'Paid Currency': paidCurrency,
                'Total Commission': totalCommission,
                'Paid Amount Before Commission': paidAmountBeforeCommission,
                'Paid Amount':  Math.round(paidAmountBeforeCommission + (paidAmountBeforeCommission * (totalCommission/100))).toFixed(2),
                'Loan end': printDate(loanEndDate)
            });
            printLoanDetails(loanDetails);
            process.exit();
        }).catch(err => {
            console.error(err)
        });
    }).catch(err => {
        console.error(err)
    });
};