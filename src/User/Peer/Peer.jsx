import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import style from './peer.module.css';
import Nav from '../Nav/Nav';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function Peer() {
    const [peers, setPeers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { user, setUser } = useAuth(); // logged-in user

    // Fetch all peers
    useEffect(() => {
        if (!user) return; // wait until user is loaded

        axios.get("http://localhost:5000/api/user/peers", { withCredentials: true })
            .then(res => {
                setPeers(Array.isArray(res.data) ? res.data : []);
            })
            .catch(err => {
                console.error("Error fetching peers:", err);
            });
    }, [user]);

    // Connect with a peer
    const handleConnect = async (peerId) => {
        try {
            const res = await axios.post(
                `http://localhost:5000/api/user/connect/${peerId}`,
                {},
                { withCredentials: true }
            );

            alert(res.data.message);

            // Update local state: add peer to current user's peers
            setUser(prev => ({ ...prev, peers: [...prev.peers, peerId] }));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Failed to connect");
        }
    };

    // Disconnect from a peer
    const handleDisconnect = async (peerId) => {
        try {
            const res = await axios.post(
                `http://localhost:5000/api/user/disconnect/${peerId}`,
                {},
                { withCredentials: true }
            );

            alert(res.data.message);

            // Update local state: remove peer from current user's peers
            setUser(prev => ({
                ...prev,
                peers: prev.peers.filter(id => id !== peerId)
            }));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Failed to disconnect");
        }
    };

    // --- Preference-Based Matching Algorithm ---
    const matchedPeers = useMemo(() => {
        if (!user || !user.mentalIssues) return peers;

        return [...peers].sort((a, b) => {
            const aMatches = a.mentalIssues?.filter(issue =>
                user.mentalIssues.includes(issue)
            ).length || 0;

            const bMatches = b.mentalIssues?.filter(issue =>
                user.mentalIssues.includes(issue)
            ).length || 0;

            return bMatches - aMatches; // higher match count first
        });
    }, [peers, user]);

    // --- Apply Search + Exclude Self ---
    const filteredPeers = matchedPeers.filter(peer =>
        peer._id !== user?._id &&
        (
            peer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (peer.mentalIssues && peer.mentalIssues.join(',').toLowerCase().includes(searchTerm.toLowerCase()))
        )
    );

    return (
        <div className={style.dashboard}>
            <Nav />
            <div className={style.content}>
                <div className={style.searchUser}>
                    <form onSubmit={e => e.preventDefault()}>
                        <input
                            type="search"
                            placeholder="Search peers..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <button type="submit"><FaSearch /></button>
                    </form>
                </div>
                <div className={style.peerList}>
                    {filteredPeers.map(peer => {
                        const isConnected = user?.peers?.includes(peer._id);

                        return (
                            <div className={style.peerItem} key={peer._id}>
                                <img
                                    src={peer.userImage
                                        ? `http://localhost:5000/uploads/${peer.userImage}`
                                        : "./src/assets/user.jpg"}
                                    alt="user"
                                />
                                <div className={style.peerItemContent}>
                                    <div>
                                        <h3>{peer.name}</h3>
                                        <p><span>Issues:</span> {peer.mentalIssues?.join(", ") || "None"}</p>
                                        <p><span>Communities Joined:</span> {peer.communities ? peer.communities.length : 0}</p>
                                    </div>
                                    <div>
                                        {isConnected ? (
                                            <button
                                                className={style.disconnectBtn}
                                                onClick={() => handleDisconnect(peer._id)}
                                            >
                                                Disconnect
                                            </button>
                                        ) : (
                                            <button
                                                className={style.connectBtn}
                                                onClick={() => handleConnect(peer._id)}
                                            >
                                                Connect
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
