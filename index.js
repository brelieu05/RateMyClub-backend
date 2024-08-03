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


const app = express();
const port = 5000;
const pool = require("./db");


// app.use(cors());
// app.use(express.json());

// app.use(
//   cors({
//     origin: `https://ratemyclub-frontend-production.up.railway.app`,
//     credentials: true,
//   }),
// );

// app.use(
//   cors({
//     origin: `https://ratemyclub.org`,
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: `http://localhost:5173`,
    credentials: true,
  }),
);





app.use('/clubs', clubRouter);
app.use('/reviews', reviewsRouter);
app.use('/universities', universityRouter);
app.use('/reports', reportsRouter);
app.use('/user', userRouter)

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter
  }),
);


app.listen(port, () => {
    console.log(`server has started on port ${port}`)
})