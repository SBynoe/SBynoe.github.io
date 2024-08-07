import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [audio, setAudio] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [dataArray, setDataArray] = useState(null);

  useEffect(() => {
    const init = () => {
      // Initialize the audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      setContext(audioContext);

      // Initialize the visual elements
      const initVisuals = () => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 100);
        camera.lookAt(scene.position);

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        setRenderer(renderer);
        setScene(scene);
        setCamera(camera);
      };

      initVisuals();
    };

    init();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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

  const handlePlayClick = (audioElement) => {
    if (context && audioElement) {
      if (analyser) analyser.disconnect();
      
      const source = context.createMediaElementSource(audioElement);
      const newAnalyser = context.createAnalyser();
      source.connect(newAnalyser);
      newAnalyser.connect(context.destination);

      setAnalyser(newAnalyser);
      audioElement.currentTime = 0;
      audioElement.play();
      setAudio(audioElement);

      renderScene();
    }
  };

  const handlePauseClick = () => {
    if (audio) {
      audio.pause();
      resetScene();
    }
  };

  const renderScene = () => {
    const simplexNoise = new SimplexNoise();
    const noise = (x, y, z) => simplexNoise.noise3D(x, y, z);

    const makeRoughBall = (mesh, bassFr, treFr) => {
      mesh.geometry.vertices.forEach(vertex => {
        const offset = mesh.geometry.parameters.radius;
        const amp = 5;
        const time = window.performance.now();
        vertex.normalize();
        const rf = 0.00001;
        const distance = (offset + bassFr) + noise(vertex.x + time * rf * 5, vertex.y + time * rf * 6, vertex.z + time * rf * 7) * amp * treFr;
        vertex.multiplyScalar(distance);
      });
      mesh.geometry.verticesNeedUpdate = true;
      mesh.geometry.normalsNeedUpdate = true;
      mesh.geometry.computeVertexNormals();
      mesh.geometry.computeFaceNormals();
    };

    const makeRoughGround = (mesh, distortionFr) => {
      mesh.geometry.vertices.forEach(vertex => {
        const amp = 2;
        const time = Date.now();
        const distance = (noise(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
        vertex.z = distance;
      });
      mesh.geometry.verticesNeedUpdate = true;
      mesh.geometry.normalsNeedUpdate = true;
      mesh.geometry.computeVertexNormals();
      mesh.geometry.computeFaceNormals();
    };

    const render = () => {
      if (analyser && dataArray && renderer && scene && camera) {
        analyser.getByteFrequencyData(dataArray);

        const lowerHalfArray = dataArray.slice(0, dataArray.length / 2);
        const upperHalfArray = dataArray.slice(dataArray.length / 2);

        const lowerMax = Math.max(...lowerHalfArray);
        const lowerAvg = lowerHalfArray.reduce((a, b) => a + b) / lowerHalfArray.length;
        const upperMax = Math.max(...upperHalfArray);
        const upperAvg = upperHalfArray.reduce((a, b) => a + b) / upperHalfArray.length;

        const lowerMaxFr = lowerMax / lowerHalfArray.length;
        const lowerAvgFr = lowerAvg / lowerHalfArray.length;
        const upperMaxFr = upperMax / upperHalfArray.length;
        const upperAvgFr = upperAvg / upperHalfArray.length;

        // Assuming `plane`, `plane2`, and `ball` are created and added to the scene earlier
        if (scene) {
          scene.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
              if (child.geometry instanceof THREE.PlaneGeometry) {
                makeRoughGround(child, modulate(lowerMaxFr, 0, 1, 0.5, 4));
              } else if (child.geometry instanceof THREE.IcosahedronGeometry) {
                makeRoughBall(child, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));
              }
            }
          });
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
    };

    render();
  };

  return (
    <div>
      <canvas ref={canvasRef} />
      <button onClick={() => handlePlayClick(document.querySelector('.audio'))}>Play</button>
      <button onClick={handlePauseClick}>Pause</button>
    </div>
  );
};

export default AudioVisualizer;

const fractionate = (val, minVal, maxVal) => (val - minVal) / (maxVal - minVal);

const modulate = (val, minVal, maxVal, outMin, outMax) => {
  const fr = fractionate(val, minVal, maxVal);
  return outMin + (fr * (outMax - outMin));
};
