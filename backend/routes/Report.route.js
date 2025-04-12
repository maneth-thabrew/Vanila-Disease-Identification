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
    const querySnapshot = await firestore.collection("reports").get();
    const reports = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.send(reports).status(httpStatus[200]);
  } catch (error) {
    console.error(error);
  }
});

router.get("/ofUser/:user", async (req, res) => {
  let user = req.params.user;
  try {
    const querySnapshot = await firestore.collection("reports").where("reportedBy", "==", user).get();
    const reports = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.send(reports).status(httpStatus[200]);
  } catch (error) {
    console.error(error);
  }
});

router.post("/add", async (req, res) => {
  const { date, cause, reportedBy } = req.body;
  const customId = `${date}_${firestore.collection("reports").doc().id}`;
  await firestore.collection("reports").doc(customId).set({
    date,
    cause,
    reportedBy
  }).then(() => {
    res.status(httpStatus.CREATED).send({message: "Report Entered"});
  }).catch((ex) => {
    res.send({message: ex}).status(httpStatus[503]);
  })
  
});


router.get("/delete/:id", async (req, res) => {
  await firestore.collection("reports").doc(req.params.id).delete();
  res.send({message: "Report Deleted Successfully"}).status(httpStatus[200]);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const querySnapshot = await firestore.collection("reports").doc(id).get().then((doc) => {
      res.send(doc).status(httpStatus[200]);
    })
  } catch (error) {
    res.send({message: "Server Error has occurred"}).status(httpStatus[503]);
  }
});



module.exports = router;
