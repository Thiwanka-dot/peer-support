import Footer from '../../Components/Footer/Footer'
import Navigation from '../../Components/Navigation/Navigation'
import style from './about.module.css'
import { Link } from 'react-router-dom'

export default function About() {
    return (
        <>
            <Navigation/>
            <div>
                <div className={style.sectHead}>
                    <h1><Link to="/">Home</Link> / About Us</h1>
                </div>
                <div className={style.space}></div>
                <div className={style.misVis}>
                    <div className={style.misVisText}>
                        <h2>Our Mission</h2>
                        <p>We believe that everyone deserves a safe, stigma-free space to discuss 
                            mental health. Our mission is to make peer support accessible to all, 
                            fostering connections that promote understanding, healing, and growth.
                        </p>                    
                        <h2>Our Vision</h2>
                        <p>We envision a world where mental health support is universally accessible, 
                            empowering individuals to connect, share, and heal within a compassionate 
                            and supportive community, free from stigma and barriers. Together, 
                            we strive to create an environment where every voice is heard and every 
                            story matters.
                        </p>
                    </div>
                    <img src="./src/assets/mission.jpg" alt="mission" />
                </div>
                <div className={style.space}></div>
                <div className={style.people}>
                    <h2>Who It's For?</h2>
                    <p>Students, employees, caregivers, or anyone feeling <br />
                        overwhelmed. Whether you want to talk or just read <br />
                        what others are going through
                    </p>
                </div>
                <div className={style.space}></div>
                <div className={style.steps}>
                    <h2>Here's How It Works!</h2>
                    <ul>
                        <li>
                            <span>1</span>
                            <p>Sign up with your information</p>
                        </li>
                        <li>
                            <span>2</span>
                            <p>Track your mood and write journal entries</p>
                        </li>
                        <li>
                            <span>3</span>
                            <p>Post stories or ask for advice</p>
                        </li>
                        <li>
                            <span>4</span>
                            <p>Connect with peers who have similar experiences</p>
                        </li>
                    </ul>
                </div>
                <div className={style.space}></div>
                <div className={style.commitment}>
                    <h2>Our Commitment</h2>
                    <p>We built this platform with people in mind—those 
                        who want to feel heard, supported, and safe. 
                        Here’s what we promise to every user who joins us:
                    </p>
                    <ul>
                        <li>
                            <h3>Privacy</h3>
                            <p>Your personal information is never shared 
                                without your consent.
                            </p>
                        </li>
                        <li>
                            <h3>Non-Clinical Peer Support</h3>
                            <p>We offer emotional support from real 
                                people—not therapy or diagnoses
                            </p>
                        </li>
                        <li>
                            <h3>Anonymity</h3>
                            <p>You’re free to express yourself 
                                without revealing your identity.
                            </p>
                        </li>
                        <li>
                            <h3>Respect</h3>
                            <p>We foster a safe, supportive, and 
                                non-judgmental community
                            </p>
                        </li>
                        <li>
                            <h3>Free Access</h3>
                            <p>Mental health support should not 
                                come at a cost.
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
            <Footer/>
        </>
    )
}