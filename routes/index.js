const express = require("express");
const router = express.Router();
const { User, BlogPost } = require("../models");
const { asyncHandler } = require("../middleware/asyncHandler");
const { sequelize } = require("../models/index");
const { literal } = require("sequelize");

// router.get(
//   "/all-blogs",
//   asyncHandler(async (req, res) => {
//     try {
//       const results = await sequelize.query(`
//         SELECT BlogPosts.id, title, body, userId, Users.username
//         FROM BlogPosts
//         JOIN Users ON BlogPosts.userId = Users.id
//       `);
//       res.json(results);
//     } catch (error) {
//       res.status(500).json({ error: `${error}` });
//     }
//   })
// );

router.get(
  "/all-blogs",
  asyncHandler(async (req, res) => {
    try {
      const results = await BlogPost.findAll({
        attributes: ["id", "title", "body", "userId"],
        include: [
          {
            model: User,
            as: "author",
            attributes: ["username"],
          },
        ],
      });
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  })
);

// router.get(
//   "/brian",
//   asyncHandler(async (req, res) => {
//     try {
//       const results = await sequelize.query(`
//         SELECT BlogPosts.id, title, body, userId, Users.username
//         FROM BlogPosts
//         JOIN Users ON BlogPosts.userId = Users.id
//         Where Users.username = 'Brian'
//       `);
//       res.json(results);
//     } catch (error) {
//       res.status(500).json({ error: `${error}` });
//     }
//   })
// );

router.get(
  "/brian",
  asyncHandler(async (req, res) => {
    try {
      const results = await BlogPost.findAll({
        attributes: ["id", "title", "body", "userId"],
        include: [
          {
            model: User,
            as: "author",
            attributes: ["username"],
            where: {
              username: "Brian",
            },
          },
        ],
      });
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  })
);

// router.get(
//   "/slacker",
//   asyncHandler(async (req, res) => {
//     try {
//       const results = await sequelize.query(`
//         SELECT bp.id, bp.title, bp.body, bp.userId, u.username
//         FROM BlogPosts AS bp
//         JOIN(
//             SELECT userId, COUNT(*) AS postCount
//             FROM BlogPosts
//             GROUP BY userId
//             ORDER BY postCount ASC
//             LIMIT 1
//         ) AS userPosts ON bp.userId = userPosts.userId
//         JOIN Users AS u ON bp.userId = u.id;
//       `);
//       res.json(results);
//     } catch (error) {
//       res.status(500).json({ error: `${error}` });
//     }
//   })
// );

router.get(
  "/slacker",
  asyncHandler(async (req, res) => {
    try {
      const results = await BlogPost.findAll({
        attributes: ["id", "title", "body", "userId"],
        include: [
          {
            model: User,
            as: "author",
            attributes: ["username"],
          },
        ],
        where: {},
        order: [
          [
            literal(
              "(SELECT COUNT(*) FROM BlogPosts WHERE BlogPosts.userId = author.id)"
            ),
            "ASC",
          ],
        ],
        limit: 1,
      });
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  })
);

module.exports = router;
