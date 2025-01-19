const express = require("express");
const { authMiddleware } = require("../middleware");
const { default: mongoose } = require("mongoose");
const { Account } = require("../db");

const router = express.Router();

// GET /balance
router.get("/balance",authMiddleware, async (req, res) => {
    console.log("Inside Middleware");
    try {
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        console.log("User ID:", req.userId);
        console.log("Account Balance:", account.balance);

        res.json({ balance: account.balance });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// POST /transfer
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { amount, to } = req.body;

        // Validate input
        if (!amount || amount <= 0 || !to) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid input data" });
        }

        const account = await Account.findOne({ userId: req.userId }).session(session);
        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid account" });
        }

        // Perform transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        console.log("Transfer successful");
        res.json({ message: "Transfer Successful" });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error during transfer:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    } finally {
        session.endSession(); // Ensure session is always closed
    }
});

module.exports = router;
