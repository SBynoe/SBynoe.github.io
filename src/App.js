import About from "./components/About";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Work from "./components/Work";
import Foot from "./components/Foot";


function App() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <About/>
      <Work/>
      <Experience/>
      <Contact/>
      <Foot/>
    </div>
  );
}

export default App;
