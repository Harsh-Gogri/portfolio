"use client";

import { useState, useRef } from "react";
import styles from "./Accordion.module.css";

function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <div className={styles.item}>
      <button
        className={styles.header}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.title}>{title}</span>
        <span className={styles.icon}>{isOpen ? "−" : "+"}</span>
      </button>
      <div
        className={styles.contentWrapper}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px"
        }}
      >
        <div ref={contentRef} className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Accordion({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.accordion}>
      {items.map((item, idx) => (
        <AccordionItem key={idx} title={item.title}>
          {item.children}
        </AccordionItem>
      ))}
    </div>
  );
}
