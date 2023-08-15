const { Router } = require("express");
const { YogaModel } = require("../models/YogaModel");
const YogaRouter = Router();

YogaRouter.get("/", async (req, res) => {
  try {
    const { category, q, title, sortBy, page, limit } = req.query;
    const filter = {};

    if (category) filter.category = { $regex: category, $options: "i" };
    if (title) filter.title = { $regex: title, $options: "i" };
    const query = YogaModel.find(filter);

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

    const total = await YogaModel.countDocuments(filter);
    const yoga = await query.skip((page - 1) * limit).limit(limit);

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      yoga,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

YogaRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Missing ID parameter" });
    }

    const yoga = await YogaModel.findById(id);

    if (!yoga) {
      return res.status(404).json({ msg: "yoga data not found" });
    }

    res.status(200).json({ yoga });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});


YogaRouter.post("/create", async (req, res) => {
  const { title, image, description, category } = req.body;

  const new_yoga = new YogaModel({
    title,
    image,
    description,
    price,
    category,
  });
  await new_yoga.save();
  res.status(200).send({ msg: "exercise created" });
});

module.exports = {
  YogaRouter,
};
