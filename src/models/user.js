const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const Task = require('./task')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    cpf: {
      type: String,
      required: true
    },
    companyName: {
      type: String,
      required: true
    },
    cnpj: {
      type: String,
      required: true
    },
    cep: {
      type: String,
      required: true
    },
    email: {
      lowercase: true,
      type: String,
      unique: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Unvalid email');
        }
      }
    },
    //cpf nome nomeEmpresa cnpj cep
    password: {
      type: String,
      required: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password must not be "password".');
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

UserSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

UserSchema.methods.toJSON = function() {
  const user = this;

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  //delete userObject.avatar

  return userObject;
};

UserSchema.methods.generateAuthToken = async function() {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

UserSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

UserSchema.pre('remove', async function(next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model('User', UserSchema);
// const UserSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     cpf: {
//         type: String,
//         required: true
//     },
//     companyName: {
//         type: String,
//         required: true
//     },
//     cnpj: {
//         type: String,
//         required: true
//     },
//     cep: {
//         type: String,
//         required: true
//     },
//     email: {
//         lowercase: true,
//         type: String,
//         unique: true,
//         required: true,
//         validate(value) {
//             if(!validator.isEmail(value)) {
//                 throw new Error('Unvalid email')
//             }
//         }
//     },
//     //cpf nome nomeEmpresa cnpj cep
//     password: {
//         type: String,
//         required: true,
//         minlength: 7,
//         validate(value) {
//             if (value.toLowerCase().includes('password')) {
//                 throw new Error('Password must not be "password".')
//             }
//         }
//     },
//     tokens: [{
//         token: {
//             type: String,
//             required: true
//         }
//     }]
// }, {
//     timestamps: true
// })

// UserSchema.virtual('tasks', {
//     ref: 'Task',
//     localField: '_id',
//     foreignField: 'owner'
// })

// UserSchema.methods.toJSON = function (){
//     const user = this

//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens
//     //delete userObject.avatar

//     return userObject
// }

// UserSchema.methods.generateAuthToken = async function (){
//     const user = this

//     const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
//     user.tokens =  user.tokens.concat({ token })
//     await user.save()

//     return token
// }

// UserSchema.statics.findByCredentials = async (email, password) => {
//     const user = await User.findOne({email})

//     if(!user){
//         throw new Error('Unable to login')
//     }

//     const isMatch = await bcrypt.compare(password, user.password)

//     if(!isMatch){
//         throw new Error('Unable to login')
//     }

//     return user
// }

// UserSchema.pre('save', async function(next) {
//     const user = this

//     if(user.isModified('password')){
//         user.password = await bcrypt.hash(user.password, 8)
//     }

//     next()
// })

// UserSchema.pre('remove', async function (next) {
//     const user = this
//     await Task.deleteMany({ owner: user._id })
//     next()
// })

// const User = mongoose.model('User', UserSchema)

module.exports = User;
