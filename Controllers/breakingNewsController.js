const BreakingNews = require("../models/BreakingNews");
const { Op } = require("sequelize");

exports.createBreakingNews = async (req, res, next) => {
  try {
    const { content } = req.body;

    const newNews = await BreakingNews.create({
      content,
    });

    // Redirect to breaking news view page after creation
    res.redirect("/breakingnews");
  } catch (err) {
    next(err);
  }
};

exports.getAllBreakingNews = async (req, res, next) => {
  try {
    const news = await BreakingNews.findAll({
      order: [["createdAt", "DESC"]],
    });

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
    const { id } = req.params; // Gets the id from URL parameters
    const updates = req.body; // Gets the updated data from request body

    const [updatedCount, [updatedNews]] = await BreakingNews.update(updates, {
      where: { id },
      returning: true,
    });

    if (updatedCount === 0) {
      // Render breakingnews view with error message if not found
      const news = await BreakingNews.findAll({
        order: [["createdAt", "DESC"]],
      });
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

    const news = await BreakingNews.findAll({
      where: {
        content: {
          [Op.iLike]: `%${keyword}%`,
        },
      },
      order: [["createdAt", "DESC"]],
    });

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
    const news = await BreakingNews.findAll({
      order: [["createdAt", "DESC"]],
    });
    const editItemId = req.query.editId;
    let editItem = null;

    if (editItemId) {
      editItem = await BreakingNews.findByPk(editItemId);
    }

    res.render("breakingnews", {
      items: news,
      editItem: editItem,
    });
  } catch (err) {
    next(err);
  }
};
