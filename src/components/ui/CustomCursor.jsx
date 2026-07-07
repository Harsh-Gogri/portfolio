"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const imageRef = useRef(null);
  const buttonRef = useRef(null);
  const textRef = useRef(null);

  const [activeImage, setActiveImage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);

  const mouse = useRef({ x: 0, y: 0 });
  const imgPos = useRef({ x: 0, y: 0 });
  const btnPos = useRef({ x: 0, y: 0 });
  const textPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    const imgEl = imageRef.current;
    const btnEl = buttonRef.current;
    const textEl = textRef.current;
    if (!imgEl || !btnEl || !textEl) return;

    const clamp = gsap.utils.clamp(-10, 10);

    const update = () => {
      // 1. Image Lerp (~0.1)
      imgPos.current.x += (mouse.current.x - imgPos.current.x) * 0.1;
      imgPos.current.y += (mouse.current.y - imgPos.current.y) * 0.1;
      // Center the 420x315 image
      gsap.set(imgEl, { x: imgPos.current.x - 210, y: imgPos.current.y - 157.5 });

      // 2. Button Lerp (~0.08)
      btnPos.current.x += (mouse.current.x - btnPos.current.x) * 0.08;
      btnPos.current.y += (mouse.current.y - btnPos.current.y) * 0.08;
      // Center the 120x120 button
      gsap.set(btnEl, { x: btnPos.current.x - 60, y: btnPos.current.y - 60 });

      // 3. Text Magnetic Lerp (~0.12)
      const dx = mouse.current.x - btnPos.current.x;
      const dy = mouse.current.y - btnPos.current.y;

      const targetTextX = clamp(dx);
      const targetTextY = clamp(dy);

      textPos.current.x += (targetTextX - textPos.current.x) * 0.12;
      textPos.current.y += (targetTextY - textPos.current.y) * 0.12;

      gsap.set(textEl, { x: textPos.current.x, y: textPos.current.y });
    };

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      const target = e.target.closest("[data-hover-row]");
      if (target) {
        const imageUrl = target.getAttribute("data-image");

        if (!isVisibleRef.current) {
          setActiveImage(imageUrl || "");

          // Snap to cursor on enter
          imgPos.current.x = e.clientX;
          imgPos.current.y = e.clientY;
          btnPos.current.x = e.clientX;
          btnPos.current.y = e.clientY;

          gsap.set(imgEl, { x: e.clientX - 210, y: e.clientY - 157.5 });
          gsap.set(btnEl, { x: e.clientX - 60, y: e.clientY - 60 });

          // Instantly popup (0.2s easing)
          gsap.to(imgEl, { scale: 1, duration: 0.2, ease: "power2.out" });
          gsap.to(btnEl, { scale: 1, duration: 0.2, ease: "power2.out" });

          // Clean text tweens
          textPos.current.x = 0;
          textPos.current.y = 0;
          gsap.set(textEl, { x: 0, y: 0 });
          gsap.killTweensOf(textEl);

          setIsVisible(true);
          gsap.ticker.add(update);
        } else {
          setActiveImage(imageUrl || "");
        }
      } else {
        if (isVisibleRef.current) {
          setIsVisible(false);
          gsap.ticker.remove(update);

          // Collapse
          gsap.to(imgEl, { scale: 0, duration: 0.2, ease: "power2.in" });
          gsap.to(btnEl, { scale: 0, duration: 0.2, ease: "power2.in" });

          gsap.to(textEl, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
          textPos.current.x = 0;
          textPos.current.y = 0;
        }
      }
    };

    const onScroll = () => {
      // Find the element currently under the last known mouse position
      const element = document.elementFromPoint(mouse.current.x, mouse.current.y);
      if (!element) {
        if (isVisibleRef.current) {
          setIsVisible(false);
          gsap.ticker.remove(update);
          gsap.to(imgEl, { scale: 0, duration: 0.2, ease: "power2.in" });
          gsap.to(btnEl, { scale: 0, duration: 0.2, ease: "power2.in" });
          gsap.to(textEl, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
          textPos.current.x = 0;
          textPos.current.y = 0;
        }
        return;
      }

      const target = element.closest("[data-hover-row]");
      if (target) {
        const imageUrl = target.getAttribute("data-image");
        setActiveImage(imageUrl || "");

        if (!isVisibleRef.current) {
          // Snap to cursor on scroll enter
          imgPos.current.x = mouse.current.x;
          imgPos.current.y = mouse.current.y;
          btnPos.current.x = mouse.current.x;
          btnPos.current.y = mouse.current.y;

          gsap.set(imgEl, { x: mouse.current.x - 210, y: mouse.current.y - 157.5 });
          gsap.set(btnEl, { x: mouse.current.x - 60, y: mouse.current.y - 60 });

          gsap.to(imgEl, { scale: 1, duration: 0.2, ease: "power2.out" });
          gsap.to(btnEl, { scale: 1, duration: 0.2, ease: "power2.out" });

          textPos.current.x = 0;
          textPos.current.y = 0;
          gsap.set(textEl, { x: 0, y: 0 });
          gsap.killTweensOf(textEl);

          setIsVisible(true);
          gsap.ticker.add(update);
        }
      } else {
        if (isVisibleRef.current) {
          setIsVisible(false);
          gsap.ticker.remove(update);

          // Collapse
          gsap.to(imgEl, { scale: 0, duration: 0.2, ease: "power2.in" });
          gsap.to(btnEl, { scale: 0, duration: 0.2, ease: "power2.in" });

          gsap.to(textEl, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
          textPos.current.x = 0;
          textPos.current.y = 0;
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <>
      <div
        ref={imageRef}
        className={styles.floatingImage}
        style={{ opacity: activeImage ? 1 : 0 }}
      >
        <img
          src={activeImage || "/images/assets/work/UPI Shield/upi-shield.avif"}
          alt=""
          className={styles.image}
        />
      </div>
      <div ref={buttonRef} className={styles.button}>
        <span ref={textRef} className={styles.text}>
          View
        </span>
      </div>
    </>
  );
}
