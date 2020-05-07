#!/usr/bin/env node --experimental-modules --no-warnings

import asyncCurrencyConverter from './currencyConverter.js'
import {saveNewLoan, endLoan} from './service/loanService.js'
import Database from './db/database.js'

//console.log(process.argv);
switch (process.argv[2]) {
    case 'loan': {
        saveNewLoan({
            loanAmount: process.argv[3],
            loanCurrency: process.argv[4],
            loanStart: Date.now()
        });
        break;
    }
    case 'end-loan': {
        const loanId = process.argv[3];
        const paidCurrency = process.argv[4];
        endLoan(loanId, paidCurrency);
        break;
    }
    default: {
        asyncCurrencyConverter({
            inputCashAmount: process.argv[2],
            currencyCodeSource: process.argv[3],
            currencyCodeTarget: process.argv[4]
        }).then(data => {console.log(data);}).finally(() => process.exit());
    }
}
