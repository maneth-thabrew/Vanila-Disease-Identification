const firebase = require('../db');
const admin = require('firebase-admin');
const httpStatus = require('http-status');
const { Router } = require("express");
const { Status } = require("../values/variables");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const router = Router();
const firestore = firebase.firestore();

router.get("/", async (req, res) => {
  try {
    const querySnapshot = await firestore.collection("harvest").orderBy("date").get();
    const harvests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.send(harvests).status(httpStatus[200]);
  } catch (error) {
    console.error(error);
  }
});

router.post("/add", async (req, res) => {
  const { date, harvest, revenue, user } = req.body;
  const customId = `${date}_${user}`;
  await firestore.collection("harvest").doc(customId).set({
    date,
    harvest,
    revenue,
    user
  }).then(() => {
    res.status(httpStatus.CREATED).send({message: "Record on harvest Entered"});
  }).catch((ex) => {
    res.send({message: ex}).status(httpStatus[503]);
  })
  
});


router.get("/delete/:id", async (req, res) => {
  await firestore.collection("harvest").doc(req.params.id).delete();
  res.send({message: "Harvest record Deleted Successfully"}).status(httpStatus[200]);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const querySnapshot = await firestore.collection("harvest").doc(id).get().then((doc) => {
      res.send(doc).status(httpStatus[200]);
    })
  } catch (error) {
    res.send({message: "Server Error has occurred"}).status(httpStatus[503]);
  }
});



module.exports = router;
