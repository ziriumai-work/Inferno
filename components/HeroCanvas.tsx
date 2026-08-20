"use client";

import React, { useRef, useEffect } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    class Ember {
      x!: number;
      y!: number;
      size!: number;
      speedY!: number;
      speedX!: number;
      alpha!: number;
      decay!: number;
      color!: string;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = Math.random() * 1.2 + 0.4;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.alpha = Math.random() * 0.4 + 0.3; // High visual contrast on white
        this.decay = Math.random() * 0.0012 + 0.0006;
        this.color = Math.random() > 0.45 ? "rgba(225, 77, 24, 0.45)" : "rgba(217, 119, 6, 0.45)";
      }

      update(mX: number | null, mY: number | null) {
        this.y -= this.speedY;
        this.x += this.speedX;

        // Soft wind repel from mouse
        if (mX !== null && mY !== null) {
          const dx = this.x - mX;
          const dy = this.y - mY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            this.x += (dx / dist) * force * 1.5;
          }
        }

        this.alpha -= this.decay;
        if (this.alpha <= 0 || this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.alpha;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    const embers = Array.from({ length: 55 }, () => new Ember());
    let mouseX: number | null = null;
    let mouseY: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = null;
      mouseY = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const drawGridLines = () => {
      ctx.strokeStyle = "rgba(0, 0, 0, 0.015)";
      ctx.lineWidth = 1;
      const step = 80;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      drawGridLines();

      embers.forEach((ember) => {
        ember.update(mouseX, mouseY);
        ember.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="hero-canvas" ref={canvasRef} />;
}
