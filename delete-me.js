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

router.post(
  "/blogposts",
  asyncHandler(async (req, res) => {
    try {
      await BlogPost.create(req.body);
      res.status(201).end();
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  })
);

router.get(
  "/user/:name",
  asyncHandler(async (req, res) => {
    const name = req.params.name.toLowerCase();
    const titledName = titleCase(name);
    const user = await User.findOne({ where: { username: titledName } });
    if (user) {
      try {
        const results = await BlogPost.findAll({
          attributes: ["id", "title", "body", "userId"],
          include: [
            {
              model: User,
              as: "author",
              attributes: ["username"],
              where: {
                username: user.username,
              },
            },
          ],
        });
        res.json(results);
      } catch (error) {
        res.status(500).json({ error: `${error}` });
      }
    } else {
      res.status(404).json({ message: "User not found!" });
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
