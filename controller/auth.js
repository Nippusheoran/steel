// const User = require('../model/user')

// exports.register = async (req, res, next) => {
//   const { username,email, password } = req.body
//   if (password.length < 6) {
//     return res.status(400).json({ message: "Password less than 6 characters" })
//   }
//   try {
//     await User.create({
//       username,
//       email,
//       password,
//     }).then(user =>
//       res.status(200).json({
//         message: "User successfully created",
//         user,
//       })
//     )
//   } catch (err) {
//     res.status(401).json({
//       message: "User not successful created",
//       err: err.mesage,
//     })
//   }
// }
