import * as React from 'react';
import Helmet from 'react-helmet';

export interface Props {
  children: any;
  css: string[];
  scripts: string[];
  state: string;
  loadableStateScript: string;
  styleElements: any;
}

export default class HTML extends React.Component<Props> {
  static defaultProps = {
    css: [],
    scripts: [],
    state: '{}',
  };

  render() {
    const head = Helmet.renderStatic();
    const {
      children,
      scripts,
      css,
      state,
      loadableStateScript,
      styleElements,
    } = this.props;
    return (
      <html lang="">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          {css.map(href => {
            return <link key={href} rel="stylesheet" href={href} />;
          })}
          {styleElements.map((styleEl: any) => styleEl)}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__PRELOADED_STATE__ = ${state}`,
            }}
          />
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
          <script dangerouslySetInnerHTML={{ __html: loadableStateScript }} />
          {scripts.map(src => {
            return <script key={src} src={src} />;
          })}
        </body>
      </html>
    );
  }
}
