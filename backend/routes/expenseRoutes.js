const express = require("express");
const {
  saveExpense,
  updateExpense,
  deleteExpense,
  getExpense,
} = require("../controllers/expenseController");

const router = express.Router();

router.route("/save").post(saveExpense);
router.get("/get/:userId", getExpense);
router.put("/put/:id", updateExpense);
router.delete("/delete/:id", deleteExpense);

module.exports = router;
