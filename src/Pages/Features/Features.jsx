import style from './feature.module.css'
import { Link } from 'react-router-dom'
import { FaRegSmileBeam, FaHandsHelping, FaRegMoneyBillAlt, FaUserSecret } from 'react-icons/fa'
import { BiMessageDetail } from 'react-icons/bi'
import { MdPrivacyTip } from 'react-icons/md'
import Navigation from '../../Components/Navigation/Navigation'
import Footer from '../../Components/Footer/Footer'

export default function Features() {
    return (
        <>
            <Navigation />
            <div>
                <div className={style.sectHead}>
                    <h1><Link to="/">Home</Link> / Features</h1>
                </div>
                <div className={style.space}></div>
                <div className={style.features}>
                    <h2>Explore Our Features</h2>
                    <ul>
                        <li>
                            <FaRegSmileBeam size={60} fill='#34DCA7' />
                            <h3>Mood Tracking</h3>
                            <p>Daily log with charts to visualize emotions.</p>
                        </li>
                        <li>
                            <FaHandsHelping size={60}fill='#34DCA7' />
                            <h3>Peer-to-Peer Support</h3>
                            <p>Share experiences or help others via posts and messages.</p>
                        </li>
                        <li>
                            <FaUserSecret size={60} fill='#34DCA7' />
                            <h3>Anonymous Posting</h3>
                            <p>Speak freely without revealing your identity.</p>
                        </li>
                        <li>
                            <BiMessageDetail size={60} fill='#34DCA7' />
                            <h3>Private Chats and Group Discussions</h3>
                            <p>One-on-one supportive conversations and group discussions based on a topic.</p>
                        </li>
                        <li>
                            <MdPrivacyTip size={60} fill='#34DCA7' />
                            <h3>Full Privacy Control</h3>
                            <p>Choose when to stay anonymous and who sees your information.</p>
                        </li>
                        <li>
                            <FaRegMoneyBillAlt size={60} fill='#34DCA7' />
                            <h3>Completely Free</h3>
                            <p>No subscription, paywalls, or hidden fees.</p>
                        </li>
                    </ul>
                </div>
            </div>
            <Footer />
        </>
    )
}