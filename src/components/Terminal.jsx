// src/components/Terminal.jsx
import React, { useState, useEffect, useRef } from "react";
import "./Terminal.css";

const Terminal = () => {
    const terminalRef = useRef(null);
    const [commandStack, setCommandStack] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleInput = (e) => {
        const value = e.target.value;
        setInputValue(value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            const newStack = [...commandStack, inputValue];
            setCommandStack(newStack);
            executeCommand(inputValue);
            setInputValue("");
            setCurrentIndex(newStack.length);
        } else if (e.key === "ArrowUp") {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setInputValue(commandStack[currentIndex - 1] || "");
            }
        } else if (e.key === "ArrowDown") {
            if (currentIndex < commandStack.length) {
                setCurrentIndex(currentIndex + 1);
                setInputValue(commandStack[currentIndex + 1] || "");
            }
        }
    };

    const executeCommand = (command) => {
        let response = "";
        switch (command) {
            case "help":
                response = "Available commands: help, contact, project, about, youtube, fetch, clear";
                break;
            case "contact":
                response = "Contact Information: Email: connorharris427@gmail.com";
                break;
            case "clear":
                terminalRef.current.innerHTML = "";
                return;
            case "about":
                response = "About Me: Connor Harris, a passionate programmer.";
                break;
            default:
                response = `Command not found: ${command}`;
        }
        const output = document.createElement("div");
        output.textContent = response;
        terminalRef.current.appendChild(output);
    };

    return (
        <div className="terminal" ref={terminalRef}>
            <div className="terminal-input-line">
                <span className="prompt">[guest@ConnorHarris.dev]$ </span>
                <input
                    type="text"
                    className="terminal-input"
                    value={inputValue}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            </div>
        </div>
    );
};

export default Terminal;
