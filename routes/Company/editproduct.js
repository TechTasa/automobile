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

    router.get("/product/:userId/:productId", async (req, res) => {
      const userId = req.params.userId;
      const productId = req.params.productId;
      // console.log(userId, productId);
      // Find the product in the database
      const product = await productsCollection.findOne({
        _id: new ObjectId(productId),
        createdBy: userId,
      });

      // Render the 'edit-product' view and pass the product data to it
      res.render("editProduct", { product: product, user: userId });
    });

    router.post(
      "/product/:userId/:productId",
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
        const productId = req.params.productId;
        // console.log("File PAth", req.file.path);
        // Assuming 'cover' is the name of the form field in your client-side form
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
        // Get the updated product data from the request body
        const updatedProductData = req.body;
        // console.log(updatedProductData);
        // Update the product in the database
        await productsCollection.updateOne(
          { _id: new ObjectId(productId), createdBy: userId },
          { $set: updatedProductData }
        );

        // Redirect to the product page (or wherever you want)
        res.redirect(`/product/${userId}/${productId}`);
      }
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
