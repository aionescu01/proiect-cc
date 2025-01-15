import React, {useContext} from 'react';
import { NavLink } from 'react-router-dom';
//import { getToken } from './services/authService';
import { AuthContext } from './components/Auth/AuthContext';


const Navbar = () => {
    //const isLoggedIn = getToken();
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
          {isLoggedIn ? (
            <>
              <NavLink to="/expenses" exact style={{ marginRight: '15px' }} activeClassName="active">
                Home
              </NavLink>
              <NavLink to="/expenses" style={{ marginRight: '15px' }} activeClassName="active">
                Expenses
              </NavLink>
              <NavLink to="/income" style={{ marginRight: '15px' }} activeClassName="active">
                Income
              </NavLink>
              <NavLink to="/budgets" style={{ marginRight: '15px' }} activeClassName="active">
                Budgets
              </NavLink>
              <NavLink to="/add-transaction" style={{ marginRight: '15px' }} activeClassName="active">
                Add Transaction
              </NavLink>
              <NavLink to="/add-budget" style={{ marginRight: '15px' }} activeClassName="active">
                Add Budget
              </NavLink>
              <NavLink to="/logout" style={{ marginRight: '15px' }} activeClassName="active">
                Log out
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" exact style={{ marginRight: '15px' }} activeClassName="active">
                Home
              </NavLink>
              <NavLink to="/register" style={{ marginRight: '15px' }} activeClassName="active">
                Register
              </NavLink>
              <NavLink to="/login" style={{ marginRight: '15px' }} activeClassName="active">
                Login
              </NavLink>
            </>
          )}
        </nav>
      );
};

export default Navbar;
