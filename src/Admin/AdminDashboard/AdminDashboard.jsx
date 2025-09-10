import { useEffect, useState } from 'react';
import style from './adminDashboard.module.css';
import AdminNav from '../AdminNav/AdminNav';
import { FaComments, FaSmile, FaUser, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useAuth } from '../../context/AuthContext';
ChartJS.register(ChartDataLabels);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeCommunities: 0,
        privateChats: 0,
        moodLogs: 0
    });
    const [signups, setSignups] = useState([]);
    const [recentCommunities, setRecentCommunities] = useState([]);
    const [admin, setAdmin] = useState(null);
    const { user, userType } = useAuth();

    if(userType !== "admin"){
        return <h2>Access Denied. Admins only!</h2>
    }

    const [userGrowth, setUserGrowth] = useState({ labels: [], data: [] });
    const [moodTrends, setMoodTrends] = useState({ moods: [], counts: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch admin info
                const resAdmin = await fetch('http://localhost:5000/api/admin/me', { credentials: 'include' });
                const dataAdmin = await resAdmin.json();
                if (resAdmin.ok) {
                    setAdmin(dataAdmin.admin);
                }

                // Dashboard summary
                const resStats = await fetch('http://localhost:5000/api/admin/dashboard', { credentials: 'include' });
                const dataStats = await resStats.json();
                if (dataStats.success) {
                    setStats(dataStats.stats);
                }

                // Recent signups
                const resSignups = await fetch('http://localhost:5000/api/admin/recent-signups', { credentials: 'include' });
                const dataSignups = await resSignups.json();
                if (dataSignups.success) {
                    setSignups(dataSignups.users);
                }

                // Recent community chats
                const resCommunities = await fetch('http://localhost:5000/api/admin/recent-communities', { credentials: 'include' });
                const dataCommunities = await resCommunities.json();
                if (dataCommunities.success) {
                    setRecentCommunities(dataCommunities.communities);
                }

                // User Growth
                const resGrowth = await fetch('http://localhost:5000/api/admin/user-growth', { credentials: 'include' });
                const dataGrowth = await resGrowth.json();
                if (dataGrowth.success) setUserGrowth(dataGrowth);

                // Mood Trends
                const resMood = await fetch('http://localhost:5000/api/admin/mood-trends', { credentials: 'include' });
                const dataMood = await resMood.json();
                if (dataMood.success) setMoodTrends(dataMood);

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        };

        fetchData();
    }, []);

    // Chart.js data
    const userGrowthData = {
        labels: userGrowth.labels,
        datasets: [
            {
                label: 'New Users',
                data: userGrowth.data,
                backgroundColor: '#34DCA7',
            },
        ],
    };

    const userGrowthOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                display: false,
            },
        },
    };

    const moodTrendsData = {
        labels: moodTrends.moods,
        datasets: [
            {
            data: moodTrends.counts,
            backgroundColor: ["#FACC15", "#3B82F6", "#EF4444"],
            },
        ],
    };

    const moodTrendsOptions = {
        plugins: {
            legend: { position: "top" },
            datalabels: {
            color: "#fff",
            formatter: (value, ctx) => {
                let sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                let percentage = ((value / sum) * 100).toFixed(1) + "%";
                return percentage;
            },
            },
        },
    };

    return (
        <div className={style.dashboard}>
            <AdminNav />
            <div className={style.content}>
                <div className={style.header}>
                    <h2>Dashboard {user ? `- ${user.name}` : ''}</h2>
                </div>

                {/* Stats */}
                <div className={style.stats}>
                    <h3>Data Report</h3>
                    <div className={style.statCard}>
                        <div className={style.sumCard1}>
                            <FaUser className={style.icon} fill='#4949fa' />
                            <div className={style.separator}></div>
                            <div className={style.sumCardTxt}>
                                <p>Total Users</p>
                                <span>{stats.totalUsers}</span>
                            </div>
                        </div>
                        <div className={style.sumCard2}>
                            <FaUsers className={style.icon} fill='#bc4545' />
                            <div className={style.separator}></div>
                            <div className={style.sumCardTxt}>
                                <p>Active Communities</p>
                                <span>{stats.activeCommunities}</span>
                            </div>
                        </div>
                        <div className={style.sumCard3}>
                            <FaComments className={style.icon} fill='#3ccf48' />
                            <div className={style.separator}></div>
                            <div className={style.sumCardTxt}>
                                <p>Private Chats</p>
                                <span>{stats.privateChats}</span>
                            </div>
                        </div>
                        <div className={style.sumCard4}>
                            <FaSmile className={style.icon} fill='#e09620' />
                            <div className={style.separator}></div>
                            <div className={style.sumCardTxt}>
                                <p>Mood Logs</p>
                                <span>{stats.moodLogs}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className={style.visual}>
                    <div className={style.userGrowth}>
                        <h3>User Growth Chart</h3>
                        <Bar data={userGrowthData} options={userGrowthOptions} />
                    </div>
                    <div className={style.moodTrends}>
                        <h3>Mood Trends</h3>
                        <Doughnut data={moodTrendsData} options={moodTrendsOptions} />
                    </div>
                </div>

                {/* Activities */}
                <div className={style.activities}>
                    {/* Recent Signups */}
                    <div className={style.signup}>
                        <h3>Recent Signups</h3>
                        <div className={style.signupList}>
                            <ul>
                                {signups.length > 0 ? (
                                    signups.map((user, idx) => (
                                        <li key={idx}>
                                            <span className={style.recentUser}>{user.name}</span>
                                            <span className={style.recentDate}>
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <li>No recent signups</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Recent Community Chats */}
                    <div className={style.communityChat}>
                        <h3>Recent Communities</h3>
                        <div className={style.communityChatList}>
                            <ul>
                            {recentCommunities.length > 0 ? (
                                recentCommunities.map((community, idx) => (
                                <li key={idx}>
                                    <span className={style.recentCommunity}>{community.name}</span>
                                    <span className={style.recentDate}>
                                    {new Date(community.createdAt).toLocaleDateString()}
                                    </span>
                                </li>
                                ))
                            ) : (
                                <li>No recent communities</li>
                            )}
                            </ul>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className={style.actions}>
                        <h3>Quick Actions</h3>
                        <div className={style.quickActions}>
                            <ul>
                                <Link to="/admin-userList">Manage Users</Link>                                
                                <Link to="/admin-management">Manage Admins</Link>
                                <Link to="/admin-community">Manage Communities</Link>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
