require('dotenv').config();
const express = require("express");
const cors = require("cors");

const clubRouter = require('./routes/clubRoutes');
const reviewsRouter = require('./routes/reviewsRoute');
const universityRouter = require("./routes/universityRoute");
const reportsRouter = require("./routes/reportsRoutes");
const userRouter = require("./routes/userRoutes");

const { createRouteHandler } = require("uploadthing/express");
const { uploadRouter } = require("./routes/uploadthing");
const verifyToken = require('./verifyToken');

const app = express();
const port = 5432;
const pool = require("./db");

// Middleware
app.use(
  cors({
    origin: `https://ratemyclub-frontend-production.up.railway.app`,
    credentials: true,
  })
);

// Apply the verifyToken middleware to protect your routes
app.use('/clubs', clubRouter);
app.use('/reviews', reviewsRouter);
app.use('/universities', universityRouter);
app.use('/reports', reportsRouter);
app.use('/user', userRouter);

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter
  })
);

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
