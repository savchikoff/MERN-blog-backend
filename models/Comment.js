import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: String,
    postId: String
},
    {
        timestamps: true
    }
);

export default mongoose.model("Comment", CommentSchema);