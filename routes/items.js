const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/items — get all items
router.get('/', async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET /api/items/:itemId — get single item by id with averageRating
router.get('/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);

  try {
    // Fetch item
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        reviews: {
          select: { rating: true }
        }
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Calculate average rating
    const ratings = item.reviews.map(r => r.rating);
    const averageRating = ratings.length > 0
      ? ratings.reduce((acc, val) => acc + val, 0) / ratings.length
      : null;

    // Return item with averageRating
    res.json({ ...item, averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// GET /api/items/:itemId/reviews — get all reviews for one item with user info
router.get('/:itemId/reviews', async (req, res) => {
  const itemId = parseInt(req.params.itemId);

  try {
    // Validate item exists
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const reviews = await prisma.review.findMany({
      where: { itemId },
      include: {
        user: {
          select: { id: true, username: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
