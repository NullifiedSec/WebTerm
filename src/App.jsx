import React, { useEffect, useRef, useState } from 'react';
import './style.css';

const App = () => {
  const terminalRef = useRef(null);
  const [commandStack, setCommandStack] = useState([]);
  const [currentlyOnStack, setCurrentlyOnStack] = useState(0);

  useEffect(() => {
    if (terminalRef.current && !terminalRef.current.querySelector('.prompt')) {
        appendInput();
      }
  }, []);

  const appendResponse = (response) => {
    const output = document.createElement('div');
    const responseText = document.createElement('pre');
    responseText.innerHTML = response;
    output.appendChild(responseText);
    output.classList.add('output');
    terminalRef.current.appendChild(output);
  };

  const appendInput = () => {
    const prompt = document.createElement('div');
    prompt.classList.add('prompt');
    prompt.innerHTML = `
      <span class="user">guest</span>
      <span class="at">@</span>
      <span class="website">NullifiedSec.com</span>
      <span class="colon">:$ ~</span>
      <input class="terminal-input" type="text" /><span class="autocomplete"></span>
    `;
    terminalRef.current.appendChild(prompt);

    const input = prompt.querySelector('input.terminal-input');
    input.focus();

    const commandHistoryMovement = (direction) => {
      setCurrentlyOnStack((prev) => {
        const newIndex = direction ? Math.min(prev + 1, commandStack.length) : Math.max(prev - 1, 0);
        if (commandStack[newIndex]) input.value = commandStack[newIndex];
        else input.value = '';
        input.focus();
        input.setSelectionRange(1000, 1000);
        return newIndex;
      });
    };

    input.addEventListener('keydown', (e) => {
      const specialKeys = {
        Enter: () => {
          const value = input.value;
          setCommandStack((prev) => [...prev, value]);
          executeCommand(value);
          input.disabled = true;
          appendInput();
        },
        Tab: () => {
          e.preventDefault();
          const value = input.value;
          const args = value.split(' ');
          if (args.length === 1) {
            const commands = [
              'help',
              'github',
              'project',
              'clear',
              'about',
              'contact',
              'youtube',
              'fetch',
            ];
            const command = args[0];
            const matchingCommands = commands.filter((c) => c.startsWith(command));
            if (matchingCommands.length === 1) {
              input.value = matchingCommands[0];
            }
          } else if (args.length === 2) {
            const command = args[0];
            const arg = args[1];
            if (command === 'project') {
              const projects = ['raka.sh', 'httper', 'webterm', 'all'];
              const matchingProjects = projects.filter((p) => p.startsWith(arg));
              if (matchingProjects.length === 1) {
                input.value = `${command} ${matchingProjects[0]}`;
              }
            }
          }
        },
        ArrowUp: () => commandHistoryMovement(false),
        ArrowDown: () => commandHistoryMovement(true),
      };

      if (specialKeys[e.key]) {
        e.preventDefault();
        specialKeys[e.key]();
      }
    });

    input.addEventListener('input', () => {
      const value = input.value;
      const args = value.split(' ');
      if (args.length === 1) {
        const commands = [
          'help',
          'github',
          'project',
          'clear',
          'about',
          'contact',
          'youtube',
          'fetch',
        ];
        const command = args[0];
        const matchingCommands = commands.filter((c) => c.startsWith(command));
        if (matchingCommands.length === 1) {
          const autocomplete = input.parentElement.querySelector('.autocomplete');
          autocomplete.innerHTML = matchingCommands[0].slice(command.length);
        } else {
          const autocomplete = input.parentElement.querySelector('.autocomplete');
          autocomplete.innerHTML = '';
        }
      } else if (args.length === 2) {
        const command = args[0];
        const arg = args[1];
        if (command === 'project') {
          const projects = ['raka.sh', 'httper', 'webterm', 'all'];
          const matchingProjects = projects.filter((p) => p.startsWith(arg));
          if (matchingProjects.length === 1) {
            const autocomplete = input.parentElement.querySelector('.autocomplete');
            autocomplete.innerHTML = matchingProjects[0].slice(arg.length);
          } else {
            const autocomplete = input.parentElement.querySelector('.autocomplete');
            autocomplete.innerHTML = '';
          }
        }
      } else {
        const autocomplete = input.parentElement.querySelector('.autocomplete');
        autocomplete.innerHTML = '';
      }

      input.focus();
      input.setSelectionRange(1000, 1000);
    });
  };

  useEffect(() => {
    document.body.addEventListener('click', () => {
      const input = document.querySelector('input.terminal-input:not([disabled])');
      if (!input) return;
      input.focus();
    });
  }, []);

  const checkProject = (projectName) => {
    if (projectName === 'all') {
      return (
        checkProject('raka.sh') +
        checkProject('httper') +
        checkProject('WebTerm')
        // checkProject('Empty Tamplate')
      );
    } else if (projectName === 'raka.sh') {
      return `
      Project Information:
          - Project Name: raka.sh
          - Author: NullifiedSec
          - Description: A Simple Shell Written in python
          - URL: <a target="_blank" href="https://github.com/NullifiedSec/raka.sh">Link to Repo</a>`;
    } 
    // } else if  (projectName === 'wordle') {
    //     return `
    //     Project Information:
    //         - Project Name: Tamplate For New Projects Will Make a Admin Dashboard Back End Later
    //         - Author: Nullified Sec
    //         - Description: Loren Ipsum Dolor Sit Amet
    //         - URL: <a target="_blank" href="https://github.com/github/">Link to Repo</a>
    //         - YouTube Video: <a target="_blank" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Link to Video</a>`;
       else if (projectName === 'httper') {
        return `
        Project Information:
            - Project Name: Httper
            - Author: NullifiedSec
            - Description: A HTTP Server Written in Node.js
            - URL: <a target="_blank" href="https://github.com/NullifiedSec/Httper">Link to Repo</a>
            - YouTube Video: Comming Soon</a>`;

    } else if (projectName === 'webterm') {
        return `
        Project Information:
        - Project Name: WebTerm
        - Author: NullifiedSec
        - Description: A Portfolio Web Site Based On Terminal Theme
        - URL: <a target="_blank" href="https://github.com/NullifiedSec/WebTerm">Link to Repo</a>`;
              
      } else {
        return 'Please provide a project name from the list: raka.sh, httper, webterm, or all';
      }
    };


    const executeCommand = (command) => {
      if (command === 'help') {
        appendResponse(
          'Available commands: help, contact, project, about, youtube, fetch, clear'
        );
        return '';
      } else if (command === 'github') {
        const response = `GitHub Information:
            - GitHub Username: NullifiedSec
            - URL: <a target="_blank" href="https://github.com/NullifiedSec">Link to Github</a>`;
        appendResponse(response);
        return '';
      } else if (command.startsWith('project')) {
        const projectArgs = command.split(' ');
        if (projectArgs.length === 2) {
          const projectName = projectArgs[1];
          const response = `Project Information for ${projectName}: ${checkProject(
            projectName
          )}`;
          appendResponse(response);
          return '';
        } else {
          const response =
            'Please provide a project name from the list: raka.sh, httper, webterm, or all (eg. `project raka.sh`)';
          appendResponse(response);
          return '';
        }
      } else if (command === 'clear') {
        terminalRef.current.innerHTML = '';
        return '';
      } else if (command === 'about') {
        const response = `About Information:
            - Name: NullifiedSec (Mashrur Rahman)
            - Profession: Cyber Security Researcher
            - Experience: 3+ Years
            - Skills: Full Stack Development, Python, Javascript, C, Solidity, Linux Administrataion , Penestation Tesing and much more!`;
        appendResponse(response);
        return '';
      } else if (command === 'contact') {
        const response = `Contact Information:
            - Email: mashrur.sec@outlook.com or NullifiedSec@proton.me
            - Twitter: <a target="_blank" href="https://x.com/NullifiedSec">Link to Twitter (X) </a>`;
        appendResponse(response);
        return '';
      } else if (command === 'youtube') {
        const response = `YouTube Channel Information:
            - Channel Name: NullifiedSec
            - Channel: <a target="_blank" href="https://www.youtube.com/@NullifiedSec">Link to Channel</a>`;
        appendResponse(response);
        return '';
      } else if (command == 'fetch') {
        const response = `

NullifiedSec (Mashrur Rahman)@Information
-----------------------------------------
Name: NullifiedSec (Mashrur Rahman)
Age: 13
Location: Bangladesh
Languages: Javascript, C, Python
Operating System: Arch Linux
Hobbies: Making Fun Things
Text Editor: Neovim

Fun Facts:
- I am a Cyber Security Engineer and a Programmer
- Skills: Penetration Testing, Linux Administration, C, Python, Javascript, Solidity, Bash Scripting, MERN Stack Development
- Achievements: Hackthebox 1st rank holder in my country and a Successful Bug Bounty Hunter at the age of 13
`;
        appendResponse(response);
        return ``;
      } else {
        appendResponse(`${command}: command not found`);
        return '';
      }
    };

    return (
      <div ref={terminalRef} className="terminal"></div>
    );
  };

  export default App;
