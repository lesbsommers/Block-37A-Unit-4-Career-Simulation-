const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/authenticateToken');

// Get all comments for a specific review (public)
router.get('/reviews/:reviewId/comments', async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Check if review exists
    const review = await prisma.review.findUnique({ where: { id: parseInt(reviewId) } });
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const comments = await prisma.comment.findMany({
      where: { reviewId: parseInt(reviewId) },
      orderBy: { createdAt: 'desc' },
    });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get comments.' });
  }
});

// Get all comments made by the logged-in user (protected)
router.get('/comments/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const comments = await prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get your comments.' });
  }
});

// Add a comment to a review (protected)
router.post('/reviews/:reviewId/comments', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;
    const { text } = req.body;

    // Verify review exists
    const review = await prisma.review.findUnique({ where: { id: parseInt(reviewId) } });
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const comment = await prisma.comment.create({
      data: {
        text,
        userId,
        reviewId: parseInt(reviewId),
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add comment.' });
  }
});

// Update a comment (protected, only owner)
router.put('/users/:userId/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const { userId, commentId } = req.params;
    const loggedInUserId = req.user.id;
    const { text } = req.body;

    if (parseInt(userId) !== loggedInUserId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const comment = await prisma.comment.findUnique({ where: { id: parseInt(commentId) } });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId !== loggedInUserId) return res.status(403).json({ message: 'Unauthorized' });

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { text },
    });

    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update comment.' });
  }
});

// Delete a comment (protected, only owner)
router.delete('/users/:userId/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const { userId, commentId } = req.params;
    const loggedInUserId = req.user.id;

    if (parseInt(userId) !== loggedInUserId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const comment = await prisma.comment.findUnique({ where: { id: parseInt(commentId) } });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId !== loggedInUserId) return res.status(403).json({ message: 'Unauthorized' });

    await prisma.comment.delete({ where: { id: parseInt(commentId) } });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete comment.' });
  }
});

module.exports = router;
