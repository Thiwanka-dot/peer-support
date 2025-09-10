import { useEffect, useState } from 'react';
import Nav from '../Nav/Nav';
import style from './dashboard.module.css';
import { FaLaughBeam, FaMeh, FaTired } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MoodChart from '../../Components/Chart/MoodChart.jsx';

export default function Dashboard() {
    const { user, setUser } = useAuth();
    const [issues, setIssues] = useState(["No Issues"]);
    const [issuesInput, setIssuesInput] = useState("");
    const [selectedMood, setSelectedMood] = useState(null);
    const [moodReason, setMoodReason] = useState("");
    const [recentMsgs, setRecentMsgs] = useState([]);
    const [refreshMoodData, setRefreshMoodData] = useState(0);

    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleOpenModal2 = () => setShowModal2(true);
    const handleCloseModal2 = () => setShowModal2(false);

    useEffect(() => {
        if (user && user.mentalIssues && user.mentalIssues.length > 0) {
            setIssues(user.mentalIssues);
            setIssuesInput(user.mentalIssues.join(","));
        } else {
            setIssues(["No Issues"]);
            setIssuesInput("");
        }
    }, [user]);

    const handleIssuesChange = (e) => {
        const input = e.target.value;
        setIssuesInput(input);
        const values = input.split(",").map(issue => issue.trim()).filter(issue => issue !== "");
        setIssues(values);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const fileInput = e.target.querySelector('input[type="file"]');
            if (fileInput.files[0]) formData.set("userImage", fileInput.files[0]);

            formData.set("name", e.target.name.value || user.name);
            formData.set("email", e.target.email.value || user.email);
            formData.set("dob", e.target.dob.value || user.dob);
            formData.set("mentalIssues", issues.join(","));

            const res = await axios.put(
                "http://localhost:5000/api/user/update",
                formData,
                { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
            );

            if (res.data.success) {
                alert("Profile updated successfully!");
                setUser(res.data.user);
                setShowModal(false);
            }
        } catch (err) {
            console.error("Profile update error:", err);
        }
    };

    const handleMoodSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMood) {
            alert("Please select a mood!");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:5000/api/mood/save",
                {
                    mood: selectedMood,
                    reason: moodReason || "No reason provided"
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                alert("Mood saved successfully!");
                setShowModal2(false);
                setSelectedMood(null);
                setMoodReason("");
                setRefreshMoodData(prev => prev + 1);
            }
        } catch (error) {
            console.error("Mood save error: ", error);
            alert("Failed to save mood. Please try again!");
        }
    };

    const handleDeleteAccount = async () => {
        const confirm = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirm) return;

        try {
            const res = await axios.delete("http://localhost:5000/api/user/delete", { withCredentials: true });
            if (res.data.success) {
                alert("Your account has been deleted.");
                navigate('/'); // redirect to home or login page
            }
        } catch (error) {
            console.error("Failed to delete account:", error);
            alert("Failed to delete account. Please try again.");
        }
    };

    useEffect(() => {
        const fetchRecentMsgs = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/user/chat/recent", { withCredentials: true });
                console.log("Recent Messages Response:", res.data); // Debugging log
                if (res.data.success) {
                    setRecentMsgs(res.data.messages);
                    console.log("Recent Messages State:", res.data.messages); // Check the state
                }
            } catch (err) {
                console.error("Failed to fetch recent messages:", err);
            }
        };

        fetchRecentMsgs();
    }, []);

    if (!user) {
        alert("Session expired! Please login again.");
        window.location.href = "/login";
        return null;
    }

    return (
        <div className={style.dashboard}>
            <Nav />
            <div className={style.content}>
                <div className={style.user}>
                    <div className={style.userDetails}>
                        <img
                            src={user.userImage ? `http://localhost:5000/uploads/${user.userImage}` : "./src/assets/user.png"}
                            alt="user"
                        />
                        <div className={style.userInfo}>
                            <h1>{user.name}</h1>
                            <p><span>Email:</span> {user.email}</p>
                            <p><span>Date of Birth:</span> {new Date(user.dob).toLocaleDateString()}</p>
                            <div className={style.issue}>
                                <p><span>Medical Issues:</span></p>
                                <ul>
                                    {issues.map((issue, index) => (
                                        <li key={index}>{issue}</li>
                                    ))}
                                </ul>
                            </div>
                            <button onClick={handleOpenModal}>Update Profile</button>
                        </div>
                    </div>
                    {showModal && (
                        <div className={style.modalBackdrop}>
                            <div className={style.modal}>
                                <h2>Update Profile</h2>
                                <form className={style.form} onSubmit={handleProfileUpdate}>
                                    <div className={style.formInp}>
                                        <label htmlFor="userImage">Profile Image</label>
                                        <input type="file" id="userImage" name="userImage" />
                                        <label>Name:</label>
                                        <input type="text" name="name" defaultValue={user.name} />
                                        <label>Email:</label>
                                        <input type="email" name="email" defaultValue={user.email} />
                                        <label>Date of Birth:</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            defaultValue={user.dob ? new Date(user.dob).toISOString().split("T")[0] : ""}
                                        />

                                        <label>Issues:</label>
                                        <input
                                            type="text"
                                            value={issuesInput}
                                            onChange={handleIssuesChange}
                                            placeholder="e.g., PTSD, Anxiety"
                                        />
                                    </div>
                                    <div className={style.modalBtns}>
                                        <button type="submit" className={style.saveBtn}>Save</button>
                                        <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className={style.activity}>
                        <h2>Engage with your Community</h2>
                        <div className={style.actBtns}>
                            <button><Link to="/community">Explore Communities</Link></button>
                            <button><Link to="/peer">Connect with Peers</Link></button>
                            <button><Link to="/chat">Go to Chatroom</Link></button>
                        </div>
                    </div>
                </div>
                <div className={style.data}>
                    <div className={style.mood}>
                        <div className={style.title}>
                            <h2>Mood Summary Graph</h2>
                            <button onClick={handleOpenModal2}>Enter Daily Mood</button>
                        </div>
                        <div>
                            <MoodChart refresh={refreshMoodData} />
                        </div>
                    </div>
                    {showModal2 && (
                        <div className={style.modalBackdrop}>
                            <div className={style.modal}>
                                <h2>How are you feeling today?</h2>
                                <form className={style.form} onSubmit={handleMoodSubmit}>
                                    <div className={style.formInp}>
                                        <label>Select one from below:</label>
                                        <div className={style.emoBtns}>
                                            <button
                                                type="button"
                                                className={selectedMood === "good" ? style.active : ""}
                                                onClick={() => setSelectedMood("good")}
                                            >
                                                <FaLaughBeam size={30} />
                                                <span>Good</span>
                                            </button>
                                            <button
                                                type="button"
                                                className={selectedMood === "normal" ? style.active : ""}
                                                onClick={() => setSelectedMood("normal")}
                                            >
                                                <FaMeh size={30} />
                                                <span>Normal</span>
                                            </button>
                                            <button
                                                type="button"
                                                className={selectedMood === "bad" ? style.active : ""}
                                                onClick={() => setSelectedMood("bad")}
                                            >
                                                <FaTired size={30} />
                                                <span>Bad</span>
                                            </button>
                                        </div>
                                        <label htmlFor="">Tell us why?</label>
                                        <textarea
                                            id="reason"
                                            name="reason"
                                            value={moodReason}
                                            onChange={e => setMoodReason(e.target.value)}
                                            placeholder="Give us your reason..."
                                        ></textarea>
                                    </div>
                                    <div className={style.modalBtns}>
                                        <button type="submit" className={style.saveBtn}>Save</button>
                                        <button type="button" onClick={handleCloseModal2}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    <div className={style.comPost}>
                        <div className={style.title}>
                            <h2>Recent Messages</h2>
                            <button><Link to="/chat">View More</Link></button>
                        </div>
                        <div className={style.comPostList}>
                            {recentMsgs.map((msg, index) => (
                            <div key={msg._id || index} className={style.postInfo}>
                                <div className={style.title}>
                                <h3>{msg.chatName || "Unnamed Chat"}</h3>
                                </div>
                                <p>
                                <strong>{msg.isAnonymous ? "Anonymous" : msg.sender?.name || "Unknown"}:</strong> {msg.text || ""}
                                </p>
                                <div className={style.date}>
                                <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}</span>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={style.deleteAccount}>
                    <h2>Delete Account</h2>
                    <p>In order to delete your PeerSupport account, click the button below!</p>
                    <button onClick={handleDeleteAccount}>Confirm Account Deletion</button>
                </div>
            </div>
        </div>
    );
}