const { Router } = require("express");
const { CardioModel } = require("../models/CardioModel");
const CardioRouter = Router();

CardioRouter.get("/", async (req, res) => {
  try {
    const { category, q, title, sortBy, page, limit } = req.query;
    const filter = {};

    if (category) filter.category = { $regex: category, $options: "i" };
    if (title) filter.title = { $regex: title, $options: "i" };
    const query = CardioModel.find(filter);

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

    const total = await CardioModel.countDocuments(filter);
    const cardio = await query.skip((page - 1) * limit).limit(limit);

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      cardio,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

CardioRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Missing ID parameter" });
    }

    const cardio = await CardioModel.findById(id);

    if (!cardio) {
      return res.status(404).json({ msg: "cardio data not found" });
    }

    res.status(200).json({ cardio });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});


CardioRouter.post("/create", async (req, res) => {
  const { title, image, description, category } = req.body;

  const new_cardio = new CardioModel({
    title,
    image,
    description,
    category,
  });
  await new_cardio.save();
  res.status(200).send({ msg: "exercise created" });
});

module.exports = {
  CardioRouter,
};
