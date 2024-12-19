const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const z  = require("zod");
const router = express.Router();
const { User, Account } = require("../db/index");
const { authMiddleware } = require("../middleware/middleware");

const UserSchema = z.object({
    username: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
});

router.post('/signup', async (req,res) => {
    const { username, firstName, lastName, password } = req.body;
    const newUser = {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName
    };

    try{
        const { success } = UserSchema.safeParse(newUser);
        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs",
            })
        }
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(411).json({
                message: "Email already taken or incorrect inputs"
            });
        }

        const user = await User.create(newUser);
        const userId = user._id;
        await Account.create({
            userId: userId,
            balance: 1+Math.random()*10000
        })
        const token = jwt.sign({userId}, JWT_SECRET);
        res.status(200).json({
            message: "User created successfully",
            token: token
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
});

const signinBody = z.object({
    username: z.string().email(),
    password: z.string(),
})

router.post('/signin', async (req,res) => {
    const { username,password } = req.body;
    const user = {
        username: username,
        password: password,
    }
    try{
        const { success } = signinBody.safeParse(user);
        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            })
        }
        const existingUser = await User.findOne({
            username: username,
            password: password
        });
        if(existingUser){
            userId = existingUser._id;
            const token = jwt.sign({userId}, JWT_SECRET);
            res.status(200).json({
                token: token
            });
            return;
        }else{
            throw new Error("no user found");
        }
    }catch(err){
        console.error(err);
        res.status(500).json({
            message:  "Error while logging in"
        });
    }
});

const updateBody = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
});

router.put('/', authMiddleware, async (req,res) => {
    const { success } = updateBody.safeParse(updateBody);
    if(!success){
        res.status(411).json({
            message: "Error while updating information"
        });
    }
    const userId = req.userId;
    await User.updateOne({
        _id: userId
    },req.body);
    res.status(200).json({
        message: "Updated Successfully"
    });
});

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [
            {
                firstName: { 
                    "$regex": filter 
                }
            },{
                lastName: { 
                    "$regex": filter 
                }
            }
        ]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
});

module.exports = {
    router
}