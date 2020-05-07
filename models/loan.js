import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
    loanAmount: Number,
    loanCurrency: String,
    loanStart: Date
});

const LoanModel = mongoose.model("Loan", loanSchema);

export default LoanModel;