const express = require('express');
const router = express.Router();
const sql = require('../dbConnection');
const {ensureAuthenticated} = require('../helpers')


/* GET home page. */
router.get('/', 
 function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/games')
  } else {
  res.render('login');
  }
});

router.get('/signup', 
 function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/games')
  } else {
  res.render('signup');
  }
});

router.get('/games', ensureAuthenticated, async function(req, res, next) {
  let games = await sql`
      SELECT
      games.id,
      games.title,
      games.description,
      games.image_link,
      games.created_at,
      COUNT(reviews.id) AS review_amount,
      COALESCE(AVG(reviews.review), 0) AS average_review,
      MAX(CASE WHEN reviews.reviewer_user_id = ${req.user.id} THEN reviews.review ELSE NULL END) AS user_review
    FROM
      games
    LEFT JOIN
      reviews ON games.id = reviews.reviewed_game_id
    GROUP BY
      games.id, games.title, games.description, games.image_link, games.created_at
    ORDER BY
      games.created_at DESC;

  `;

  res.render('games', { username: 'Maciej Moczała', games });
});

router.post('/review', ensureAuthenticated, async function(req, res, next) {
  const userId = req.user.id;

  const hasReviewed = (await sql`
    SELECT EXISTS (
      SELECT 1
      FROM reviews
      WHERE reviewer_user_id = ${userId}
        AND reviewed_game_id = ${req.body.gameId}
  ) AS has_reviewed;
  `)[0].has_reviewed;
  
  if (!hasReviewed)
    await sql`
    INSERT INTO reviews (reviewer_user_id, reviewed_game_id, review)
    VALUES (${userId}, ${req.body.gameId}, ${req.body.review});
    `;
  res.redirect('/games')
});

module.exports = router;
