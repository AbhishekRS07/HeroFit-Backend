const { Router } = require("express");
const { BoxingModel } = require("../models/BoxingModel");

const BoxingRouter = Router();

BoxingRouter.get("/", async (req, res) => {
  try {
    const { category, q, title, sortBy, page, limit } = req.query;
    const filter = {};

    if (category) filter.category = { $regex: category, $options: "i" };
    if (title) filter.title = { $regex: title, $options: "i" };

    const query = BoxingModel.find(filter);

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

    const total = await BoxingModel.countDocuments(filter);
    const boxing = await query
      .skip((parseInt(page) - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      boxing,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});
BoxingRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Missing ID parameter" });
    }

    const boxing = await BoxingModel.findById(id);

    if (!boxing) {
      return res.status(404).json({ msg: "Boxing data not found" });
    }

    res.status(200).json({ boxing });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});
BoxingRouter.post("/create", async (req, res) => {
  const { title, image, description, category } = req.body;

  const new_boxing = new BoxingModel({
    title,
    image,
    description,
    category,
  });
  await new_boxing.save();
  res.status(200).send({ msg: "ad created" });
});

module.exports = {
  BoxingRouter,
};
