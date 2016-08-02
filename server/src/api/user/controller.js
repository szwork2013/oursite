import passport from 'passport'
import jwt from 'jsonwebtoken'
import User from './model'
import config from '../../config/environment'

const validationError = function(res, err) {
  return res.status(422).json(err)
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index (req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).send(err)
    res.status(200).json(users)
  })
}

/**
 * Creates a new user
 */
export function create (req, res) {
  var newUser = new User(req.body)

  newUser.provider = 'local'
  newUser.role = 'user'
  
  newUser.save((err, user) => {
    if (err) return validationError(res, err)
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresIn: '2 days' })
    res.json({ token: token })
  })
}

/**
 * Get a single user
 */
export function show (req, res, next) {
  var userId = req.params.id

  User.findById(userId, function (err, user) {
    if (err) return next(err)
    if (!user) return res.status(401).send('Unauthorized')
    res.json(user.profile)
  })
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy (req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err)
    return res.status(204).send('No Content')
  })
}

/**
 * Change a users password
 */
export function changePassword (req, res, next) {
  var userId = req.user._id
  var oldPass = String(req.body.oldPassword)
  var newPass = String(req.body.newPassword)

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass
      user.save(function(err) {
        if (err) return validationError(res, err)
        res.status(200).send('OK')
      })
    } else {
      res.status(403).send('Forbidden')
    }
  })
}

/**
 * Get my info
 */
export function me (req, res, next) {
  var userId = req.user._id
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err)
    if (!user) return res.status(401).send('Unauthorized')
    res.json(user)
  })
}

/**
 * Authentication callback
 */
export function authCallback (req, res, next) {
  res.redirect('/')
}
