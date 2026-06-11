const swaggerJsdoc = require("swagger-jsdoc");
const path = require('path');

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "YumVerse API",
            version: "1.0.0",
            description: "YumVerse REST API for recipe sharing, user authentication, recipe management, reviews, likes, follows and saved recipes."
        },

        servers: [
            {
                url: "http://localhost:3000/api/v1",
                description: "Development Server"
            },
            {
                url: "https://yumverse-api.onrender.com/api/v1",
                description: "Production Server"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },

        tags: [
            {
                name: "Authentication",
                description: "Authentication APIs"
            },
            {
                name: "Users",
                description: "User management APIs"
            },
            {
                name: "Recipes",
                description: "Recipe management APIs"
            },
            {
                name: "Reviews",
                description: "Recipe review APIs"
            },
            {
                name: "Likes",
                description: "Recipe like APIs"
            },
            {
                name: "Follow",
                description: "User follow APIs"
            },
            {
                name: "Categories",
                description: "Category APIs"
            },
            {
                name: "Sub Categories",
                description: "Sub category APIs"
            }
        ]
    },

    apis: [path.join(__dirname, "*.swagger.js")]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;