import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if ([username, email, password,confirmPassword].some((field) => field?.trim() === "")) {
        return res.status(400).json({ error: "All fields are required" });
    }
     
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Password doenot match" });
    }

    const exitedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (exitedUser) {
        return res.status(400).json({ error: "user already exists" });
    }
   
    const newUser = await User.create({
        username,
        email,
        password
    })

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res
        .status(200)
        .json(new ApiResponse(201, "user register successfully"))

})


const loginUser = asyncHandler(async (req, res) => {
    const {email, password}= req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({
        $or: [{ email }]
    })

    if (!user) {
        return res.status(400).json({ error: "user is not registered" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);  

    if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid user credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken,
                    refreshToken
                }, "User looged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async () => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 //this removes the field from document
            }
        }, {
        new: true
    }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, {}, "User logged out"))

})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "unauthorized request")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used ")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const getLeetcodeStats = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    const query = `
      query getUserProfile($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          username
          profile {
            userAvatar
            ranking
            reputation
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
        userContestRanking(username: $username) {
          rating
          globalRanking
        }
      }
    `;

    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Referer": "https://leetcode.com"
            },
            body: JSON.stringify({
                query,
                variables: { username }
            })
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: `LeetCode API responded with status ${response.status}` });
        }

        const result = await response.json();

        if (result.errors) {
            return res.status(400).json({ error: result.errors[0]?.message || "LeetCode API Error" });
        }

        const data = result.data;
        if (!data || !data.matchedUser) {
            return res.status(404).json({ error: "LeetCode user not found" });
        }

        const stats = {
            totalSolved: data.matchedUser.submitStats.acSubmissionNum.find(x => x.difficulty === 'All')?.count || 0,
            easySolved: data.matchedUser.submitStats.acSubmissionNum.find(x => x.difficulty === 'Easy')?.count || 0,
            mediumSolved: data.matchedUser.submitStats.acSubmissionNum.find(x => x.difficulty === 'Medium')?.count || 0,
            hardSolved: data.matchedUser.submitStats.acSubmissionNum.find(x => x.difficulty === 'Hard')?.count || 0,
            contestRating: data.userContestRanking ? Math.round(data.userContestRanking.rating) : 'N/A',
            globalRank: data.userContestRanking ? data.userContestRanking.globalRanking : 'N/A',
            avatar: data.matchedUser.profile.userAvatar || '/assets/default-avatar.png',
            ranking: data.matchedUser.profile.ranking || 'N/A'
        };

        return res.status(200).json(stats);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch data from LeetCode" });
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getLeetcodeStats,
}