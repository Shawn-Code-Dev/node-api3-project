const User = require('../users/users-model')
const yup = require('yup')

function logger(req, res, next) {
  console.log(req.method, req.originalURL, Date.now())
  next()
}

async function validateUserId(req, res, next) {
  try {
    const userId = await User.getById(req.params.id)
    if (!userId) {
      next({ status: 404, message: 'user not found' })
    } else {
      req.user = userId
      next()
    }
  } catch (err) {
    next(err)
  }
}

const userSchema = yup.object().shape({
  name: yup
    .string()
    .typeError('Name must be a string')
    .trim()
    .required('missing required name field')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabetics are allowed for this field')
})

async function validateUser(req, res, next) {
  try {
    const user = await userSchema.validate(req.body)
    req.body = user
    next()
  } catch (err) {
    next({ status: 400, message: err.message })
  }
}

const postSchema = yup.object().shape({
  text: yup
    .string()
    .typeError('text must be a string')
    .trim()
    .required('missing required text field')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabetics are allowed for this field')
})

async function validatePost(req, res, next) {
  try {
    const post = await postSchema.validate(req.body)
    req.body = post
    next()
  } catch (err) {
    next({ status: 400, message: err.message })
  }
}
//eslint-disable-next-line
function errorHandling(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
  })
}

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
  errorHandling
}