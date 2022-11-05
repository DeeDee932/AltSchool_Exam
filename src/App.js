import React from 'react';
// import logo from './logo.svg';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SearchBar from './SearchBar.jsx';
import ResultTable from './ResultTable';
import './App.css';
import axios from 'axios';
import { connect } from 'react-redux';

type Props = {
  name: String,
  data: Object,
  onNameChange: Function,
  onCacheData: Function,
  onClearData: Function
}

class App extends React.Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      data: []
    }
  }

  submitHandler = (e) => {
    e.preventDefault();
    const name = this.props.name;
    axios.get(`https://api.github.com/search/repositories?q=${name}&sort=stars&order=desc`)
    .then((response) => {
      const data = response.data;
      console.log(data);
      this.props.onCacheData(data)
      return response
    })
    .catch((err) => {
      console.log(err);
    })
  }

  onNameChange = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  render() {
    return (
      <div className="App">
        <SearchBar />
        <p>GitHub Repo Finder</p>
        <form onSubmit={this.submitHandler}>
          <div style={{margin: "10px"}}>
            <TextField
              className="TextField--Search"
              label="Search repo"
              value={this.props.name}
              onChange={(e) => this.props.onNameChange(e.target.value)}
              variant="outlined"
              id="mui-theme-provider-outlined-input"
              fullWidth
            />
          </div>
        </form>
        <div style={{margin: "10px"}}>
          {
            this.props.data.length !== 0 ?
            <ResultTable data={this.state.data}/>
            :
            <Typography>Data not yet loaded</Typography>
          }
          {
            this.props.data.length !== 0 ?
            <Button
              variant="contained"
              color="primary"
              style={{margin: "10px"}}
              onClick={this.props.onClearData}>Clear data</Button>
            :
            null
          }
        </div>
      </div>
    );
  }
}

const MapStateToProps = (state: State) => ({
  name: state.homepage.name,
  data: state.homepage.data
})

const MapDispatchToProps = (dispatch: Dispatch) => ({
  onNameChange: (name) => dispatch({type: "HANDLE_NAME_CHANGE", payload: name}),
  onCacheData: (data) => dispatch({type: "HANDLE_CACHE_DATA", payload: data}),
  onClearData: () => dispatch({type: "HANDLE_CLEAR_DATA"})
})

export default connect(MapStateToProps, MapDispatchToProps)(App);
