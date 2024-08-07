import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

//songs
const songs = [
  { title: 'Dance', src: '../songs/DANCE222.wav' },
  { title: 'Brent X Cole', src: '../songs/Brent X Cole.wav' },
  { title: 'DPAT', src: '../songs/DPAT TYPE BEAT.wav' },
  { title: 'Lions Gate', src: '../songs/Lions Gate.wav' },
  { title: 'Runnin Down', src: '../songs/runnindown.wav' },
  { title: 'Never Gets Better', src: '../songs/NEVERGETSBETTER.wav' },
  { title: 'NYC', src: '../songs/nyc.wav' },
];

const AudioVisualizer = () => {
  const containerRef = useRef(null);
  const [context, setContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [audio, setAudio] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const [activeIndex, setActiveIndex] = useState(3);
  const [animationId, setAnimationId] = useState(null);
  const [sceneInitialized, setSceneInitialized] = useState(false);

  const noise = createNoise3D();

  useEffect(() => {
    const init = () => {
      console.log('Initializing Audio Context and THREE.js...');
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      setContext(audioContext);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 100);
      camera.lookAt(scene.position);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      setRenderer(renderer);
      setScene(scene);
      setCamera(camera);
    };

    init();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (context && analyser) {
      analyser.fftSize = 512;
      const bufferLength = analyser.frequencyBinCount;
      setDataArray(new Uint8Array(bufferLength));
    }
  }, [context, analyser]);

  const handleResize = () => {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  };

  const startAudioContext = () => {
    if (context && context.state === 'suspended') {
      context.resume().catch(err => console.error('Error resuming AudioContext:', err));
    }
  };

  const handlePlayClick = (index) => {
    console.log('Play button clicked');

    startAudioContext();

    const audioElement = document.querySelectorAll('.audio')[index];
    if (context && audioElement) {
      if (analyser) {
        analyser.disconnect();
      }

      if (audio !== audioElement) {
        // If a new audio element is selected, stop the previous one
        if (audio) {
          audio.pause();
        }
        setAudio(audioElement);
      }

      const source = context.createMediaElementSource(audioElement);
      const newAnalyser = context.createAnalyser();
      source.connect(newAnalyser);
      newAnalyser.connect(context.destination);

      setAnalyser(newAnalyser);
      audioElement.currentTime = 0;
      audioElement.play();

      if (!sceneInitialized) {
        setupScene();
        setSceneInitialized(true);
      }
    }
  };

  const handlePauseClick = () => {
    console.log('Pause button clicked');
    if (audio) {
      audio.pause();
      resetScene();
      setSceneInitialized(false);
    }
  };

  const setupScene = () => {
    if (scene && camera && renderer && analyser && dataArray) {
      console.log('Setting up scene');
      const group = new THREE.Group();

      const planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
      const planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x60002F,
        side: THREE.DoubleSide,
        wireframe: true
      });

      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.position.set(0, 30, 0);
      group.add(plane);

      const plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
      plane2.position.set(0, -30, 0);
      group.add(plane2);

      const icosahedronGeometry = new THREE.IcosahedronGeometry(10, 3);
      const lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xFF9900,
        wireframe: true
      });

      const ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
      ball.position.set(0, 0, 0);
      group.add(ball);

      const ambientLight = new THREE.AmbientLight(0xaaaaaa);
      scene.add(ambientLight);

      const spotLight = new THREE.SpotLight(0xffffff);
      spotLight.intensity = 0.9;
      spotLight.position.set(-10, 40, 20);
      spotLight.lookAt(ball);
      spotLight.castShadow = true;
      scene.add(spotLight);

      scene.add(group);

      if (containerRef.current) {
        containerRef.current.innerHTML = ''; // Clear previous content
        containerRef.current.appendChild(renderer.domElement);
      }

      const render = () => {
        analyser.getByteFrequencyData(dataArray);

        const lowerHalfArray = dataArray.slice(0, dataArray.length / 2 - 1);
        const upperHalfArray = dataArray.slice(dataArray.length / 2 - 1, dataArray.length - 1);

        const lowerMax = Math.max(...lowerHalfArray);
        const lowerAvg = lowerHalfArray.reduce((a, b) => a + b) / lowerHalfArray.length;
        const upperMax = Math.max(...upperHalfArray);
        const upperAvg = upperHalfArray.reduce((a, b) => a + b) / upperHalfArray.length;

        const lowerMaxFr = lowerMax / lowerHalfArray.length;
        const lowerAvgFr = lowerAvg / lowerHalfArray.length;
        const upperMaxFr = upperMax / upperHalfArray.length;
        const upperAvgFr = upperAvg / upperHalfArray.length;

        makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
        makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));
        makeRoughBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));

        renderer.render(scene, camera);
        const newAnimationId = requestAnimationFrame(render);
        setAnimationId(newAnimationId);
      };

      render();
    }
  };

  const makeRoughBall = (mesh, bassFr, treFr) => {
    const positionAttribute = mesh.geometry.getAttribute('position');
    const vertex = new THREE.Vector3();
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      const offset = mesh.geometry.parameters.radius;
      const amp = 5;
      const time = window.performance.now();
      vertex.normalize();
      const rf = 0.00001;
      const distance = (offset + bassFr) + noise(vertex.x + time * rf * 5, vertex.y + time * rf * 6, vertex.z + time * rf * 7) * amp * treFr;
      vertex.multiplyScalar(distance);
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    positionAttribute.needsUpdate = true;
  };

  const makeRoughGround = (mesh, distortionFr) => {
    const positionAttribute = mesh.geometry.getAttribute('position');
    const vertex = new THREE.Vector3();
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      const amp = 2;
      const time = Date.now();
      const distance = (noise(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
      vertex.z = distance;
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    positionAttribute.needsUpdate = true;
  };

  const resetScene = () => {
    console.log('Resetting scene');
    if (scene) {
      while (scene.children.length > 0) {
        const child = scene.children[0];
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
        scene.remove(child);
      }
    }
    if (renderer) {
      renderer.renderLists.dispose();
    }
    if (animationId) {
      cancelAnimationFrame(animationId);
      setAnimationId(null);
    }
    
  };

  const handleNext = () => {
    console.log('Next button clicked');
    setActiveIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePrev = () => {
    console.log('Previous button clicked');
    setActiveIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  const getItemStyle = (index) => {
    const baseStyle = {
      position: 'absolute',
      top: '20%',
      transform: 'translateY(-50%)',
      padding: '20px',
      backgroundColor: 'rgba(104, 58, 58, .6)',
      borderRadius: '5px',
      zIndex: 10,
      transition: 'transform 0.5s, opacity 0.5s',
    };

    const stt = Math.abs(index - activeIndex);
    if (stt === 0) {
      return { ...baseStyle, transform: 'translateX(0) scale(1)', opacity: 1 };
    }

    const offset = 200; // Distance between items
    const scale = Math.max(0.5, 1 - 0.2 * stt); // Adjust for scaling non-centered items
    return {
      ...baseStyle,
      transform: `translateX(${(index - activeIndex) * offset}px) scale(${scale})`,
      opacity: .01 * scale, // Adjust opacity based on scale
    };
  };

  const audioVisualStyle = {
    position: 'relative',
    width: '100%',
    height: '100vh',
    background: 'linear-gradient(135deg, hsla(242, 86%, 6%, 1), rgb(134, 31, 0))',
    color: 'hsla(242, 86%, 6%, 1)',
    overflow: 'hidden',
  };

  const sliderStyle = {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '1200px',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'hsla(17, 100%, 56%, 1)',
    marginBottom: '10px',
  };

  const buttonStyle = {
    position: 'absolute',
    top: '50%',
    color: '#fff',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: 'xxx-large',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  };

  const nextButtonStyle = {
    ...buttonStyle,
    left: 'unset',
    right: '20px',
  };

  const prevButtonStyle = {
    ...buttonStyle,
    left: '20px',
  };

  return (
    <div className='audio-visual' id='Music' style={audioVisualStyle}>
      <div ref={containerRef} style={{ position: 'absolute', width: '100%', height: '100%' }} />
      <div className='slider' style={sliderStyle}>
        {songs.map((song, index) => (
          <div key={index} className='item' style={getItemStyle(index)}>
            <div id='item'>
              <div id='title' className="title" style={titleStyle}>{song.title}</div>
              <audio className="audio" src={song.src}></audio>
              <button className="play-btn" onClick={() => handlePlayClick(index)}>Play</button><br />
              <button className="pause-btn" onClick={handlePauseClick}>Pause</button>
            </div>
          </div>
        ))}
        <div id="slider-controls">
          <button id="prev" style={prevButtonStyle} onClick={handlePrev}>&lt;</button>
          <button id="next" style={nextButtonStyle} onClick={handleNext}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

const fractionate = (val, minVal, maxVal) => (val - minVal) / (maxVal - minVal);

const modulate = (val, minVal, maxVal, outMin, outMax) => {
  const fr = fractionate(val, minVal, maxVal);
  return outMin + (fr * (outMax - outMin));
};

export default AudioVisualizer;
