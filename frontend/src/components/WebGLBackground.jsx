import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ParticleSwarm = ({ progress, isSimulating }) => {
    const pointsRef = useRef();
    const count = 10000;

    const { spherePos, galaxyPos } = useMemo(() => {
        const sphere = new Float32Array(count * 3);
        const galaxy = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // 1. SPHERE MATH
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            const r = 3;

            sphere[i * 3] = r * Math.cos(theta) * Math.sin(phi);
            sphere[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            sphere[i * 3 + 2] = r * Math.cos(phi);

            // 2. GALAXY MATH 
            const armCount = 3;
            const armIndex = i % armCount;
            const armAngle = (armIndex / armCount) * Math.PI * 2;
            const distance = Math.random() * 8;
            const spiralAngle = distance * 1.5 + armAngle;

            const randomX = (Math.random() - 0.5) * 1.2;
            const randomY = (Math.random() - 0.5) * 0.6;
            const randomZ = (Math.random() - 0.5) * 1.2;

            galaxy[i * 3] = Math.cos(spiralAngle) * distance + randomX;
            galaxy[i * 3 + 1] = randomY * (4 / (distance + 0.1));
            galaxy[i * 3 + 2] = Math.sin(spiralAngle) * distance + randomZ;
        }
        return { spherePos: sphere, galaxyPos: galaxy };
    }, [count]);

    const positions = useMemo(() => new Float32Array(spherePos), [spherePos]);

    useFrame((state) => {
        if (!pointsRef.current) return;

        let targetProgress = progress / 100;

        if (isSimulating) {
            // THE FIX: Changed from * 4 to * 1.5. This makes it "breathe" slower and more majestically.
            targetProgress = (Math.sin(state.clock.elapsedTime * 1.5) + 1) / 2;

            pointsRef.current.rotation.y += 0.005;
            pointsRef.current.rotation.z += 0.002;
        } else {
            pointsRef.current.rotation.y += 0.0015;
            pointsRef.current.rotation.z += 0.0008;
        }

        const currentPositions = pointsRef.current.geometry.attributes.position.array;
        for (let i = 0; i < count * 3; i++) {
            const target = THREE.MathUtils.lerp(spherePos[i], galaxyPos[i], targetProgress);
            // THE FIX: Increased the lerp from 0.06 to 0.12 so the particles move faster to catch up to the target
            currentPositions[i] = THREE.MathUtils.lerp(currentPositions[i], target, 0.12);
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.035} color="#38bdf8" transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
};

const WebGLBackground = ({ progress, isSimulating = false }) => {
    return (
        <div className="fixed inset-0 z-0 bg-[#020204]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/10 via-transparent to-transparent"></div>
            <Canvas dpr={[1, 2]} camera={{ position: [0, 1.5, 6.5], fov: 60 }}>
                <fog attach="fog" args={['#020204', 6, 25]} />
                <ParticleSwarm progress={progress} isSimulating={isSimulating} />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate={!isSimulating} autoRotateSpeed={0.8} />
            </Canvas>
        </div>
    );
};

export default WebGLBackground;