const { createUploadthing } = require("uploadthing/express");

const express = require('express');
const photoRouter = express.Router();
const pool = require('../db');
photoRouter.use(express.json());


const f = createUploadthing();

console.log("in uploadthing");

const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "10MB",
      maxFileCount: 3,
    },
  }).onUploadComplete( async (data) => {
    console.log("upload completed", data);
  }),
};

module.exports = {
  uploadRouter
};
