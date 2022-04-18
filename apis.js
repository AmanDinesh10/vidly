const e = require("express");
const express = require("express");
const SellBuy = require("../mongoose/models/sellBuy");
// setting up the router
const sellAndBuyRouter = new express.Router();
// code goes here for routes
// GET
sellAndBuyRouter.get("/sellProduct", async (req, res) => {
  if (req.query.product) {
    const data = await SellBuy.find({ productName: req.query.product });
    return res.send(data);
  }

  if (req.query.sortBy) {
    if (req.query.sortBy === "lowerCostPrice") {
      const data = await SellBuy.find().sort({ costPrice: 1 });
      return res.send(data);
    }
    if (req.query.sortBy === "higherCostPrice") {
      const data = await SellBuy.find().sort({ costPrice: -1 });
      return res.send(data);
    }
    if (req.query.sortBy === "lowerSoldPrice") {
      const data = await SellBuy.find().sort({ soldPrice: 1 });
      return res.send(data);
    }
    if (req.query.sortBy === "higherSoldPrice") {
      const data = await SellBuy.find().sort({ soldPrice: -1 });
      return res.send(data);
    }
  }
  if (!req.query.product) {
    try {
      const data = await SellBuy.find({});
      return res.send(data);
    } catch (e) {
      res.status(500).send();
    }
  }
});
// POST
sellAndBuyRouter.post("/sellProduct", async (req, res) => {
  const data = new SellBuy(req.body);
  if (req.body.productName.length < 4) {
    return res
      .status(400)
      .json({ error: "product name should have minimum of four characters" });
  }
  if (req.body.costPrice * 1 <= 0) {
    return res
      .status(400)
      .json({ error: "cost price value cannot be zero or negative value" });
  }
  await data.save();
  res.status(201).json({ message: "Product Added" });
});
// DELETE
sellAndBuyRouter.delete("/sellProduct/:id", async (req, res) => {
  try {
    const data = await SellBuy.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (e) {
    res.status(400).send();
  }
});
// PATCH
sellAndBuyRouter.patch("/sellProduct/:id", async (req, res) => {
  try {
    if (req.body.soldPrice <= 0) {
      return res
        .status(400)
        .json({ error: "sold price value cannot be zero or negative value" });
    }
    const data = await SellBuy.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Updated Successfully" });
  } catch (e) {
    res.status(400).send();
  }
});

// exporting the router
module.exports = sellAndBuyRouter;
