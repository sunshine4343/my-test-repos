import React from 'react';
import {Route,Switch,Redirect} from 'react-router-dom';
import Login from './containers/login/login';
import Admin from './containers/admin/admin';
export default class App extends React.Component{
  render(){
    return(
      <div className='app'>
        {/* <Routes> */}
        <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/admin' component={Admin}/>
          <Redirect to="/admin"/>
        </Switch>
        {/* </Routes> */}
      </div>
    )
  }
}
