"use strict";(self.webpackChunk_clean_stack_source=self.webpackChunk_clean_stack_source||[]).push([[7924],{49:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>o,contentTitle:()=>r,default:()=>h,frontMatter:()=>l,metadata:()=>d,toc:()=>a});var t=s(4848),i=s(8453);const l={sidebar_position:2},r="Installation Guide",d={id:"getting-started/installation",title:"Installation Guide",description:"A comprehensive guide to installing and configuring Clean Stack in your development environment.",source:"@site/docs/getting-started/installation.md",sourceDirName:"getting-started",slug:"/getting-started/installation",permalink:"/docs/getting-started/installation",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/getting-started/installation.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Quick Start Guide",permalink:"/docs/getting-started/quick-start"},next:{title:"Project Structure",permalink:"/docs/getting-started/project-structure"}},o={},a=[{value:"System Requirements",id:"system-requirements",level:2},{value:"Required Software",id:"required-software",level:3},{value:"Hardware Requirements",id:"hardware-requirements",level:3},{value:"Installation Steps",id:"installation-steps",level:2},{value:"1. Install Bun",id:"1-install-bun",level:3},{value:"2. Install Docker",id:"2-install-docker",level:3},{value:"3. Install Clean Stack CLI",id:"3-install-clean-stack-cli",level:3},{value:"4. Verify Installation",id:"4-verify-installation",level:3},{value:"Development Tools Setup",id:"development-tools-setup",level:2},{value:"IDE Configuration",id:"ide-configuration",level:3},{value:"Environment Setup",id:"environment-setup",level:3},{value:"Troubleshooting",id:"troubleshooting",level:2},{value:"Common Issues",id:"common-issues",level:3},{value:"Next Steps",id:"next-steps",level:2}];function c(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"installation-guide",children:"Installation Guide"}),"\n",(0,t.jsx)(n.p,{children:"A comprehensive guide to installing and configuring Clean Stack in your development environment."}),"\n",(0,t.jsx)(n.h2,{id:"system-requirements",children:"System Requirements"}),"\n",(0,t.jsx)(n.h3,{id:"required-software",children:"Required Software"}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:"Software"}),(0,t.jsx)(n.th,{children:"Minimum Version"}),(0,t.jsx)(n.th,{children:"Recommended Version"})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Node.js"}),(0,t.jsx)(n.td,{children:"18.0.0"}),(0,t.jsx)(n.td,{children:"20.0.0"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Bun"}),(0,t.jsx)(n.td,{children:"1.0.0"}),(0,t.jsx)(n.td,{children:"Latest"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Docker"}),(0,t.jsx)(n.td,{children:"20.10.0"}),(0,t.jsx)(n.td,{children:"Latest"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Docker Compose"}),(0,t.jsx)(n.td,{children:"2.0.0"}),(0,t.jsx)(n.td,{children:"Latest"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Git"}),(0,t.jsx)(n.td,{children:"2.0.0"}),(0,t.jsx)(n.td,{children:"Latest"})]})]})]}),"\n",(0,t.jsx)(n.h3,{id:"hardware-requirements",children:"Hardware Requirements"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"8GB RAM (minimum)"}),"\n",(0,t.jsx)(n.li,{children:"4 CPU cores (recommended)"}),"\n",(0,t.jsx)(n.li,{children:"20GB free disk space"}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"installation-steps",children:"Installation Steps"}),"\n",(0,t.jsx)(n.h3,{id:"1-install-bun",children:"1. Install Bun"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"curl -fsSL https://bun.sh/install | bash\n"})}),"\n",(0,t.jsx)(n.h3,{id:"2-install-docker",children:"2. Install Docker"}),"\n",(0,t.jsx)(n.p,{children:"Follow the official Docker installation guide for your operating system:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://docs.docker.com/desktop/windows/install/",children:"Docker for Windows"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://docs.docker.com/desktop/mac/install/",children:"Docker for macOS"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://docs.docker.com/engine/install/",children:"Docker for Linux"})}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"3-install-clean-stack-cli",children:"3. Install Clean Stack CLI"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"bun install -g @clean-stack/cli\n"})}),"\n",(0,t.jsx)(n.h3,{id:"4-verify-installation",children:"4. Verify Installation"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"clean-stack --version\n"})}),"\n",(0,t.jsx)(n.h2,{id:"development-tools-setup",children:"Development Tools Setup"}),"\n",(0,t.jsx)(n.h3,{id:"ide-configuration",children:"IDE Configuration"}),"\n",(0,t.jsx)(n.p,{children:"We recommend using Visual Studio Code with these extensions:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"ESLint"}),"\n",(0,t.jsx)(n.li,{children:"Prettier"}),"\n",(0,t.jsx)(n.li,{children:"Proto3"}),"\n",(0,t.jsx)(n.li,{children:"Docker"}),"\n",(0,t.jsx)(n.li,{children:"MongoDB for VS Code"}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"environment-setup",children:"Environment Setup"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"Clone the configuration files:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"clean-stack init-config\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsx)(n.li,{children:"Configure your environment variables:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"cp .env.example .env\n"})}),"\n",(0,t.jsx)(n.h2,{id:"troubleshooting",children:"Troubleshooting"}),"\n",(0,t.jsx)(n.h3,{id:"common-issues",children:"Common Issues"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.strong,{children:"Port Conflicts"})}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"# Check for port usage\nlsof -i :3000\nlsof -i :3001\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.strong,{children:"Docker Issues"})}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"# Reset Docker environment\ndocker system prune -a\n"})}),"\n",(0,t.jsx)(n.h2,{id:"next-steps",children:"Next Steps"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Follow our ",(0,t.jsx)(n.a,{href:"./quick-start",children:"Quick Start Guide"})]}),"\n",(0,t.jsxs)(n.li,{children:["Learn about ",(0,t.jsx)(n.a,{href:"./project-structure",children:"Project Structure"})]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>r,x:()=>d});var t=s(6540);const i={},l=t.createContext(i);function r(e){const n=t.useContext(l);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),t.createElement(l.Provider,{value:n},e.children)}}}]);