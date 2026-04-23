import swaggerJSDoc from "swagger-jsdoc";

const swaggerServerUrl =
  process.env.SWAGGER_SERVER_URL || process.env.PUBLIC_API_URL || "/";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IssueFlow - Issue Tracker API",
      version: "1.0.0",
      description:
        "API documentation for the issue management system IssueFlow.",
    },
    servers: [
      {
        url: swaggerServerUrl,
        description: "API Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
