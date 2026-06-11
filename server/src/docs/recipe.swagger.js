/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Recipes fetched successfully
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - cookingTime
 *               - difficulty
 *               - category
 *               - subCategory
 *               - ingredients
 *               - instructions
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 example: Creamy Tomato Pasta
 *
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Delicious creamy tomato pasta recipe
 *
 *               cookingTime:
 *                 type: number
 *                 minimum: 1
 *                 example: 20
 *
 *               difficulty:
 *                 type: string
 *                 enum:
 *                   - Easy
 *                   - Medium
 *                   - Hard
 *
 *               category:
 *                 type: string
 *                 example: 6a27da6e1965a4572375c62f
 *
 *               subCategory:
 *                 type: string
 *                 example: 6a29981502735af86768fb18
 *
 *               ingredients:
 *                 type: string
 *                 description: Enter ingredients separated by ||.
 *                 example: tomato || pasta || cream
 *
 *               instructions:
 *                 type: string
 *                 description: Enter instructions separated by ||.
 *                 example: Boil pasta || Add cream, salt, and pepper || Serve hot
 * 
 *               recipeImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /recipes/{slug}:
 *   get:
 *     summary: Get a single recipe by slug
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         example: creamy-tomato-pasta
 *         schema:
 *           type: string
 *         description: Recipe slug
 *     responses:
 *       200:
 *         description: Recipe fetched successfully
 *       404:
 *         description: Recipe not found
 */

/**
 * @swagger
 * /recipes/id/{recipeId}:
 *   patch:
 *     summary: Update recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 example: Creamy Tomato Pasta
 *
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Delicious creamy tomato pasta recipe
 *
 *               cookingTime:
 *                 type: number
 *                 minimum: 1
 *                 example: 20
 *
 *               difficulty:
 *                 type: string
 *                 enum:
 *                   - Easy
 *                   - Medium
 *                   - Hard
 *
 *               category:
 *                 type: string
 *                 example: 6a27da6e1965a4572375c62f
 *
 *               subCategory:
 *                 type: string
 *                 example: 6a29981502735af86768fb18
 *
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - tomato
 *                   - pasta
 *                   - cream
 *
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Boil pasta
 *                   - Prepare sauce
 *                   - Serve
 *
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Recipe not found
 *
 *   delete:
 *     summary: Delete recipe
 *     tags: [Recipes]
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
 *         description: Recipe deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Recipe not found
 */

/**
 * @swagger
 * /recipes/id/{recipeId}/images:
 *   patch:
 *     summary: Update recipe images
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               recipeImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Recipe images updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Recipe not found
 */

/**
 * @swagger
 * /recipes/id/{recipeId}/save:
 *   post:
 *     summary: Save recipe
 *     tags: [Recipes]
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
 *         description: Recipe saved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Recipe not found
 *
 *   delete:
 *     summary: Unsave recipe
 *     tags: [Recipes]
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
 *         description: Recipe unsaved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Recipe not found
 */