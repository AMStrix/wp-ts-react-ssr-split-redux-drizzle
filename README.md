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
* e2e testing via Cypress
* unit testing via jest/enzyme

### Current issues
* SSR in dev mode doesn't reference styles initially, so there is an ugly moment until the css gets pulled. (not an issue in prod build)
* Full vendor CSS is bundled so SSR can reference it. Avoiding no style initial loads, but missing out on splitting.

Requires **Node v8** & **yarn**

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
* **contracts** On initial run the dev server will attempt to connect to ganache, retrieve the net id & check the contracts for matching ids - it will compile & migrate if files are missing or don't have the current net id.
* **client** code is watched & served (HMR) by an express server with webpack-dev-middleware and webpack-hot-middleware.  
* **server** code is watched by a webpack compiler.  
* the **server** is run via nodemon api, restarting on changes & awaiting updates on crashes.  

#### Notes  
drizzle expects the window global, which is a problem for SSR. Therefore we have used patch-package 
(& postinstall-postinstall, for yarn) to patch the drizzle node_module upon install, add & remove.

If the server throws window undefined errors, run the following command:   
`yarn patch-package`  
This will re-apply any module patches from the patches directory.
