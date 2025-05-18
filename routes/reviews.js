const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/authenticateToken');

// GET /api/reviews — get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { id: true, username: true } },
        item: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// GET /api/reviews/:reviewId — get single review by id
router.get('/:reviewId', async (req, res) => {
  const reviewId = parseInt(req.params.reviewId);

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: { select: { id: true, username: true } },
        item: { select: { id: true, name: true } }
      }
    });

    if (!review) return res.status(404).json({ error: 'Review not found' });

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// GET /api/reviews/user/:userId — get all reviews by a specific user
router.get('/user/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        item: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
});

// POST /api/reviews — create a new review (authenticated)
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { itemId, rating, title, content } = req.body;

  try {
    const newReview = await prisma.review.create({
      data: {
        userId,
        itemId,
        rating,
        title,
        content,
      }
    });
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// PUT /api/reviews/:reviewId — update a review (authenticated & authorized)
router.put('/:reviewId', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const reviewId = parseInt(req.params.reviewId);
  const { rating, title, content } = req.body;

  try {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.userId !== userId) return res.status(403).json({ error: 'Unauthorized' });

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { rating, title, content }
    });

    res.json(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE /api/reviews/:reviewId — delete a review (authenticated & authorized)
router.delete('/:reviewId', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const reviewId = parseInt(req.params.reviewId);

  try {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.userId !== userId) return res.status(403).json({ error: 'Unauthorized' });

    await prisma.review.delete({ where: { id: reviewId } });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
