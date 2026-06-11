/**
 * @swagger
 * /subcategories/{categoryId}:
 *   get:
 *     summary: Get sub categories by category
 *     tags: [Sub Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: 6a27da6e1965a4572375c62e
 *     responses:
 *       200:
 *         description: Sub categories fetched successfully
 *       400:
 *         description: Invalid category id
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */