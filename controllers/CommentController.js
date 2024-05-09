import CommentModel from "../models/Comment.js";

export const addComment = async (req, res) => {
    try {

        const doc = new CommentModel({
            user: req.userId,
            text: req.body.text,
            postId: req.body.postId
        });

        const comment = await doc.save();

        res.json(comment);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать комментарий!"
        })
    }
}

export const getAllComments = async (req, res) => {
    try {
        const comments = await CommentModel.find().populate('user').exec();
        res.json(comments)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить список комментариев!"
        })
    }

};

export const getCommentsByPostId = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await CommentModel.find({ postId: postId }).populate('user').exec();

        return res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить список комментариев для поста!"
        })
    }
}