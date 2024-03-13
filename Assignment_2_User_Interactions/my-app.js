import './App.css';
import edc from './images/edc.png'; 
import videogame from './images/videogame.png'; 

function App() {
  return (
    <div className="App">
      <header>
        <h1>Welcome to My About Me Page!</h1>
      </header>
      <main>
        <section>
          <h2>About Me</h2>
          <p>Hello, my name is Anthony Guillen. I am a senior here at CSUSB majoring in computer systems with a concentration in game development. I'm very passionate about technology and love exploring any new tools or techniques that further advance our technology today.</p>
          <p>After college I hope to acquire a career in the video game industry. As I am also very passionate about video games. My goal is to be working in game design for one of my top development companies such as Ubisoft, Activision, or Sledgehammer.</p>
          <p>In my free time, I enjoy playing video games, playing sports, spending time with family, and listening to music. Specifically, I really enjoy listening to EDM music and attending many of the well-known music festivals such as EDC in Las Vegas.</p>
        </section>
        <section>
          <h2>My Hobbies</h2>
          <div className="hobby">
            <img src={edc} alt="Music" /> 
            <p>Music Festival</p>
          </div>
          <div className="hobby">
         
            <img src={videogame} alt="Games" /> 
            <p>Video Games</p>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 [Anthony Guillen]. All rights reserved. | <a href="https://github.com/notaj01">GitHub</a></p>
      </footer>
    </div>
  );
}

export default App;
