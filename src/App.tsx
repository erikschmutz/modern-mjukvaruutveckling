import React, { useEffect, FC, useState } from 'react';
import { Route, Redirect, Router } from 'react-router-dom';
import { history } from './history';
import MainPage from 'src/pages/main/main-page';

const App: FC = () => {
  const [state, setState] = useState({});
  return (
    <>
      <Router history={history}>
        <Route path="/" component={MainPage} />
        <Redirect to="/"></Redirect>
      </Router>
    </>
  );
};

export { App };
export default App;
