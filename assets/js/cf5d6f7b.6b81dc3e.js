"use strict";(self.webpackChunk_clean_stack_source=self.webpackChunk_clean_stack_source||[]).push([[8276],{8077:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>o,contentTitle:()=>s,default:()=>h,frontMatter:()=>r,metadata:()=>c,toc:()=>l});var i=a(4848),t=a(8453);const r={sidebar_label:"Caching"},s="Cache Store for Clean Stack",c={id:"platform-features/caching",title:"Cache Store for Clean Stack",description:"What is Caching?",source:"@site/docs/platform-features/caching.md",sourceDirName:"platform-features",slug:"/platform-features/caching",permalink:"/docs/platform-features/caching",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/platform-features/caching.md",tags:[],version:"current",frontMatter:{sidebar_label:"Caching"},sidebar:"tutorialSidebar",previous:{title:"Platform Features",permalink:"/docs/category/platform-features"},next:{title:"Observability",permalink:"/docs/platform-features/observability/"}},o={},l=[{value:"What is Caching?",id:"what-is-caching",level:2},{value:"Why is Caching Necessary?",id:"why-is-caching-necessary",level:2},{value:"Cache Store Architecture",id:"cache-store-architecture",level:2},{value:"Implementation Idea",id:"implementation-idea",level:2},{value:"Cache Provider as a Parameter",id:"cache-provider-as-a-parameter",level:2},{value:"Significance of Invalidation Groups",id:"significance-of-invalidation-groups",level:2},{value:"Using the Cache Store with a REST API",id:"using-the-cache-store-with-a-rest-api",level:2}];function d(e){const n={admonition:"admonition",code:"code",h1:"h1",h2:"h2",li:"li",mermaid:"mermaid",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"cache-store-for-clean-stack",children:"Cache Store for Clean Stack"}),"\n",(0,i.jsx)(n.h2,{id:"what-is-caching",children:"What is Caching?"}),"\n",(0,i.jsx)(n.p,{children:"Caching is a technique used to store copies of frequently accessed data in a high-speed storage layer, allowing faster retrieval in subsequent requests. It significantly improves application performance by reducing the need to fetch data from slower storage systems or compute expensive operations repeatedly."}),"\n",(0,i.jsx)(n.h2,{id:"why-is-caching-necessary",children:"Why is Caching Necessary?"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Performance Improvement"}),": Caching reduces response times and increases throughput."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Resource Optimization"}),": It reduces load on backend systems and databases."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Scalability"}),": Caching helps applications handle more concurrent users."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Cost Reduction"}),": By reducing computational and network load, caching can lower infrastructure costs."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"cache-store-architecture",children:"Cache Store Architecture"}),"\n",(0,i.jsx)(n.mermaid,{value:"graph LR\n    A[Application] --\x3e|Uses| B[Cache Store]\n    B --\x3e|Interfaces with| C[Cache Provider]\n    C --\x3e|Implements| D[Redis]\n    C --\x3e|Implements| E[Memcached]\n    C --\x3e|Implements| F[In-Memory]\n    B --\x3e|Manages| G[Invalidation Groups]\n    B --\x3e|Tracks| H[Cache Statistics]"}),"\n",(0,i.jsx)(n.h2,{id:"implementation-idea",children:"Implementation Idea"}),"\n",(0,i.jsx)(n.p,{children:"The Cache Store in Clean Stack is designed with flexibility and efficiency in mind:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Abstraction"}),": The core ",(0,i.jsx)(n.code,{children:"CacheStore"})," interface abstracts the caching logic, allowing different cache providers to be used interchangeably."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Provider-Agnostic"}),": By accepting a ",(0,i.jsx)(n.code,{children:"CacheProvider"})," as a parameter, the implementation supports various caching solutions (Redis, Memcached, in-memory, etc.) without changing the core logic."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Invalidation Groups"}),": The store implements a group-based invalidation mechanism, allowing efficient invalidation of related cache entries."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Statistics Tracking"}),": Built-in statistics help monitor cache performance and usage."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"cache-provider-as-a-parameter",children:"Cache Provider as a Parameter"}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"CacheProvider"})," is passed as a parameter to the ",(0,i.jsx)(n.code,{children:"createCacheStore"})," function, offering several advantages:"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Flexibility"}),": Users can choose the most suitable caching solution for their needs (Redis, Memcached, in-memory, etc.)."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Testability"}),": It's easier to mock the cache provider in unit tests."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Dependency Injection"}),": This design follows the dependency injection principle, improving modularity and maintainability."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"significance-of-invalidation-groups",children:"Significance of Invalidation Groups"}),"\n",(0,i.jsx)(n.admonition,{title:"Invalidation groups are a powerful feature of this cache implementation:",type:"info",children:(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Efficient Bulk Invalidation"}),": Related cache entries can be invalidated together, useful for complex data relationships."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Fine-grained Control"}),": Allows selective invalidation without clearing the entire cache."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Consistency Management"}),": Helps maintain data consistency across related cache entries."]}),"\n"]})}),"\n",(0,i.jsx)(n.p,{children:"Usage example:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"await cacheStore.addOrReplace('user:1', userData, { groups: ['users', 'active-users'] });\n// Later, invalidate all user-related caches:\nawait cacheStore.invalidateGroup('users');\n"})}),"\n",(0,i.jsx)(n.h2,{id:"using-the-cache-store-with-a-rest-api",children:"Using the Cache Store with a REST API"}),"\n",(0,i.jsx)(n.p,{children:"To use this cache store with a REST API and Redis provider:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Create a Redis provider:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { RedisClientType } from 'redis';\nimport { CacheProvider } from '../cache';\n\nexport function gerRedisCacheProvider(client: RedisClientType): CacheProvider {\n  return {\n    set: async (key: string, value: string, ttl?: number) => {\n      await client.set(key, value, { EX: ttl });\n    },\n    get: async (key: string) => {\n      return await client.get(key);\n    },\n\n    delete: async (key: string) => {\n      await client.del(key);\n    },\n    deleteManyKeys: async (keys: string[]) => {\n      await client.del(keys);\n    },\n    clear: async () => {\n      await client.flushAll();\n    },\n    getAllKeys: async () => {\n      return await client.keys('*');\n    },\n  };\n}\n"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Set up the Redis client and cache provider:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { createClient } from 'redis';\nimport { getRedisCacheProvider } from './redisCacheProvider';\nimport { createCacheStore } from './cacheStore';\n\nconst redisClient = createClient({ url: 'redis://localhost:6379' });\nawait redisClient.connect();\n\nconst redisCacheProvider = getRedisCacheProvider(redisClient);\nconst cacheStore = createCacheStore(redisCacheProvider);\n"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Use in API routes:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"app.get('/users/:id', async (req, res) => {\n  const userId = req.params.id;\n  const cacheKey = `user:${userId}`;\n\n  // Try to get from cache\n  let userData = await cacheStore.get(cacheKey);\n\n  if (!userData) {\n    // If not in cache, fetch from database\n    userData = await fetchUserFromDatabase(userId);\n    // Cache the result\n    await cacheStore.addOrReplace(cacheKey, JSON.stringify(userData), { ttl: 3600, groups: ['users'] });\n  } else {\n    userData = JSON.parse(userData);\n  }\n\n  res.json(userData);\n});\n"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Invalidation example with group key ",(0,i.jsx)(n.code,{children:"users"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"app.post('/users', async (req, res) => {\n  // Create user in database\n  const newUser = await createUserInDatabase(req.body);\n\n  // Invalidate user-related caches\n  await cacheStore.invalidateGroup('users');\n\n  res.json(newUser);\n});\n"})}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"This implementation provides a flexible, efficient, and powerful caching solution for Clean Stack, enhancing performance and scalability while maintaining ease of use and adaptability to different caching backends."})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},8453:(e,n,a)=>{a.d(n,{R:()=>s,x:()=>c});var i=a(6540);const t={},r=i.createContext(t);function s(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);