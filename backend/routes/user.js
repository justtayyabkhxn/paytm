const express = require('express');
const jwt = require("jsonwebtoken")

const { authMiddleware } = require("../middleware");
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const existingUser = await User.findOne({
        username: req.body.username
    })
    if (existingUser) {
        return res.status(411).json({
            message: "EMail is already taken/Incorrect inputs"
        })
    }
    const user = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
    })

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 1000
    })
    console.log("New User " + user)

    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        message: "User created Succesfully",
        token: token
    })
})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        console.log("New Login: " + user);

        res.json({
            token: token
        })
        return;
    }
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = zod.object({
    paassword: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.post("/", authMiddleware, async (req, res) => {
    // Validate the request body
    const result = updateBody.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: result.error.errors, // Include validation errors
        });
    }

    try {
        // Update user information
        await User.updateOne({ _id: req.userId }, result.data);

        res.json({
            message: "Updated Successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});


router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstName: {
                "&regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        }))
    })
})

router.post("/getUser", async (req, res) => {
    try {
        const {userId} = req.body; 
        // console.log("User Id Recieved: "+userId)// Assumes req.userId is set, e.g., via middleware
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // console.log(user);
        res.json({
            user: user,
        });
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/getallUsers", async (req, res) => {
    try {
        const users = await User.find({ });

        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }

        // console.log(users);
        res.json({
            users: users,
        });
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;