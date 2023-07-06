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
