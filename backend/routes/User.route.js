const firebase = require('../db');
const httpStatus = require('http-status');
const { Router } = require("express");
const { Status } = require("../values/variables");
const multer = require('multer');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const router = Router();
const firestore = firebase.firestore();


const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, '../fitness-app2/assets/images/uploads'); //../studio-client/public/upload
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

const fileFilter = (req, file, callback) => {
  if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'){
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage: storage, 
  limits: { 
    fileSize: 4 * 1024 * 1024
  },
  fileFilter: fileFilter
});

router.get("/", async (req, res) => {
  try {
    const querySnapshot = await firestore.collection("users").get();
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.send(users).status(httpStatus[200]);
  } catch (error) {
    console.error(error);
  }
});

router.post("/sign-up", async (req, res) => {
  const { username, fullName, contact, password, role, address, district } = req.body;
  console.log(req.body);
  await firestore.collection("users").add({
    username,
    fullName,
    contact,
    role,
    address,
    district,
    password: CryptoJS.AES.encrypt(
      password,
      'secreti'
    ).toString(),
    status: Status.DEACTIVATED
  }).then(() => {
    res.status(httpStatus.CREATED).send({message: "User Entered"});
  }).catch((ex) => {
    res.send({message: ex}).status(httpStatus[503]);
  })
  
});

// router.post("/sign-in", async (req, res) => {
//   const { username, password } = req.body;
//   let snap = await firestore.collection("users").where("username", "==", username).get();
//   if(snap.empty){
//     res.status(httpStatus.FORBIDDEN).send({message: "Username or Password Not Found", login: false});
//     return;
//   } else {
//     snap.docs.forEach((doc) => {
//       console.log(doc.data().password+'/'+password);
//       const hashedPassword = CryptoJS.AES.decrypt(
//         doc.data().password,
//         'secreti'
//       );
//       const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);


//       if(OriginalPassword == password) {
//         const accessToken = jwt.sign(
//           {
//             id: doc.id,
//             role: doc.data().role,
//           },
//           'secreti',
//           {expiresIn:"1d"}
//         );
//         res.send({message: "User Available", login: true, 
//         accessToken,
//         session: {user: {
//           id: doc.id,
//           data:doc.data()
//         }}}).status(httpStatus[201]);
//         res.end();
//       } else {
//         res.status(httpStatus.FORBIDDEN).send({message: "Email or Password is incorrect", login: false});
//       }
//     })
//   }
  
// });

// TEST This
router.post("/sign-in", async (req, res) => {
  const { username, password } = req.body;
  let snap = await firestore.collection("users").where("username", "==", username).get();
  
  if (snap.empty) {
    res.status(httpStatus.FORBIDDEN).send({ message: "Username or Password Not Found", login: false });
    return;
  }

  let loginSuccessful = false;
  let accessToken;
  let sessionData;

  snap.docs.forEach((doc) => {
    console.log(doc.data().password + '/' + password);
    const hashedPassword = CryptoJS.AES.decrypt(doc.data().password, 'secreti');
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword === password) {
      accessToken = jwt.sign(
        {
          id: doc.id,
          role: doc.data().role,
        },
        'secreti',
        { expiresIn: "1d" }
      );

      sessionData = {
        user: {
          id: doc.id,
          data: doc.data()
        }
      };

      loginSuccessful = true;
    }
  });

  if (loginSuccessful) {
    res.send({
      message: "User Available",
      login: true,
      accessToken,
      session: sessionData
    }).status(httpStatus[201]);
  } else {
    res.status(httpStatus.FORBIDDEN).send({ message: "Email or Password is incorrect", login: false });
  }
});

router.get("/delete/:id", async (req, res) => {
  await firestore.collection("users").doc(req.params.id).delete();
  res.send({message: "User Deleted Successfully"}).status(httpStatus[200]);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const querySnapshot = await firestore.collection("users").doc(id).get().then((doc) => {
      res.send(doc).status(httpStatus[200]);
    })
  } catch (error) {
    res.send({message: "Server Error has occurred"}).status(httpStatus[503]);
  }
});

router.post("/update/:id", async (req, res) => {
  console.log(req.body);

  const { username, fullName, contact, password, role, status } = req.body;
  const { id } = req.params;
  

  await firestore
    .collection("users")
    .doc(id)
    .update({ username, email, fullName, contact, password, role, location, status});
   res.send({message: "User Updated Successfully"}).status(httpStatus[200]);
});

router.post("/forgot-password", async (req, res) => {
  console.log(req.body);

  const { password, username, contact } = req.body;
  const userSnapshot = await firestore
    .collection("users")
    .where("username", "==", username)
    .where("contact", "==", contact)
    .get();

  if (userSnapshot.empty) {
    return res.status(404).send({ message: "User not found." });
  }
  const userDoc = userSnapshot.docs[0];

  try {
    await userDoc.ref.update({
      password: CryptoJS.AES.encrypt(password, 'secreti').toString()
    });

    // Sucess response
    return res.status(200).send({ message: "User password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).send({ message: "Error updating password." });
  }
});


router.post("/update/:id/location", async (req, res) => {
  console.log(req.body);

  const { location } = req.body;
  const { id } = req.params;
  

  await firestore
    .collection("users")
    .doc(id)
    .update({ location });
   res.send({message: "User Updated Successfully"}).status(httpStatus[200]);
});

router.post("/update/:id/uploadAvatar", async (req, res) => {
  console.log("Hii");
  console.log(req.files);
  let id = req.params;
  // const { image } = req.body; 
  // await firestore
  //   .collection("users")
  //   .doc(id)
  //   .update({ email, fullName, contact, password, role, status});
   res.send({message: "User Updated Successfully"}).status(httpStatus[200]);
})

module.exports = router;
