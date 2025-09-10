import { useEffect, useState } from 'react';
import Nav from '../Nav/Nav';
import style from './community.module.css';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function Community() {
    const { user } = useAuth();
    const [communities, setCommunities] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/communities", {
                    credentials: "include",
                });
                const data = await res.json();
                if (data.success) setCommunities(data.communities);
            } catch (error) {
                console.error("Error fetching communities:", error);
            }
        };
        fetchCommunities();
    }, []);

    // Join community
    const handleJoin = async (id) => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/communities/${id}/join`,
                { method: "POST", credentials: "include" }
            );
            const data = await res.json();
            if (data.success) {
                setCommunities((prev) =>
                    prev.map((c) =>
                        c._id === id
                            ? {
                                  ...c,
                                  members: [
                                      ...c.members,
                                      { user: { _id: user._id, name: user.name } },
                                  ],
                              }
                            : c
                    )
                );
            }
        } catch (error) {
            console.error("Join failed: ", error);
        }
    };

    // Leave community
    const handleLeave = async (id) => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/communities/${id}/leave`,
                { method: "POST", credentials: "include" }
            );
            const data = await res.json();
            if (data.success) {
                setCommunities((prev) =>
                    prev.map((c) =>
                        c._id === id
                            ? {
                                  ...c,
                                  members: c.members.filter(
                                      (m) => m.user._id !== user._id
                                  ),
                              }
                            : c
                    )
                );
            }
        } catch (error) {
            console.error("Leave failed: ", error);
        }
    };

    // ✅ Match communities based on mental issues
    const matchedCommunities = communities.filter((c) =>
        c.issueType?.some((issue) =>
            issue && user?.mentalIssues?.some((i) => i.toLowerCase() === issue.toLowerCase())
        )
    );

    const otherCommunities = communities.filter(
        (c) => !matchedCommunities.some((m) => m._id === c._id)
    );

    // ✅ Apply search filter
    const filterBySearch = (list) =>
        list.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div className={style.dashboard}>
            <Nav />
            <div className={style.content}>
                <div className={style.postCon}>
                    <div className={style.searchCommunity}>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="search"
                                placeholder="Search community..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit">
                                <FaSearch />
                            </button>
                        </form>
                    </div>

                    {/* ✅ Recommended Communities */}
                    {matchedCommunities.length > 0 && (
                        <div className={style.section}>
                            <h2>✨ Recommended Communities for You</h2>
                            <div className={style.postList}>
                                {filterBySearch(matchedCommunities).map((c) => {
                                    const isMember = user && c.members.some((m) => m.user?._id === user._id);
                                    return (
                                        <div key={c._id}>
                                            <div className={style.postColor}></div>
                                            <div className={style.postItem}>
                                                <div className={style.userCon}>
                                                    <h2>{c.name}</h2>
                                                    {isMember ? (
                                                        <button
                                                            className={style.leaveBtn}
                                                            onClick={() => handleLeave(c._id)}
                                                        >
                                                            Leave Community
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className={style.joinBtn}
                                                            onClick={() => handleJoin(c._id)}
                                                        >
                                                            Join Community
                                                        </button>
                                                    )}
                                                </div>
                                                <p>{c.description}</p>
                                                <span>{c.members.length} people joined</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ✅ Other Communities */}
                    <div className={style.section}>
                        <h2>🌍 Explore Other Communities</h2>
                        <div className={style.postList}>
                            {filterBySearch(otherCommunities).map((c) => {
                                const isMember = user && c.members.some((m) => m.user._id === user._id);
                                return (
                                    <div key={c._id}>
                                        <div className={style.postColor}></div>
                                        <div className={style.postItem}>
                                            <div className={style.userCon}>
                                                <h2>{c.name}</h2>
                                                {isMember ? (
                                                    <button
                                                        className={style.leaveBtn}
                                                        onClick={() => handleLeave(c._id)}
                                                    >
                                                        Leave Community
                                                    </button>
                                                ) : (
                                                    <button
                                                        className={style.joinBtn}
                                                        onClick={() => handleJoin(c._id)}
                                                    >
                                                        Join Community
                                                    </button>
                                                )}
                                            </div>
                                            <p>{c.description}</p>
                                            <span>{c.members.length} people joined</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
