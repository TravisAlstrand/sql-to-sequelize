const express = require("express");
const router = express.Router();
const { User, BlogPost } = require("../models");
const { asyncHandler } = require("../middleware/asyncHandler");
const { sequelize } = require("../models/index");

// router.get('/allBlogs', asyncHandler(async (req, res) => {
//   try {
//     const results = await sequelize.query('SELECT * FROM BlogPosts JOIN Users ON BlogPosts.userId = Users.id');
//     res.json(results);
//   } catch (error) {
//     res.status(500).json({ error: `${error}` });
//   }
// }));

router.get(
  "/allBlogs",
  asyncHandler(async (req, res) => {
    try {
      const results = await BlogPost.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: {
          model: User,
          as: "author",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
      });
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  })
);

router.get(
  "/slackers",
  asyncHandler(async (req, res) => {
    try {
      const results = await sequelize.query(`
    SELECT id, title, body
    FROM BlogPosts AS bp
    JOIN(
        SELECT userId, COUNT(*) AS postCount
          FROM BlogPosts
          GROUP BY userId
          ORDER BY postCount ASC
          LIMIT 1
      ) AS userPosts ON bp.userId = userPosts.userId
    `);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  })
);

module.exports = router;
