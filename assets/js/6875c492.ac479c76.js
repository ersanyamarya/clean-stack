"use strict";(self.webpackChunk_clean_stack_source=self.webpackChunk_clean_stack_source||[]).push([[4813],{665:(e,t,a)=>{a.d(t,{A:()=>c});a(6540);var n=a(4164),s=a(7289),r=a(204),i=a(2362),l=a(4848);function o(e){var t=e.className;return(0,l.jsx)(i.A,{type:"caution",title:(0,l.jsx)(s.Rc,{}),className:(0,n.A)(t,r.G.common.unlistedBanner),children:(0,l.jsx)(s.Uh,{})})}function c(e){return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(s.AE,{}),(0,l.jsx)(o,Object.assign({},e))]})}},1926:(e,t,a)=>{a.d(t,{ZD:()=>i,uz:()=>l});a(6540);var n=a(539),s=a(1430);a(4848);function r(){var e=(0,s.W)().selectMessage;return function(t){return e(t,(0,n.T)({id:"theme.blog.post.plurals",description:'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One post|{count} posts"},{count:t}))}}function i(e){var t=r();return(0,n.T)({id:"theme.blog.tagTitle",description:"The title of the page for a blog tag",message:'{nPosts} tagged with "{tagName}"'},{nPosts:t(e.count),tagName:e.label})}var l=function(){return(0,n.T)({id:"theme.blog.authorsList.pageTitle",message:"Authors",description:"The title of the authors page"})}},4005:(e,t,a)=>{a.d(t,{A:()=>i});a(6540);var n=a(3750),s=a(8189),r=a(4848);function i(e){var t=e.items,a=e.component,i=void 0===a?s.A:a;return(0,r.jsx)(r.Fragment,{children:t.map((function(e){var t=e.content;return(0,r.jsx)(n.in,{content:t,children:(0,r.jsx)(i,{children:(0,r.jsx)(t,{})})},t.metadata.permalink)}))})}},6956:(e,t,a)=>{a.r(t),a.d(t,{default:()=>b});a(6540);var n=a(4164),s=a(539),r=a(1082),i=a(204),l=a(1926),o=a(6289),c=a(569),d=a(7448),u=a(7220),g=a(4005),m=a(665),h=a(9303),p=a(4848);function x(e){var t=e.tag,a=(0,l.ZD)(t);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(r.be,{title:a,description:t.description}),(0,p.jsx)(u.A,{tag:"blog_tags_posts"})]})}function j(e){var t=e.tag,a=e.items,n=e.sidebar,r=e.listMetadata,i=(0,l.ZD)(t);return(0,p.jsxs)(c.A,{sidebar:n,children:[t.unlisted&&(0,p.jsx)(m.A,{}),(0,p.jsxs)("header",{className:"margin-bottom--xl",children:[(0,p.jsx)(h.A,{as:"h1",children:i}),t.description&&(0,p.jsx)("p",{children:t.description}),(0,p.jsx)(o.A,{href:t.allTagsPath,children:(0,p.jsx)(s.A,{id:"theme.tags.tagsPageLink",description:"The label of the link targeting the tag list page",children:"View All Tags"})})]}),(0,p.jsx)(g.A,{items:a}),(0,p.jsx)(d.A,{metadata:r})]})}function b(e){return(0,p.jsxs)(r.e3,{className:(0,n.A)(i.G.wrapper.blogPages,i.G.page.blogTagPostListPage),children:[(0,p.jsx)(x,Object.assign({},e)),(0,p.jsx)(j,Object.assign({},e))]})}},7289:(e,t,a)=>{a.d(t,{AE:()=>o,Rc:()=>i,TT:()=>d,Uh:()=>l,Yh:()=>c});a(6540);var n=a(539),s=a(7143),r=a(4848);function i(){return(0,r.jsx)(n.A,{id:"theme.contentVisibility.unlistedBanner.title",description:"The unlisted content banner title",children:"Unlisted page"})}function l(){return(0,r.jsx)(n.A,{id:"theme.contentVisibility.unlistedBanner.message",description:"The unlisted content banner message",children:"This page is unlisted. Search engines will not index it, and only users having a direct link can access it."})}function o(){return(0,r.jsx)(s.A,{children:(0,r.jsx)("meta",{name:"robots",content:"noindex, nofollow"})})}function c(){return(0,r.jsx)(n.A,{id:"theme.contentVisibility.draftBanner.title",description:"The draft content banner title",children:"Draft page"})}function d(){return(0,r.jsx)(n.A,{id:"theme.contentVisibility.draftBanner.message",description:"The draft content banner message",children:"This page is a draft. It will only be visible in dev and be excluded from the production build."})}},7448:(e,t,a)=>{a.d(t,{A:()=>i});a(6540);var n=a(539),s=a(1865),r=a(4848);function i(e){var t=e.metadata,a=t.previousPage,i=t.nextPage;return(0,r.jsxs)("nav",{className:"pagination-nav","aria-label":(0,n.T)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"}),children:[a&&(0,r.jsx)(s.A,{permalink:a,title:(0,r.jsx)(n.A,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)",children:"Newer entries"})}),i&&(0,r.jsx)(s.A,{permalink:i,title:(0,r.jsx)(n.A,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)",children:"Older entries"}),isNext:!0})]})}},8189:(e,t,a)=>{a.d(t,{A:()=>C});a(6540);var n=a(4164),s=a(3750),r=a(4848);function i(e){var t=e.children,a=e.className;return(0,r.jsx)("article",{className:a,children:t})}var l=a(6289);const o={title:"title_f1Hy"};function c(e){var t=e.className,a=(0,s.e7)(),i=a.metadata,c=a.isBlogPostPage,d=i.permalink,u=i.title,g=c?"h1":"h2";return(0,r.jsx)(g,{className:(0,n.A)(o.title,t),children:c?u:(0,r.jsx)(l.A,{to:d,children:u})})}var d=a(539),u=a(1430),g=a(8569);const m={container:"container_mt6G"};function h(e){var t,a=e.readingTime,n=(t=(0,u.W)().selectMessage,function(e){var a=Math.ceil(e);return t(a,(0,d.T)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:a}))});return(0,r.jsx)(r.Fragment,{children:n(a)})}function p(e){var t=e.date,a=e.formattedDate;return(0,r.jsx)("time",{dateTime:t,children:a})}function x(){return(0,r.jsx)(r.Fragment,{children:" \xb7 "})}function j(e){var t,a=e.className,i=(0,s.e7)().metadata,l=i.date,o=i.readingTime,c=(0,g.i)({day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});return(0,r.jsxs)("div",{className:(0,n.A)(m.container,"margin-vert--md",a),children:[(0,r.jsx)(p,{date:l,formattedDate:(t=l,c.format(new Date(t)))}),void 0!==o&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(x,{}),(0,r.jsx)(h,{readingTime:o})]})]})}var b=a(5921);const f={authorCol:"authorCol_Hf19",imageOnlyAuthorRow:"imageOnlyAuthorRow_pa_O",imageOnlyAuthorCol:"imageOnlyAuthorCol_G86a"};function A(e){var t=e.className,a=(0,s.e7)(),i=a.metadata.authors,l=a.assets;if(0===i.length)return null;var o=i.every((function(e){return!e.name})),c=1===i.length;return(0,r.jsx)("div",{className:(0,n.A)("margin-top--md margin-bottom--sm",o?f.imageOnlyAuthorRow:"row",t),children:i.map((function(e,t){var a;return(0,r.jsx)("div",{className:(0,n.A)(!o&&(c?"col col--12":"col col--6"),o?f.imageOnlyAuthorCol:f.authorCol),children:(0,r.jsx)(b.A,{author:Object.assign({},e,{imageURL:null!=(a=l.authorsImageUrls[t])?a:e.imageURL})})},t)}))})}function v(){return(0,r.jsxs)("header",{children:[(0,r.jsx)(c,{}),(0,r.jsx)(j,{}),(0,r.jsx)(A,{})]})}var T=a(99),N=a(8327);function w(e){var t=e.children,a=e.className,i=(0,s.e7)().isBlogPostPage;return(0,r.jsx)("div",{id:i?T.LU:void 0,className:(0,n.A)("markdown",a),children:(0,r.jsx)(N.A,{children:t})})}var y=a(204),P=a(5783),k=a(6239),_=a(2020),U=["blogPostTitle"];function O(){return(0,r.jsx)("b",{children:(0,r.jsx)(d.A,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts",children:"Read more"})})}function R(e){var t=e.blogPostTitle,a=(0,_.A)(e,U);return(0,r.jsx)(l.A,Object.assign({"aria-label":(0,d.T)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:t})},a,{children:(0,r.jsx)(O,{})}))}function B(){var e=(0,s.e7)(),t=e.metadata,a=e.isBlogPostPage,i=t.tags,l=t.title,o=t.editUrl,c=t.hasTruncateMarker,d=t.lastUpdatedBy,u=t.lastUpdatedAt,g=!a&&c,m=i.length>0;if(!(m||g||o))return null;if(a){var h=!!(o||u||d);return(0,r.jsxs)("footer",{className:"docusaurus-mt-lg",children:[m&&(0,r.jsx)("div",{className:(0,n.A)("row","margin-top--sm",y.G.blog.blogFooterEditMetaRow),children:(0,r.jsx)("div",{className:"col",children:(0,r.jsx)(k.A,{tags:i})})}),h&&(0,r.jsx)(P.A,{className:(0,n.A)("margin-top--sm",y.G.blog.blogFooterEditMetaRow),editUrl:o,lastUpdatedAt:u,lastUpdatedBy:d})]})}return(0,r.jsxs)("footer",{className:"row docusaurus-mt-lg",children:[m&&(0,r.jsx)("div",{className:(0,n.A)("col",{"col--9":g}),children:(0,r.jsx)(k.A,{tags:i})}),g&&(0,r.jsx)("div",{className:(0,n.A)("col text--right",{"col--3":m}),children:(0,r.jsx)(R,{blogPostTitle:l,to:t.permalink})})]})}function C(e){var t=e.children,a=e.className,l=(0,s.e7)().isBlogPostPage?void 0:"margin-bottom--xl";return(0,r.jsxs)(i,{className:(0,n.A)(l,a),children:[(0,r.jsx)(v,{}),(0,r.jsx)(w,{children:t}),(0,r.jsx)(B,{})]})}}}]);