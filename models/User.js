import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
username: String,
email: String,
password: String,
phone: String,
role: { type: String, default: 'rider' }
});


const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;