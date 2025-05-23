const BreakingNews = require("../models/BreakingNews");

exports.createBreakingNews = async (req, res, next) => {
  try {
    const { content } = req.body;

    const newNews = new BreakingNews({
      content,
    });

    await newNews.save();

    // Redirect to breaking news view page after creation
    res.redirect("/breakingnews");
  } catch (err) {
    next(err);
  }
};

exports.getAllBreakingNews = async (req, res, next) => {
  try {
    const news = await BreakingNews.find().sort({ createdAt: -1 });

    // Render breakingnews view with all news items
    res.render("breakingnews", {
      items: news,
      editItem: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateBreakingNews = async (req, res, next) => {
  try {
    const { id } = req.params; // Gets the _id from URL parameters
    const updates = req.body; // Gets the updated data from request body

    const updatedNews = await BreakingNews.findByIdAndUpdate(id, updates, {
      new: true, // Returns the updated document
      runValidators: true, // Runs validation on update
    });

    if (!updatedNews) {
      // Render breakingnews view with error message if not found
      const news = await BreakingNews.find().sort({ createdAt: -1 });
      return res.status(404).render("breakingnews", {
        items: news,
        editItem: null,
        errorMessage: "Breaking news not found",
      });
    }

    // Redirect to breaking news view page after update
    res.redirect("/breakingnews");
  } catch (err) {
    next(err);
  }
};

exports.searchBreakingNews = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    const searchQuery = {
      content: { $regex: keyword, $options: "i" }, // case-insensitive search
    };

    const news = await BreakingNews.find(searchQuery).sort({ createdAt: -1 });

    // Render breakingnews view with filtered news items
    res.render("breakingnews", {
      items: news,
      editItem: null,
    });
  } catch (err) {
    next(err);
  }
};

// New controller method to render breakingnews.ejs view with interactive content
exports.getBreakingNewsView = async (req, res, next) => {
  try {
    const news = await BreakingNews.find().sort({ createdAt: -1 });
    const editItemId = req.query.editId;
    let editItem = null;

    if (editItemId) {
      editItem = await BreakingNews.findById(editItemId);
    }

    res.render("breakingnews", {
      items: news,
      editItem: editItem,
    });
  } catch (err) {
    next(err);
  }
};
