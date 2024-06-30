import React, { useEffect, useRef, useState } from 'react';

const GameBoard = () => {
    const canvasRef = useRef(null);
    const [disks, setDisks] = useState([
        { x: 100, y: 60, color: '#000000', vx: 0, vy: 0 },
        { x: 200, y: 60, color: '#FFFFFF', vx: 0, vy: 0 },
        { x: 300, y: 60, color: '#000000', vx: 0, vy: 0 },
        { x: 100, y: 240, color: '#FFFFFF', vx: 0, vy: 0 },
        { x: 200, y: 240, color: '#000000', vx: 0, vy: 0 },
        { x: 300, y: 250, color: '#FFFFFF', vx: 0, vy: 0 },
        { x: 300, y: 233, color: '#FFFFFF', vx: 0, vy: 0 },
        { x: 230, y: 240, color: '#FFFFFF', vx: 0, vy: 0 },
        { x: 120, y: 240, color: '#FFFFFF', vx: 0, vy: 0 },
    ]);
    const [dragging, setDragging] = useState(null);

    const diskRadius = 15;
    const centerCircleRadius = 20;
    const canvasWidth = 400;
    const canvasHeight = 500;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const drawBoard = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#D2B48C'; // Wood color
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);
            ctx.lineTo(canvas.width / 2 - centerCircleRadius, canvas.height / 2);
            ctx.moveTo(canvas.width / 2 + centerCircleRadius, canvas.height / 2);
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();

            ctx.fillStyle = '#CCCCCC';
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, centerCircleRadius, 0, Math.PI * 2);
            ctx.fill();
        };

        const drawDisks = () => {
            disks.forEach(({ x, y, color }) => {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, diskRadius, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        drawBoard();
        drawDisks();
    }, [disks]);

    const getMousePos = (canvas, evt) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
        };
    };

    const handleMouseDown = (e) => {
        const pos = getMousePos(canvasRef.current, e);
        const clickedDisk = disks.findIndex(
            (disk) => Math.hypot(disk.x - pos.x, disk.y - pos.y) < diskRadius
        );
        if (clickedDisk !== -1) setDragging(clickedDisk);
    };

    const handleMouseMove = (e) => {
        if (dragging !== null) {
            const pos = getMousePos(canvasRef.current, e);
            setDisks((prevDisks) =>
                prevDisks.map((disk, index) =>
                    index === dragging ? { ...disk, x: pos.x, y: pos.y } : disk
                )
            );
        }
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    const updatePositions = () => {
        setDisks((prevDisks) =>
            prevDisks.map((disk, index) => {
                let { x, y, vx, vy } = disk;

                const friction = 0.98; // Adjust as needed
                vx *= friction;
                vy *= friction;

                // Check wall collision
                if (x - diskRadius <= 0 || x + diskRadius >= canvasWidth) {
                    vx = -vx;
                }
                if (y - diskRadius <= 0 || y + diskRadius >= canvasHeight) {
                    vy = -vy;
                }

                // Check collision with middle wall, except center circle
                if (
                    y + diskRadius > canvasHeight / 2 - 2 &&
                    y - diskRadius < canvasHeight / 2 + 2 &&
                    Math.abs(x - canvasWidth / 2) > centerCircleRadius
                ) {
                    vy = -vy;
                }

                // Update position
                x += vx;
                y += vy;

                // Check collision with other disks
                for (let i = 0; i < prevDisks.length; i++) {
                    if (i !== index) {
                        const otherDisk = prevDisks[i];
                        const dx = otherDisk.x - x;
                        const dy = otherDisk.y - y;
                        const distance = Math.hypot(dx, dy);

                        if (distance < diskRadius * 2) {
                            const angle = Math.atan2(dy, dx);
                            const targetX = x + Math.cos(angle) * diskRadius * 2;
                            const targetY = y + Math.sin(angle) * diskRadius * 2;
                            const ax = (targetX - otherDisk.x) * 0.1;
                            const ay = (targetY - otherDisk.y) * 0.1;

                            vx -= ax;
                            vy -= ay;
                            otherDisk.vx += ax;
                            otherDisk.vy += ay;
                        }
                    }
                }

                return { ...disk, x, y, vx, vy };
            })
        );
    };

    useEffect(() => {
        const interval = setInterval(updatePositions, 1000 / 60);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className="border-4 border-gray-700 rounded-lg shadow-lg"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            ></canvas>
        </div>
    );
};

export default GameBoard;
