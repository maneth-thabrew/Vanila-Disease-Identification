const firebase = require('../db');
const httpStatus = require('http-status');
const { Router } = require("express");
const { Status } = require("../values/variables");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const router = Router();
const firestore = firebase.firestore();




router.get("/", async (req, res) => {
  try {
    const querySnapshot = await firestore.collection("stocks").get();
    const stocks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.send(stocks).status(httpStatus[200]);
  } catch (error) {
    console.error(error);
  }
});

router.post("/add", async (req, res) => {
  const { name, code } = req.body;
  console.log(req.body);
  await firestore.collection("stocks").add({
    name,
    code
  }).then(() => {
    res.status(httpStatus.CREATED).send({message: "Stock Entered"});
  }).catch((ex) => {
    res.send({message: ex}).status(httpStatus[503]);
  })
  
});


router.get("/delete/:id", async (req, res) => {
  await firestore.collection("stocks").doc(req.params.id).delete();
  res.send({message: "Stock Deleted Successfully"}).status(httpStatus[200]);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const querySnapshot = await firestore.collection("stocks").doc(id).get().then((doc) => {
      res.send(doc).status(httpStatus[200]);
    })
  } catch (error) {
    res.send({message: "Server Error has occurred"}).status(httpStatus[503]);
  }
});



module.exports = router;
