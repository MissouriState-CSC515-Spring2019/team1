import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import "./App.css";
import {
  Container,
  Button,
  Form,
  FormGroup,
  Input,
  Navbar,
  NavbarBrand,
  Nav,
  NavLink,
  NavItem
} from 'reactstrap';
import './App.css';
import FiveDay from './components/5-day-weather/5day';
import UVIndex from "./components/UVIndex/UVIndex";
import Weather from "./components/CurrentWeather/Weather";

const history = createBrowserHistory();

const ApiKey = '304b69dfc8fd594456d6556ba7d5be48';


class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    let url_zip = window.location.pathname.slice(window.location.pathname.lastIndexOf("/") + 1, window.location.pathname.length);
  
    if (url_zip.length !== 5 || 
        !/^\d+$/.test(url_zip)) {
      url_zip = "65810";
      history.push("65810");
    }
    this.state = {
      error: null,
      isLoaded: false,
      redirect: false,
      key: ApiKey,
      zip: url_zip,
      items: null
    };
    
    this.changeZip = this.changeZip.bind(this);
    this.updateData = this.updateData.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.updateData(event);
    }
  }

  componentDidMount() {
    this.setState({
      redirect: false
    })
  }

  componentDidUpdate() {
    if (this.state.redirect) {
      this.setState({
        redirect: false
      })
    }
  }

  changeZip(elem) {
    elem.persist();
    this.setState(state => ({
      zip: elem.target.value
    }));
  }

  updateData(elem) {
    elem.preventDefault();
    if (this.state.zip.length !== 5 ||
        !/^\d+$/.test(this.state.zip)) {
      alert("Ivalid zip code");
      return;
    } else {
      this.setState({
        redirect: true
      })
    }
  }

  render() {
    if (this.state.redirect) {
      let new_route = window.location.pathname;
      new_route = new_route.slice(0, new_route.lastIndexOf("/")) + "/" + this.state.zip;
      
      return (
        <Router>
          <Route>
            <Redirect to={new_route} />
          </Route>
        </Router>
      )
    }

    return (
      <Router history={history}>
        <Container>
          <Navbar className="navbar" color="light" light expand="lg">
            <NavbarBrand id="icon" href="/">The Weather App</NavbarBrand>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink><Link to={"/currentweather/" + this.state.zip}>Current Weather</Link></NavLink>
              </NavItem>
              <NavItem>
                <NavLink><Link to={"/forecast/" + this.state.zip}>5 Day Forecast</Link></NavLink>
              </NavItem>
              <NavItem>
                <NavLink><Link to={"/uv/" + this.state.zip}>UV</Link></NavLink>
              </NavItem>
              <NavItem>
                <Form inline id="ZipCode-Form">
                  <FormGroup>
                    <Input
                      id="ZipCode-Input"
                      placeholder="e.g. 65810"
                      value={this.state.zip}
                      onChange={this.changeZip}
                      onKeyPress={this.handleKeyPress}
                    />
                    <Button type="submit" onClick={this.updateData}>
                      Search
                    </Button>
                  </FormGroup>
                </Form>
              </NavItem>
            </Nav>
          </Navbar>

          <Switch>
            <Route path="/:zipcode" exact render={() => (
              <Redirect to="/currentweather/65810"/>
            )}/>
            <Route path="/currentweather/:zipcode" component={Weather} />
            <Route path="/currentweather/" exact render={() => (
              <Redirect to="/currentweather/65810"/>
            )}/>
            <Route path="/forecast/" exact render={() => (
              <Redirect to="/forecast/65810"/>
            )}/>
            <Route path="/forecast/:zipcode" component={FiveDay}/>
            <Route path="/UV/" exact render={() => (
              <Redirect to="/UV/65810"/>
            )}/>
            <Route path="/UV/:zipcode" component={UVIndex} />
          </Switch>
        </Container>
      </Router>
    );
  }
}

export default MyComponent;
