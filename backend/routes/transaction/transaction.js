import express from 'express';
import db from '../../config/db.js';
import TransactionModel from '../../models/transaction_model.js';

const router = express.Router();
const transactionModel = new TransactionModel(db);

// authenticated user and user is admin can access this 
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.type === 'admin') {
        // User is authenticated, proceed to the next middleware or routes
        return next();
    } else {
        // User is not authenticated, redirect or handle accordingly
        res.json({ message: "Bad Credentials" }); // You can redirect to a login page, for example
    }
};

router.get("/getAllTransactions", async (req, res) => {
    const transactions = await transactionModel.getAllTransactions();
    console.log("book transactions", transactions);
    res.send({ message: "Book transactions", list: transactions });
});

router.post("/getTransaction", async (req, res) => {
    const { transaction_id } = req.body;
    const copy = await transactionModel.getTransaction(transaction_id);
    console.log("book Copy", copy);
    res.send({ message: "Book Copy", copy });
});

router.post("/addTransaction", isAuthenticated, async (req, res) => {
    const { student_id, book_id, admin_id, issue_date, return_date, status } = req.body;
    const transaction = await transactionModel.addTransaction(student_id, book_id, admin_id, issue_date, return_date, status);
    console.log("Added book transaction", transaction);
    res.send({ message: "Added Book transaction", transaction });
});

router.put("/updateTransaction", isAuthenticated, async (req, res) => {
    const { copy_id } = req.body;
    const copy = await transactionModel.updateTransaction(copy_id);
    console.log("Updated book copy", copy);
    res.send({ message: "Updated Book copy", copy });
});

router.delete("/deleteTransaction", isAuthenticated, async (req, res) => {
    const { transaction_id } = req.body;
    const copy = await transactionModel.deleteTransaction(transaction_id);
    console.log("Deleted book copy", copy);
    res.send({ message: "Deleted Book copy", copy });
});

const isStudent = (req, res, next) => {
    if (req.session && req.session.type === "student") {
        // User is authenticated, proceed to the next middleware or routes
        return next();
    } else {
        // User is not authenticated, redirect or handle accordingly
        res.json({ message: "Bad Credentials" }); // You can redirect to a login page, for example
    }
};

router.get("/getStudentAllTransactions", isStudent, async (req, res) => {
    try {
        const student_id = req.session.user.student_id;
        const transactions = await transactionModel.getStudentAllTransactions(student_id);
        console.log(transactions, "of student_id", student_id);
        res.json({ message: "transaction of user", list: transactions });
    } catch (e) {
        res.json({ message: "Bad Credentials", code: 401 });
    }
});

export default router;