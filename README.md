# wp-ts-react-ssr-split-redux-drizzle
* webpack 4
* babel 7
* typescript 3
* ts-loader & fork-ts-checker-webpack-plugin
* SSR (loadable-components & styled-components)
* react-helmet for header rendering (useful for SEO)
* splitting via dynamic imports (loadable-components)
* react 16, redux 4, react-router 4, react-router-redux 5
* HMR
* truffle suite (truffle, ganache-cli, drizzle)
* antd
* css & less support
* i18next

Requires *Node v8* & *yarn*

Steps to bring up dev server:
```
yarn install
yarn ganache // console 1
yarn dev     // console 2
```
#### Commands
`yarn start` run the built server  
`yarn build` run production build  
`yarn dev` run dev server (runs truffle compile & migrate if no contract build dir)  
`yarn typecheck` run typescript check  
`yarn lint` run tslint  
`yarn ganache` run ganache-cli  
`yarn truffle` truffle compile & migrate  

#### Development Server Details   
**client** code is watched & served (HMR) by an express server with webpack-dev-middleware and webpack-hot-middleware.  
**server** code is watched by the webpack compiler.  
the **server** is run via nodemon api, restarting on changes & awaiting updates on crashes.  

#### Notes  
drizzle expects the window global, which is a problem for SSR. Therefore we have used patch-package 
(& postinstall-postinstall, for yarn) to patch the drizzle node_module upon install, add & remove.

If the server throws window undefined errors, run the following command & re- `yarn build` or `yarn dev`.  
`yarn patch-package`  
This will re-apply any module patches from the patches directory.
