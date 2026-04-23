

const createPost = async (req, res) => {
    try {
        const userId = req.user._id;

        const {text, image} = req.body;
        if(!test && !image) return res.status(400).json({message: "Post must have text or image"})

        

    } catch (error) {

    }
}