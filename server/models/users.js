import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    picture: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {

        this.password = await bcrypt.hash(this.password, 10) // Hashing
    }
    next()
})

// Hash password before updating

userSchema.pre('findOneAndUpdate', async function(next) {

    const update = this.getUpdate()

    if (update.$set && update.$set.password) {
        update.$set.password = await bcrypt.hash(update.$set.password, 10)
    }

    next()
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

export default mongoose.model('User', userSchema)