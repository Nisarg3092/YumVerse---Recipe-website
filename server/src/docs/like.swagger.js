/**
 * @swagger
 * /likes/{recipeId}:
 *   post:
 *     summary: Like a recipe
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe liked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Recipe not found
 *
 *   delete:
 *     summary: Unlike a recipe
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe unliked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Recipe not found
 */