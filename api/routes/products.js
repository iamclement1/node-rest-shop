const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/products');

router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Products fetched successfully',
        result
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
});

router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  })
  product.save()
    .then((result) => {
      console.log(result)
      res.status(201).json({
        message: 'Products created successfully',
        createdProduct: result
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        error: error
      })
    });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: 'No valid data found for this product with id'
        })
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {}
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, {
    $set: updateOps
  })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    })
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Product deleted successfully',
        result
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ err: err });
    });
})
module.exports = router;