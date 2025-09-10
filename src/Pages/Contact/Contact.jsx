import { useState } from 'react';
import style from './contact.module.css';
import { Link } from 'react-router-dom';
import Navigation from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = form;

    if (!name || !email || !subject || !message) {
      setMessage('Please fill out all fields!')
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ Message sent successfully!')
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setMessage(`❌ Failed: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div>
        <div className={style.sectHead}>
          <h1>
            <Link to="/">Home</Link> / Contact Us
          </h1>
        </div>
        <div className={style.space}></div>
        <div className={style.contactDiv}>
          <div className={style.contact}>
            {message && <div className={style.message}>{message}</div>} 
            <h2>Get In Touch</h2>
            <p>Feel free to reach out to us if you have any questions or enquiries!</p>
            <form onSubmit={handleSubmit}>
              <div className={style.formDetails}>
                <div className={style.formInput}>
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name..."
                  />

                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email..."
                  />

                  <label htmlFor="subject">Subject:</label>
                  <input
                    type="text"
                    id="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Enter your subject..."
                  />
                  <label htmlFor="message">Message:</label>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Enter your message"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
          <div className={style.contactImg}>
            <img src="./src/assets/communications.png" alt="" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
