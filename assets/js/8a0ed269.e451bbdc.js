"use strict";(self.webpackChunk_clean_stack_source=self.webpackChunk_clean_stack_source||[]).push([[5282],{1003:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>a,contentTitle:()=>l,default:()=>p,frontMatter:()=>i,metadata:()=>t,toc:()=>c});const t=JSON.parse('{"id":"platform-features/observability/exporters","title":"OpenTelemetry Exporters","description":"This guide explains how Clean Stack configures and uses OpenTelemetry exporters for sending telemetry data to various backends.","source":"@site/docs/platform-features/observability/exporters.md","sourceDirName":"platform-features/observability","slug":"/platform-features/observability/exporters","permalink":"/docs/platform-features/observability/exporters","draft":false,"unlisted":false,"editUrl":"https://github.com/ersanyamarya/clean-stack/tree/main/apps/clean-docs/docs/platform-features/observability/exporters.md","tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3},"sidebar":"tutorialSidebar","previous":{"title":"Grafana Integration","permalink":"/docs/platform-features/observability/grafana-stack"},"next":{"title":"Advanced Configuration","permalink":"/docs/platform-features/observability/advanced"}}');var s=n(4848),o=n(8453);const i={sidebar_position:3},l="OpenTelemetry Exporters",a={},c=[{value:"Configured Exporters",id:"configured-exporters",level:2},{value:"Trace Exporters",id:"trace-exporters",level:3},{value:"Metrics Exporters",id:"metrics-exporters",level:3},{value:"Configuration",id:"configuration",level:2},{value:"Custom Exporters",id:"custom-exporters",level:2}];function d(e){const r={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(r.header,{children:(0,s.jsx)(r.h1,{id:"opentelemetry-exporters",children:"OpenTelemetry Exporters"})}),"\n",(0,s.jsx)(r.p,{children:"This guide explains how Clean Stack configures and uses OpenTelemetry exporters for sending telemetry data to various backends."}),"\n",(0,s.jsx)(r.h2,{id:"configured-exporters",children:"Configured Exporters"}),"\n",(0,s.jsx)(r.p,{children:"Clean Stack comes pre-configured with the following exporters:"}),"\n",(0,s.jsx)(r.h3,{id:"trace-exporters",children:"Trace Exporters"}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"OTLP Trace Exporter"}),": Sends trace data to the OpenTelemetry Collector using gRPC","\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:["Default endpoint: ",(0,s.jsx)(r.code,{children:"localhost:4317"})]}),"\n",(0,s.jsx)(r.li,{children:"Protocol: gRPC"}),"\n",(0,s.jsxs)(r.li,{children:["Configurable via environment variables:","\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsx)(r.li,{children:(0,s.jsx)(r.code,{children:"OTEL_EXPORTER_OTLP_ENDPOINT"})}),"\n",(0,s.jsx)(r.li,{children:(0,s.jsx)(r.code,{children:"OTEL_EXPORTER_OTLP_HEADERS"})}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(r.h3,{id:"metrics-exporters",children:"Metrics Exporters"}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"OTLP Metrics Exporter"}),": Sends metrics data to the OpenTelemetry Collector using gRPC","\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsx)(r.li,{children:"Same configuration options as the trace exporter"}),"\n",(0,s.jsx)(r.li,{children:"Supports aggregation and temporality options"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(r.h2,{id:"configuration",children:"Configuration"}),"\n",(0,s.jsx)(r.p,{children:"The exporters are configured in the following locations:"}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:["Backend: ",(0,s.jsx)(r.code,{children:"platform-features/backend-telemetry/src/config.ts"})]}),"\n",(0,s.jsxs)(r.li,{children:["Frontend: ",(0,s.jsx)(r.code,{children:"frontend-libs/frontend-telemetry/src/config.ts"})]}),"\n"]}),"\n",(0,s.jsx)(r.p,{children:"Example configuration:"}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{className:"language-typescript",children:"export const tracerConfig = {\n  collectorOptions: {\n    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',\n    headers: JSON.parse(process.env.OTEL_EXPORTER_OTLP_HEADERS || '{}'),\n  },\n};\n"})}),"\n",(0,s.jsx)(r.h2,{id:"custom-exporters",children:"Custom Exporters"}),"\n",(0,s.jsx)(r.p,{children:"To add a custom exporter:"}),"\n",(0,s.jsxs)(r.ol,{children:["\n",(0,s.jsx)(r.li,{children:"Install the exporter package"}),"\n",(0,s.jsx)(r.li,{children:"Configure the exporter in the relevant configuration file"}),"\n",(0,s.jsx)(r.li,{children:"Register the exporter with the SDK"}),"\n"]}),"\n",(0,s.jsxs)(r.p,{children:["For more advanced configuration options, see the ",(0,s.jsx)(r.a,{href:"./advanced",children:"Advanced Configuration"})," guide."]})]})}function p(e={}){const{wrapper:r}={...(0,o.R)(),...e.components};return r?(0,s.jsx)(r,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},8453:(e,r,n)=>{n.d(r,{R:()=>i,x:()=>l});var t=n(6540);const s={},o=t.createContext(s);function i(e){const r=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function l(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),t.createElement(o.Provider,{value:r},e.children)}}}]);