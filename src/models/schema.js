import { Schema } from 'mongoose'

const minlength = 3
const maxlength = 40

// User Schema
export const user = {
  name: {
    type: String,
    required: true,
    trim: true,
    minlength,
    maxlength,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  isConfirmed: {
    type: Boolean,
    default: false
  }
}

// Post Schema
export const post = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      text: {
        type: String,
        trim: true,
        required: true
      },
      name: {
        type: String,
        trim: true
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
}

// Profile Schema
export const profile = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  handle: {
    type: String,
    required: true,
    minlength,
    maxlength,
    trim: true
  },
  company: {
    type: String,
    minlength,
    maxlength,
    trim: true
  },
  website: {
    type: String,
    minlength,
    maxlength,
    trim: true
  },
  location: {
    type: String,
    minlength,
    maxlength,
    trim: true
  },
  status: {
    type: String,
    minlength,
    maxlength,
    trim: true,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String,
    trim: true,
    minlength: 10,
    maxlength: 400
  },
  githubusername: {
    type: String,
    trim: true,
    maxlength
  },
  experience: [
    {
      title: {
        type: String,
        minlength,
        maxlength,
        trim: true,
        required: true
      },
      company: {
        type: String,
        minlength,
        maxlength,
        trim: true,
        required: true
      },
      location: {
        type: String,
        minlength,
        maxlength,
        trim: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String,
        minlength: 10,
        maxlength: 400,
        trim: true
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        minlength,
        maxlength,
        trim: true,
        required: true
      },
      degree: {
        type: String,
        minlength,
        maxlength,
        trim: true,
        required: true
      },
      fieldofstudy: {
        type: String,
        minlength,
        maxlength,
        trim: true,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String,
        minlength: 10,
        maxlength: 400,
        trim: true
      }
    }
  ],
  social: {
    youtube: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    facebook: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    }
  }
}
