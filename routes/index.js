const express = require("express");
const router = express.Router();
const { User, BlogPost } = require("../models");
const { asyncHandler } = require("../middleware/asyncHandler");
const { sequelize } = require("../models/index");
const { literal } = require("sequelize");

/* ============================================ */
/* ============ GET ALL BLOG POSTS ============ */
/* ============================================ */

router.get(
  "/blogposts",
  asyncHandler(async (req, res) => {
    try {
      const results = await sequelize.query(`
        SELECT BlogPosts.id, title, body, userId, Users.username
        FROM BlogPosts
        JOIN Users ON BlogPosts.userId = Users.id
      `);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  })
);

// router.get(
//   "/blogposts",
//   asyncHandler(async (req, res) => {
//     try {
//       const results = await

//       res.json(results);
//     } catch (error) {
//       res.status(500).json({ error: `${error}` });
//     }
//   })
// );

/* ============================================ */
/* ============ POST NEW BLOG POST ============ */
/* ============================================ */

router.post(
  "/blogposts",
  asyncHandler(async (req, res) => {
    try {
      await sequelize.query(
        `INSERT INTO BlogPosts (title, body, userId) VALUES ('${req.body.title}', '${req.body.body}', ${req.body.userId})`
      );
      res.status(201).end();
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  })
);

// router.post(
//   "/blogposts",
//   asyncHandler(async (req, res) => {
//     try {
//       await BlogPost.create(req.body);
//       res.status(201).end();
//     } catch (error) {
//       res.status(500).json({ error: `${error}` });
//     }
//   })
// );

/* ==================================================== */
/* ============ GET ALL BLOG POSTS BY USER ============ */
/* ==================================================== */

router.get(
  "/user/:name",
  asyncHandler(async (req, res) => {
    const name = req.params.name.toLowerCase();
    const titledName = titleCase(name);
    const user = await User.findOne({ where: { username: titledName } });
    if (user) {
      try {
        const results = await sequelize.query(`
            SELECT BlogPosts.id, title, body, userId, Users.username
            FROM BlogPosts
            JOIN Users ON BlogPosts.userId = Users.id
            Where Users.username = '${user.username}'
          `);
        res.json(results);
      } catch (error) {
        res.status(500).json({ error: `${error}` });
      }
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  })
);

// router.get(
//   "/user/:name",
//   asyncHandler(async (req, res) => {
//     const name = req.params.name.toLowerCase();
//     const titledName = titleCase(name);
//     const user = await User.findOne({ where: { username: titledName } });
//     if (user) {
//       try {
//         const results = await

//         res.json(results);
//       } catch (error) {
//         res.status(500).json({ error: `${error}` });
//       }
//     } else {
//       res.status(404).json({ message: "User not found!" });
//     }
//   })
// );

/* ==================================================== */
/* ============ GET ALL BLOG POSTS BY USER ============ */
/* ================ WITH LEAST ENTRIES ================ */

router.get(
  "/slacker",
  asyncHandler(async (req, res) => {
    try {
      const results = await sequelize.query(`
        SELECT bp.id, bp.title, bp.body, bp.userId, u.username
        FROM BlogPosts AS bp
        JOIN(
            SELECT userId, COUNT(*) AS postCount
            FROM BlogPosts
            GROUP BY userId
            ORDER BY postCount ASC
            LIMIT 1
        ) AS userPosts ON bp.userId = userPosts.userId
        JOIN Users AS u ON bp.userId = u.id;
      `);
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
//       const results = await

//       res.json(results);
//     } catch (error) {
//       res.status(500).json({ error: `${error}` });
//     }
//   })
// );

const titleCase = (name) => {
  let firstLetter = name.charAt(0);
  const remainingLetters = name.substring(1);
  firstLetter = firstLetter.toUpperCase();
  return firstLetter + remainingLetters;
};

module.exports = router;
