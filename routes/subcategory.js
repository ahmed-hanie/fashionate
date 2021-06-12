const express = require("express");
const router = new express.Router();
const searchBuilder = require("sequelize-search-builder");
const {
  subcategory: Subcategory,
  category: Category,
  Sequelize,
} = require("../models");

router.get("/", async (req, res) => {
  try {
    // Query builder
    const search = new searchBuilder(Sequelize, req.query);
    const whereQuery = search.getWhereQuery();
    const orderQuery = search.getOrderQuery();
    const limitQuery = search.getLimitQuery();
    const offsetQuery = search.getOffsetQuery();

    // Find subcategories
    const data = await Subcategory.findAll({
      where: whereQuery,
      order: orderQuery,
      limit: limitQuery,
      offset: offsetQuery,
    });

    res.status(200).json({
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const subcategory = await Subcategory.findOne({
      where: { id: req.params.id },
    });
    if (!subcategory) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(200).json(subcategory);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    // Check if subcategory exists
    let subcategory = await Subcategory.findOne({
      where: { name: req.body.name },
    });
    if (!subcategory) {
      // Create subcategory
      subcategory = await Subcategory.create(req.body);
      res.status(200).json(subcategory);
    } else {
      res.status(400).json({ message: "Resource already exists" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    // Find subcategory
    let subcategory = await Subcategory.findOne({
      where: { id: req.params.id },
    });
    if (!subcategory) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Update
    subcategory.name = req.body.name;
    await subcategory.save();

    res.status(200).json(subcategory);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Find tag
    let subcategory = await Subcategory.findOne({
      where: { id: req.params.id },
    });
    if (!subcategory) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Delete
    await subcategory.destroy();
    res.status(204).json({});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get subcategories by category
router.get("/category/:id", async (req, res) => {
  try {
    const data = await Subcategory.findAll({
      where: { "$categories.id$": req.params.id },
      include: Category,
    });

    res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;