"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROFILE_PHOTO_SRC } from "@/lib/profilePhoto";
import styles from "./Hero.module.css";

const LEAVE_DELAY_MS = 120;

export default function Hero() {
  const nameRef = useRef(null);
  const leaveTimerRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);

  const tooltipOpen = hover || focused;

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimerRef.current != null) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const handleWrapMouseEnter = useCallback(() => {
    clearLeaveTimer();
    setHover(true);
  }, [clearLeaveTimer]);

  const handleWrapMouseLeave = useCallback(() => {
    clearLeaveTimer();
    leaveTimerRef.current = window.setTimeout(() => {
      leaveTimerRef.current = null;
      setHover(false);
      const el = nameRef.current;
      if (el && document.activeElement === el) {
        el.blur();
      }
    }, LEAVE_DELAY_MS);
  }, [clearLeaveTimer]);

  useEffect(() => () => clearLeaveTimer(), [clearLeaveTimer]);

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.inner}>
        <h1 id="hero-heading" className={styles.title}>
          Somewhere between make it pop and what&apos;s the success metric, I
          realized I was more interested in the second question.
        </h1>
        <p className={styles.description}>
          I&apos;m{" "}
          <span
            className={`${styles.nameWrap} ${tooltipOpen ? styles.nameWrapOpen : ""}`}
            onMouseEnter={handleWrapMouseEnter}
            onMouseLeave={handleWrapMouseLeave}
          >
            <span
              ref={nameRef}
              className={styles.name}
              tabIndex={0}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            >
              Harsh Gogri
            </span>
            <span className={styles.tooltip} aria-hidden={!tooltipOpen}>
              <Image
                src={PROFILE_PHOTO_SRC}
                alt=""
                width={132}
                height={132}
                className={styles.tooltipImage}
                sizes="132px"
              />
            </span>
          </span>
          , a designer moving into product. In an age where AI lets anyone ship
          anything overnight, I want to work on the things that are actually
          worth shipping.
        </p>
      </div>
    </section>
  );
}
