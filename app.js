require("dotenv").config();
const express = require("express");
const app = express();
require("./connection");
app.use(express.json());
const {User} = require('./model/user')
const {Client} = require('./model/user')
const {Order} = require('./model/user')
const auth = require("./middleware/auth");
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const bodyParser = require('body-parser')
const multer = require('multer');
const upload = multer();
const cors = require('cors');
const crypto = require("crypto");
app.use(cors());



//routes
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(upload.array())
app.use(express.static(__dirname +'/public'))
app.set('views',path.join(__dirname,'./views'));
app.set("view engine", "ejs")

app.get("/index.ejs",auth, (req, res) => res.render("index",{detailsindex:null}))
app.get("/Cuestomer.ejs",auth, (req, res) => res.render("Cuestomer"))
app.get("/form.ejs",auth, (req, res) => res.render("form"))


app.get("/table.ejs",auth, (req, res) => res.render("table",{details:null}))
app.get("/orderform.ejs",auth,(req, res) => res.render("orderform",{dropdownVals:null,uniqueid}))
app.get("/Existingtable.ejs",auth,(req, res) => res.render("Existingtable",{details:null}))
app.get("/orderall/:oid",auth,(req,res) => res.render("orderall",{detailss:null}))
app.get("/Orderall.ejs",auth, (req, res) => res.render("Orderall",{detailss:null}))





//register
app.post("/register", async (req, res) => {
    try {
        const { username,  email, password } = req.body;
        if (!(email && password && username )) {
          res.status(400).send("All input is required");
        }
        const oldUser = await User.findOne({ email });
    
        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
        const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = await User.create({
          username,
          email: email.toLowerCase(),
          password: hashedPassword,
        });
    
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "72h",
          }
        );

        // save user token
        user.token = token;
        res.cookie("jwt",token, {
            expires:new Date(Date.now() + 300000),
            httpOnly:true,
        })
        // return new user
        res.status(201).json(user);
      } catch (err) {
        console.log(err);
      }
    });
    //login
    app.post("/login", async (req, res) => {
        try {
          const { email, password } = req.body;
          if (!(email && password)) {
            res.status(400).send("All input is required");
          }
          const user = await User.findOne({ email });
      
          if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
              { user_id: user._id, email },
              process.env.TOKEN_KEY,
              {
                expiresIn: "2h",
              }
            );
            user.token = token;
            res.cookie("jwt",token, {
                expires:new Date(Date.now() + 300000000),
                httpOnly:true,
            })
            res.status(200).render('index',{detailsindex:null});
          }
          res.status(400).send("Invalid Credentials");
        } catch (err) {
          console.log(err);
        }
      });
    //add client
        app.post("/add", async (req, res,next) => {
         try {
             const {name,station,delivery, rate, pipes,referral } = req.body;
             if (!(name&&station&&delivery&& rate&& pipes)) {
              res.write('<script>window.alert("Please Fill All Required Field");window.location="/form.ejs";</script>');
              return false;
            }
             const client = await Client.create({
               name,
               station,
               delivery,
               rate,
               pipes,
               referral
            });
            console.log(client)
            client.save((err) => {
                if(err) {
                    return next(err)
                }
                res.write('<script>window.alert("Add Successfully");window.location="/form.ejs";</script>');
            })
          } catch (err) {
            console.log(err);  
          }
        });
        //////orderadd
        app.post("/ad", async (req, res,next) => {
          try {
               const {oid, name, date, size, quantity, stamp,length,patta} = req.body;
               if (!(name && date && size && quantity && stamp && length && patta)) {
                res.write('<script>window.alert("Please Fill All Required Field");window.location="/get";</script>');
                return false;
              }
              const order = await Order.create({
                oid,
                name,
                date,
                size,
                quantity,
                stamp,
                length,
                patta
             });
             console.log(order)
             order.save((err) => {
                 if(err) {
                     return next(err)
                 }
                 res.write('<script>window.alert("Add Successfully");window.location="/get";</script>');
             })
           } catch (err) {
             console.log(err);
           }
         });
        //Client get
        app.get("/getdetails", function (req, res) {   
            Client.find({}, function (err, allDetails) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("table", { details: allDetails })
                }
            })
        })
        //get client index
        app.get("/getdetailsindex", function (req, res) {   
          Client.find({}, function (err, allDetailsindex) {
              if (err) {
                  console.log(err);
              } else {
                  res.render("index", { detailsindex: allDetailsindex })
              }
          })
      })
      // view client list index page 
      app.get("/", auth, function (req, res) {   
        Client.find({}, function (err, allDetailsindex) {
            if (err) {
                console.log(err);
            } else {
                res.render("index", { detailsindex: allDetailsindex })
            }
        })
    })
    
    app.get("/login",auth, function (req, res) {   
      Client.find({}, function (err, allDetailsindex) {

          if (err) {
              console.log(err);
          } else {
              res.render("index", { detailsindex: allDetailsindex })
          }
      })
  })
        ///add order
        app.post("/ad", auth, async (req, res,next) => {
          try {
               const {oid, name, date, size, quantity, stamp,length,patta} = req.body;
               if (!(name && date && size && quantity && stamp && length && patta)) {
                res.write('<script>window.alert("Please Fill All Required Field");window.location="/get";</script>');
                return false;
              }
              const order = await Order.create({
                oid,
                name,
                date,
                size,
                quantity,
                stamp,
                length,
                patta
             });
             console.log(order)
             order.save((err) => {
                 if(err) {
                     return next(err)
                 }
                 res.write('<script>window.alert("Add Successfully");window.location="/get";</script>');
             })
           } catch (err) {
             console.log(err);
           }
         });
        ////order get
        app.get("/get",auth, function (req, res) { 
  const uniqueid = crypto.randomInt(10000,900000);
  console.log(uniqueid);  
          Client.find({}, function (err, allDetails) {
              if (err) {
                  console.log(err);
              } else {
                  res.render("orderform", { dropdownVals: allDetails,uniqueid })
              }
          })
      })

     // order view
      app.get("/getorder",auth, function (req, res) {   
        Order.find({}, function (err, allDetails) {
            if (err) {
                console.log(err);
            } else {
                res.render("Existingtable",{details:allDetails})
            }
        })
    })
    ///view all details
     app.get("/getorders/:oid",auth, async function (req, res) {  
    const oid=req.params.oid;
    const data= await Order.find({oid:oid}).exec();
    res.render("Orderall", { detailss:data});
  })
   ///update///
   app.get('/update/:_id',auth, async (req, res, next) => {
    const usid = req.params._id
    Client.updateOne({_id:usid}, (err, doc) => {
        if (!err) {
            res.redirect('back');
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
    });
 })
    //delete clinet
    app.get("/delete/:_id", auth, function(req, res, next) {
       const userid = req.params._id
      Client.findByIdAndRemove({_id:userid}, (err, doc) => {
          if (!err) {
              res.redirect('back');
          } else {
              console.log('Failed to Delete user Details: ' + err);
          }
      });
   })
   ///delete order 
   app.get("/delet/:oid", auth, function(req, res, next) {
    const uid = req.params.oid;
   Order.deleteOne({"oid":uid}, (err, doc) => {
       if (!err) {
           res.redirect('back');
       } else {
           console.log('Failed to Delete user Details: ' + err);
       }
   });
})


app.get("/logout", auth, function(req, res, next) {
  
})


//export
    module.exports = app;