"use strict";(self.webpackChunk_clean_stack_source=self.webpackChunk_clean_stack_source||[]).push([[467],{9609:(e,i,t)=>{t.r(i),t.d(i,{assets:()=>o,contentTitle:()=>s,default:()=>m,frontMatter:()=>a,metadata:()=>l,toc:()=>c});var r=t(4848),n=t(8453);const a={sidebar_label:"Rate Limiter"},s="Rate Limiter for Clean Stack",l={id:"platform-features/rate-limiter",title:"Rate Limiter for Clean Stack",description:"What is Rate Limiting?",source:"@site/docs/platform-features/rate-limiter.md",sourceDirName:"platform-features",slug:"/platform-features/rate-limiter",permalink:"/docs/platform-features/rate-limiter",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/platform-features/rate-limiter.md",tags:[],version:"current",frontMatter:{sidebar_label:"Rate Limiter"},sidebar:"tutorialSidebar",previous:{title:"Backend-Telemetry Library and Usage",permalink:"/docs/platform-features/observability/backend-telemetry"}},o={},c=[{value:"What is Rate Limiting?",id:"what-is-rate-limiting",level:2},{value:"Why is Rate Limiting Necessary?",id:"why-is-rate-limiting-necessary",level:2},{value:"Rate Limiter Architecture",id:"rate-limiter-architecture",level:2},{value:"Implementation Idea",id:"implementation-idea",level:2},{value:"Rate Limiter Provider as a Parameter",id:"rate-limiter-provider-as-a-parameter",level:2},{value:"Significance of Rate Limit Policies",id:"significance-of-rate-limit-policies",level:2},{value:"Using the Rate Limiter with a REST API",id:"using-the-rate-limiter-with-a-rest-api",level:2}];function d(e){const i={admonition:"admonition",code:"code",h1:"h1",h2:"h2",li:"li",mermaid:"mermaid",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,n.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(i.h1,{id:"rate-limiter-for-clean-stack",children:"Rate Limiter for Clean Stack"}),"\n",(0,r.jsx)(i.h2,{id:"what-is-rate-limiting",children:"What is Rate Limiting?"}),"\n",(0,r.jsx)(i.p,{children:"Rate limiting is a technique used to control the number of requests a user can make to a server within a specified time frame. It helps in managing server load, preventing abuse, and ensuring fair usage of resources."}),"\n",(0,r.jsx)(i.h2,{id:"why-is-rate-limiting-necessary",children:"Why is Rate Limiting Necessary?"}),"\n",(0,r.jsxs)(i.ol,{children:["\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.strong,{children:"Prevent Abuse"}),": Protects against denial-of-service attacks and other malicious activities."]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.strong,{children:"Resource Management"}),": Ensures fair distribution of resources among users."]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.strong,{children:"Performance Stability"}),": Maintains consistent performance by preventing server overload."]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.strong,{children:"Cost Control"}),": Reduces costs associated with excessive resource usage."]}),"\n"]}),"\n",(0,r.jsx)(i.h2,{id:"rate-limiter-architecture",children:"Rate Limiter Architecture"}),"\n",(0,r.jsx)(i.mermaid,{value:"graph LR\n    A[Application] --\x3e|Uses| B[Rate Limiter]\n    B --\x3e|Interfaces with| C[Rate Limiter Provider]\n    B --\x3e|Manages| E[Rate Limit Policies]"}),"\n",(0,r.jsx)(i.h2,{id:"implementation-idea",children:"Implementation Idea"}),"\n",(0,r.jsx)(i.p,{children:"The Rate Limiter in Clean Stack is designed with flexibility and efficiency in mind:"}),"\n",(0,r.jsxs)(i.ol,{children:["\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.strong,{children:"Abstraction"}),": The core ",(0,r.jsx)(i.code,{children:"RateLimiter"})," interface abstracts the rate limiting logic, allowing different rate limiting strategies to be used interchangeably."]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.strong,{children:"Provider-Agnostic"}),": By accepting a ",(0,r.jsx)(i.code,{children:"RateLimiterProvider"})," as a parameter, the implementation supports various rate limiting strategies without changing the core logic."]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.strong,{children:"Policy Management"}),": The limiter implements a policy-based management system, allowing efficient configuration of rate limits."]}),"\n"]}),"\n",(0,r.jsx)(i.h2,{id:"rate-limiter-provider-as-a-parameter",children:"Rate Limiter Provider as a Parameter"}),"\n",(0,r.jsxs)(i.p,{children:["The ",(0,r.jsx)(i.code,{children:"RateLimiterProvider"})," is passed as a parameter to the ",(0,r.jsx)(i.code,{children:"createRateLimiter"})," function, offering several advantages:"]}),"\n",(0,r.jsxs)(i.ol,{children:["\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.strong,{children:"Flexibility"}),": Users can choose the most suitable rate limiting strategy for their needs."]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.strong,{children:"Testability"}),": It's easier to mock the rate limiter provider in unit tests."]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.strong,{children:"Dependency Injection"}),": This design follows the dependency injection principle, improving modularity and maintainability."]}),"\n"]}),"\n",(0,r.jsx)(i.h2,{id:"significance-of-rate-limit-policies",children:"Significance of Rate Limit Policies"}),"\n",(0,r.jsx)(i.admonition,{title:"Rate limit policies are a powerful feature of this rate limiter implementation:",type:"info",children:(0,r.jsxs)(i.ol,{children:["\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.strong,{children:"Efficient Traffic Management"}),": Allows fine-grained control over traffic flow."]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.strong,{children:"Customizable Limits"}),": Supports different limits for different users or endpoints."]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.strong,{children:"Consistency Management"}),": Helps maintain consistent application performance."]}),"\n"]})}),"\n",(0,r.jsx)(i.p,{children:"Usage example:"}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{className:"language-typescript",children:"await rateLimiter.isAllowedRateLimit('user:1');\n"})}),"\n",(0,r.jsx)(i.h2,{id:"using-the-rate-limiter-with-a-rest-api",children:"Using the Rate Limiter with a REST API"}),"\n",(0,r.jsx)(i.p,{children:"To use this rate limiter with a REST API:"}),"\n",(0,r.jsxs)(i.ol,{children:["\n",(0,r.jsxs)(i.li,{children:["\n",(0,r.jsx)(i.p,{children:"Create a Rate Limiter provider:"}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{className:"language-typescript",children:"import { RateLimiterProvider } from '../rate-limiter';\n\nexport function getRateLimiterProvider(): RateLimiterProvider {\n  return {\n    set: async (key: string, value: string, ttl?: number) => {\n      // Implement set logic here\n    },\n    get: async (key: string) => {\n      // Return stored value\n    },\n  };\n}\n"})}),"\n"]}),"\n",(0,r.jsxs)(i.li,{children:["\n",(0,r.jsx)(i.p,{children:"Set up the rate limiter provider:"}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{className:"language-typescript",children:"import { getRateLimiterProvider } from './rateLimiterProvider';\nimport { createRateLimiter } from './rateLimiter';\n\nconst rateLimiterProvider = getRateLimiterProvider();\nconst rateLimiter = createRateLimiter(rateLimiterProvider, { maxRequests: 100, duration: 3600 });\n"})}),"\n"]}),"\n",(0,r.jsxs)(i.li,{children:["\n",(0,r.jsx)(i.p,{children:"Use in API routes:"}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{className:"language-typescript",children:"app.get('/users/:id', async (req, res) => {\n  const userId = req.params.id;\n  const rateLimitKey = `user:${userId}`;\n\n  // Apply rate limiting\n  const isAllowed = await rateLimiter.isAllowedRateLimit(rateLimitKey);\n  if (!isAllowed) {\n    return res.status(429).send('Too Many Requests');\n  }\n\n  // Fetch user data\n  const userData = await fetchUserFromDatabase(userId);\n\n  res.json(userData);\n});\n"})}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(i.p,{children:"This implementation provides a flexible, efficient, and powerful rate limiting solution for Clean Stack, enhancing performance and scalability while maintaining ease of use and adaptability to different rate limiting strategies."})]})}function m(e={}){const{wrapper:i}={...(0,n.R)(),...e.components};return i?(0,r.jsx)(i,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},8453:(e,i,t)=>{t.d(i,{R:()=>s,x:()=>l});var r=t(6540);const n={},a=r.createContext(n);function s(e){const i=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function l(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:s(e.components),r.createElement(a.Provider,{value:i},e.children)}}}]);