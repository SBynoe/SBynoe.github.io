import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import SliderComponent from './SliderComponent';


let audioContext = null;

const AudioVisual = ({ songs, activeIndex, onPlayClick, onPauseClick, onPrev, onNext }) => {
  const containerRef = useRef(null);
  const [context, setContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [audio, setAudio] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const [animationId, setAnimationId] = useState(null);
  const [sceneInitialized, setSceneInitialized] = useState(false);

  const noise = useMemo(() => createNoise3D(), []);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = () => {
      if (!isInitialized) {
        console.log('Initializing Audio Context and THREE.js...');
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        setContext(audioContext);

        //declare new scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 100);
        camera.lookAt(scene.position);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        setRenderer(renderer);
        setScene(scene);
        setCamera(camera);

        setIsInitialized(true);
      }
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
        setRenderer(null);      
      }
    };
  }, [animationId, isInitialized]);

  useEffect(() => {
    if (context && analyser) {
      analyser.fftSize = 512;
      const bufferLength = analyser.frequencyBinCount;
      setDataArray(new Uint8Array(bufferLength));
    }
  }, [context, analyser]);

  useEffect(() => {
    if (scene && camera && renderer && analyser && dataArray && !sceneInitialized) {
      setupScene();
      setSceneInitialized(true);
    }
  }, [scene, camera, renderer, analyser, dataArray, sceneInitialized]);

  const handleResize = useCallback(() => {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }, [camera, renderer]);

  const startAudioContext = useCallback(() => {
    if (context && context.state === 'suspended') {
      context.resume().catch(err => console.error('Error resuming AudioContext:', err));
    }
  }, [context]);

  const handlePlayClick = useCallback((index) => {
    console.log('Play button clicked');
    resetScene();

    setRenderer(renderer);

    startAudioContext();

    const audioElement = document.querySelectorAll('.audio')[index];
    if (context && audioElement) {
      if (analyser) {
        analyser.disconnect();
        resetScene();
      }

      if (audio !== audioElement) {
        if (audio) {
          handlePauseClick();
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
    }
  }, [context, audio, analyser, startAudioContext]);

  const handlePauseClick = useCallback(() => {
    console.log('Pause button clicked');
    if (audio) {
      audio.pause();
      setSceneInitialized(false);
    }
  }, [audio]);

  const resetScene = useCallback(() => {
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
  }, [scene, renderer, animationId]);

  const setupScene = () => {
    if (scene && camera && renderer && analyser && dataArray) {
      const group = new THREE.Group();

      const planeGeometry = new THREE.PlaneGeometry(800, 800, 50, 50);
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

      const icosahedronGeometry = new THREE.IcosahedronGeometry(15, 6);
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
        containerRef.current.innerHTML = ''; 
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

        if (!isNaN(distance)) {
            vertex.multiplyScalar(distance);
            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
    }

    positionAttribute.needsUpdate = true;
  };

  const makeRoughGround = (mesh, distortionFr) => {
    const positionAttribute = mesh.geometry.getAttribute('position');
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        const amp = 2;
        const time = window.performance.now();
        vertex.normalize();
        const rf = 0.00001;

        const distance = (noise(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;

        if (!isNaN(distance)) {
            vertex.multiplyScalar(distance);
            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
    }

    positionAttribute.needsUpdate = true;
  };

  return (
    <div className='audio-visual' id='Music' style={{ position: 'relative', width: '100%', height: '100vh', background: 'linear-gradient(135deg, hsla(242, 86%, 6%, 1), rgb(134, 31, 0))', color: 'hsla(242, 86%, 6%, 1)', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ position: 'absolute', width: '100%', height: '100%' }} />
      
      {/* SliderComponent nested within AudioVisual */}
      <SliderComponent
        songs={songs}
        activeIndex={activeIndex}
        onPlayClick={handlePlayClick}
        onPauseClick={handlePauseClick}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
};

const fractionate = (val, minVal, maxVal) => (val - minVal) / (maxVal - minVal);

const modulate = (val, minVal, maxVal, outMin, outMax) => {
  const fr = fractionate(val, minVal, maxVal);
  return outMin + (fr * (outMax - outMin));
};

export default AudioVisual;
