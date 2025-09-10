import moodModel from "../models/moodModel.js"

// Save a new mood
export const saveMood = async (req, res) => {
    try {
        const { mood, reason } = req.body;
        const newMood = await moodModel.create({
            userId: req.user._id,
            mood,
            reason
        });

        res.status(201).json({
            success: true,
            data: newMood
        })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get all models of logged-in user
export const getMoods = async (req,res) => {
    try {
        const moods = await moodModel.find({ userId: req.user._id }).sort({ createdAt: -1});
        res.status(200).json({ success: true, data: moods });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get single mood by ID
export const getMoodById = async (req,res) => {
    try {
        const mood = await moodModel.findOne({_id: req.params.id, userId: req.user._id });
        if (!mood) {
            return res.status(404).json({ success: false, message: "Mood not found" });
        }
        res.status(200).json({ success: true, data: mood })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getDailyMoods = async (req, res) => {
    try {
        const moods = await moodModel.find({ userId: req.user._id }).sort({ createdAt: 1 });

        // Group by day
        const grouped = {};
        moods.forEach(m => {
            const date = new Date(m.createdAt);
            const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue...
            if (!grouped[dayLabel]) {
                grouped[dayLabel] = { good: 0, normal: 0, bad: 0 };
            }
            // Only increment if mood is valid
            if (["good", "normal", "bad"].includes(m.mood)) {
                grouped[dayLabel][m.mood] = (grouped[dayLabel][m.mood] || 0) + 1;
            }
        });

        // Format data for frontend
        const dailyData = Object.keys(grouped).map(day => ({
            day,
            ...grouped[day]
        }));

        res.status(200).json({ success: true, data: dailyData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// ...existing code...

// Update a mood
export const updateMood = async (req,res) => {
    try {
        const { mood, reason } = req.body;
        const updatedMood = await moodModel.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { mood, reason },
            { new: true }
        );
        if (!updatedMood) {
            return res.status(404).json({ success: false, message: "Mood not found"})
        }
        res.status(200).json({ success: true, data: updatedMood })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
        
    }
};

// Delete a mood
export const deleteMood = async (req, res) => {
    try {
        const deletedMood = await moodModel.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!deletedMood) {
            return res.status(404).json({ success: false, message: "Mood not found" });
        }

        res.status(200).json({ success: true, message: "Mood deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
