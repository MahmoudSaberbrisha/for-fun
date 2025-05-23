const Minute = require("../models/Minute");

// Create a new minute
exports.createMinute = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const newMinute = new Minute({
      title,
      content,
    });

    await newMinute.save();

    res.status(201).json({
      success: true,
      message: "Minute created successfully",
      data: newMinute,
    });
  } catch (err) {
    next(err);
  }
};

// Get all minutes
exports.getMinutes = async (req, res, next) => {
  try {
    const minutes = await Minute.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: minutes,
    });
  } catch (err) {
    next(err);
  }
};

// Update a minute by ID
exports.updateMinute = async (req, res, next) => {
  try {
    const minuteId = req.params.id;
    const updateData = req.body;

    const updatedMinute = await Minute.findByIdAndUpdate(minuteId, updateData, {
      new: true,
    });

    if (!updatedMinute) {
      return res
        .status(404)
        .json({ success: false, message: "Minute not found" });
    }

    res.status(200).json({
      success: true,
      message: "Minute updated successfully",
      data: updatedMinute,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a minute by ID
exports.deleteMinute = async (req, res, next) => {
  try {
    const minuteId = req.params.id;

    const deletedMinute = await Minute.findByIdAndDelete(minuteId);

    if (!deletedMinute) {
      return res
        .status(404)
        .json({ success: false, message: "Minute not found" });
    }

    res.status(200).json({
      success: true,
      message: "Minute deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
