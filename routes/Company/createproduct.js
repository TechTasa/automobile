const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../../db");
const { ObjectId } = require("mongodb");
const multer = require("multer");

const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/cars/';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

(async () => {
  try {
    const userCollection = await getCollection("users");
    const productsCollection = await getCollection("products");

    router.get("/product/create/:userId", async (req, res) => {
      const userId = req.params.userId;
      // console.log(userId);
      
      res.render("createProduct", { user: userId });
    });

    router.post(
      "/product/create/:userId",
      upload.fields([
        { name: "mainImage", maxCount: 1 },
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 },
        { name: "image5", maxCount: 1 },
        { name: "image6", maxCount: 1 },
      ]),
      async (req, res) => {
        const userId = req.params.userId;

        // Assuming 'logo' is the name of the form field in your client-side form
        // req.body.logo = req.files.map((file) => file.path);
        if (req.files["mainImage"]) {
          req.body.mainImage = req.files["mainImage"][0].path;
        }
        if (req.files["image1"]) {
          req.body.image1 = req.files["image1"][0].path;
        }
        if (req.files["image2"]) {
          req.body.image2 = req.files["image2"][0].path;
        }
        if (req.files["image3"]) {
          req.body.image3 = req.files["image3"][0].path;
        }
        if (req.files["image4"]) {
          req.body.image4 = req.files["image4"][0].path;
        }
        if (req.files["image5"]) {
          req.body.image5 = req.files["image5"][0].path;
        }
        if (req.files["image6"]) {
          req.body.image6 = req.files["image6"][0].path;
        }

        // Get the product data from the request body
        const newProductData = req.body;

        let offer = Number(req.body.offer);
        let price = Number(req.body.price);

        newProductData.createdBy = userId; // Add the createdBy field
        newProductData.price = price; // Add the createdBy field
        newProductData.offer = offer; // Add the createdBy field

        // Insert the new product into the database
        const result = await productsCollection.insertOne(newProductData);
        const productId = result.insertedId; // Get the id of the inserted product

        // Redirect to the product page (or wherever you want)
        res.redirect(`/products/${userId}`);
      }
    );

    // router.post(
    //   "/product/create/:userId",
    //   upload.single("logo"),
    //   async (req, res) => {
    //     const userId = req.params.userId;

    //     // Assuming 'logo' is the name of the form field in your client-side form
    //     req.body.logo = req.file.path;

    //     // Get the product data from the request body
    //     const newProductData = req.body;
    //     newProductData.createdBy = userId; // Add the createdBy field

    //     // Insert the new product into the database
    //     const result = await productsCollection.insertOne(newProductData);
    //     const productId = result.insertedId; // Get the id of the inserted product

    //     // Redirect to the product page (or wherever you want)
    //     res.redirect(`/products/${userId}`);
    //   }
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
