const { Router } = require("express");
const { WeightModel } = require("../models/WeightModel");
const WeightRouter = Router();

WeightRouter.get("/", async (req, res) => {
  try {
    const { category, q, title, sortBy, page, limit } = req.query;
    const filter = {};

    if (category) filter.category = { $regex: category, $options: "i" };
    if (title) filter.title = { $regex: title, $options: "i" };
    const query = WeightModel.find(filter);

    if (q) {
      query.or([
        { category: { $regex: q, $options: "i" } },
        { title: { $regex: q, $options: "i" } },
      ]);
    }
    if (sortBy) {
      const sortOrder = sortBy === "asc" ? 1 : -1;
      query.sort({ title: sortOrder });
    }

    const total = await WeightModel.countDocuments(filter);
    const weight = await query.skip((page - 1) * limit).limit(limit);

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      weight,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

WeightRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Missing ID parameter" });
    }

    const weight = await WeightModel.findById(id);

    if (!weight) {
      return res.status(404).json({ msg: "weight data not found" });
    }

    res.status(200).json({ weight });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});



WeightRouter.post("/create", async (req, res) => {
  const { title, image, description } = req.body;

  const new_weight = new WeightModel({
    title,
    image,
    description,
  });
  await new_weight.save();
  res.status(200).send({ msg: "exercise created" });
});

module.exports = {
  WeightRouter,
};
