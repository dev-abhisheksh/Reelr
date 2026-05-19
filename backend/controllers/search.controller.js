import { User } from "../models/user.model.js";

const search = async (req, res) => {
    try {
        const { query, page = 1, limit = 10 } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({
                message: "Query parameter is required"
            });
        }

        const skip = (page - 1) * limit;

        const users = await User.find({
            $or: [
                {
                    username: {
                        $regex: query,
                        $options: "i"
                    }
                },
                {
                    fullName: {
                        $regex: query,
                        $options: "i"
                    }
                }
            ]
        })
            .select(
                "username fullName profileImage followersCount followingCount isPrivate"
            )
            .skip(skip)
            .limit(Number(limit));

        const totalUsers = await User.countDocuments({
            $or: [
                {
                    username: {
                        $regex: query,
                        $options: "i"
                    }
                },
                {
                    fullName: {
                        $regex: query,
                        $options: "i"
                    }
                }
            ]
        });

        res.status(200).json({
            success: true,
            currentPage: Number(page),
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            users
        });

    } catch (error) {
        console.error("Error in search controller:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export {
    search
};  