# TicketCounter - A Event Management System

Mantis is a free and open-source React dashboard template made using the Material UI React component library with the aim of flexibility and better customizability.

## Table of Contents

- [Project Structure](#project-structure)
- [Main Packages](#main-packages)
- [Routes](#routes)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Technology Stack](#technology-stack)
- [Author](#author)
- [Issues](#issues)
- [License](#license)
- [More Free React Templates](#more-free-react-templates)
- [More Pro React Templates](#more-pro-react-templates)

## Project Structure

```
.env
.env.example
.eslintrc
.github/
  ISSUE_TEMPLATE/
    bug_report.md
    custom.md
    feature_request.md
  workflows/
    prod.yml
.gitignore
.prettierrc
CODE_OF_CONDUCT.md
index.html
jsconfig.json
LICENSE
package.json
README.md
src/
  api/
    menu.js
  App.jsx
  assets/
    images/
    third-party/
  components/
    @extended/
    cards/
    ...
  config/
    config.js
  contexts/
  index.jsx
  layout/
  menu-items/
  pages/
  reportWebVitals.js
  routes/
    LoginRoutes.jsx
    index.jsx
  themes/
  utils/
  vite-env.d.js
tsconfig.node.json
vite.config.mjs
```

## Main Packages

- `react`: ^18.2.0
- `react-router-dom`: ^6.22.3
- `@mui/material`: ^5.15.12
- `axios`: ^1.7.8
- `formik`: ^2.4.5
- `lodash`: ^4.17.21
- `moment`: ^2.30.1
- `yup`: ^1.4.0
- `vite`: ^5.2.10

## Routes

### LoginRoutes

```jsx
import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/register')));
const AuthLogout = Loadable(lazy(() => import('pages/authentication/logout')));

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/login',
      element: <AuthLogin />
    },
    {
      path: '/register',
      element: <AuthRegister />
    },
    {
      path: '/logout',
      element: <AuthLogout />
    }
  ]
};

export default LoginRoutes;
```

### Main Routes

```jsx
import { createBrowserRouter } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

const router = createBrowserRouter([MainRoutes, LoginRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME });

export default router;
```

## Getting Started

1. Clone from Github

```
git clone https://github.com/codedthemes/mantis-free-react-admin-template.git
```

2. Install packages

```
yarn
```

3. Run project

```
yarn start
```

## Documentation

[Mantis documentation](https://codedthemes.gitbook.io/mantis/) helps you out in all aspects from Installation to deployment.

## Technology Stack

- [Material UI V5](https://mui.com/core/)
- Built with React Hooks API.
- React context API for state management.
- SWR.
- React Router for navigation routing.
- Support for Vite.
- Code splitting.
- CSS-in-JS.

## Author

Mantis is managed by team [CodedThemes](https://codedthemes.com).

## Issues

Please generate a [GitHub issue](https://github.com/codedthemes/mantis-free-react-admin-template/issues) if you found a bug in any version. We are trying our best to resolve the issue.

## License

- Licensed under [MIT](https://github.com/codedthemes/datta-able-bootstrap-dashboard/blob/master/LICENSE)

## More Free React Templates

- [Free Materially](https://codedthemes.com/item/materially-free-reactjs-admin-template/)
- [Free Berry](https://mui.com/store/items/berry-react-material-admin-free/)

## More Pro React Templates

- [Mantis Pro](https://mantisdashboard.io)
- [Buy now](https://mui.com/store/items/mantis-react-admin-dashboard-template/)
