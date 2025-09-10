import style from './home.module.css'
import {FaBrain, FaHandsHelping, FaUserSecret} from 'react-icons/fa'
import {RiUserSharedFill} from 'react-icons/ri'
import { Link } from 'react-router-dom'
import Navigation from '../../Components/Navigation/Navigation'
import Footer from '../../Components/Footer/Footer'

export default function Home() {
    return(
        <>
            <Navigation/>
            <main>            
                <div className={style.main}>
                    <div className={style.mainInfo}>
                        <h1>Your Mental Well-Being,<br />Your Sanctuary</h1>
                        <p>Engage, express, and evolve with others - either anonymously or openly</p>
                        <div className={style.heroBtns}>
                            <button className={style.join}><Link to="/login">Join Now</Link></button>
                            <button><Link to="/about">Learn More</Link></button>
                        </div>
                    </div>
                    <img src="./src/assets/support.jpg" alt="image" />
                </div>
                <div className={style.space}></div>
                <div className={style.sect}>
                    <h2>Why Use This Platform?</h2>
                    <ul>
                        <li>
                            <FaBrain size={60} fill='#34DCA7' />
                            <p>Track your mood</p>
                        </li>
                        <li>
                            <FaHandsHelping size={60} fill='#34DCA7' />
                            <p>Get peer support</p>
                        </li>
                        <li>
                            <FaUserSecret size={60} fill='#34DCA7' />
                            <p>Stay anonymous if you prefer</p>
                        </li>
                        <li>
                            <RiUserSharedFill size={60} fill='#34DCA7' />
                            <p>Connect with similar individuals</p>
                        </li>
                    </ul>
                </div>
                <div className={style.space}></div>
                <div className={style.community}>
                    <h2>Community Engagement</h2>
                    <p>Connect with others, share your experiences, <br />
                        and find support in our vibrant community.
                    </p>
                    <button><Link to="/login">Visit Community Feed</Link></button>
                </div>
                <div className={style.space}></div>
                <div className={style.ageLimit}>
                    <div className={style.ageInfo}>
                        <h2>Are You Ready To Join Us?</h2>
                        <p>To keep our community safe and supportive, we welcome individuals aged 16 and older! <br /><br />
                            If you're under 16, don’t worry! There are plenty of amazing resources out there for you. 
                            Talk to a trusted adult or check out organizations designed just for you!
                        </p>
                    </div>
                    <img src="./src/assets/age.jpg" alt="age" />
                </div>
                <div className={style.question}>
                    <div className={style.quesDet}>
                        <h2>Got any questions?</h2>
                        <p>Feel free to reach out to us if you have <br/> any questions or enquiries!</p>
                        <button><Link to="/contact">Contact Us</Link></button>
                    </div>                
                </div>
            </main>
            <Footer/>
        </>
    )
}