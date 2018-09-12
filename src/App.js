import React from 'react'
import { Component } from 'react'
import ReactDOM from 'react-dom';
import './App.css';

const { ApiMarketClient } = require('@apimarket/apimarket')
const config = require("./apimarket_config.json");

class App extends Component {
  render() {
    return (
      <FileInput />
    );
  }
}

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.textInput = React.createRef();
    this.setTextInputRef = element => {
      this.textInput = element;
    };
  }
  renderIMG(img, desc){
    var container = this.refs.container2;
    var car = <img src={img} alt={desc} height="200" width="200"/>;
    ReactDOM.render(car, container);
  }
  renderFull(img, set, desc){
    var container = this.refs.container2;
    //var c = "";
    set = customPrettyPrint(set);
    if(set === undefined || set.length === 0){
      alert("No such result found!");
    } else {
      var c = [];
      for(var i = 0; i<set.length; i++){
        c.push(<p>{set[i]}</p>)
      }
      var car = <p><img src={img} alt={desc} height="200" width="200"/><div>{c}</div></p>;
      ReactDOM.render(car, container);
    } 
  }

  async handleSubmit(event) {
    event.preventDefault();
    var img = this.refs.textInput.value;//"https://storage.googleapis.com/partner-aikon.appspot.com/partner-hadron-transferLearning-v1-deepspace.jpg";
    if(check_if_img(img)){
      alert(
        `Selected file - `+img
      );
      this.renderIMG(img, "Test");
      var result = await run(img);
      this.renderFull(img, result, "Test");
    } else {
      alert("Please submit a URL with an image extension (.jpeg, .jpg, .gif, .png)");
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Submit Link:
            <input type="text" defaultValue = "" ref="textInput" />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      <div ref="container2" />
      </div>
    );
  }
}

const check_if_img = function(link){
  var validUrl = require('valid-url');
  if(!validUrl.isUri(link)){return false;}
  return(link.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

const customPrettyPrint = function(stet){
  var toPrint = [];
  if(stet !== undefined){
    for(var i = 1; i<stet.length+1; i++){
      toPrint.push(i+": "+stet[i-1][2] + ", " + stet[i-1][1] + "%");
    }
  }
  return toPrint;
}

const sortOut = function(input, target){
  var ret = [];
  for(var i = 0; i<input.length; i++){
      console.log(input[i]);
      if(input[i][2].match(target)){//this is presumably faster than turning the string into another array and does effectively the same thing given the format
          ret.push(input[i]);
      }
  }
  return ret;
}

const run = async (jsse) => { 
  try {
        //Config to apimarketClient and connect to ORE blockchain
        let apimarketClient = new ApiMarketClient(config);
        await apimarketClient.connect()
        //specify the api to call using it's unique name registered on the ORE blockchain
        const apiName = "cloud.hadron.imageRecognize"
        //alert("Test");
        //call api - passing in the data it needs
        const params = {
            "imageurl": jsse
            }
        const response = await apimarketClient.fetch(apiName, params);
        if(response === undefined || response.length === 0 || response['results'] === undefined){
          alert("Couldn't fetch results!");
        }
        else{
          var sample = response['results']
          var sorted = sortOut(sample, "");//Change this line for searching for a particular thing.
          if(sorted === undefined || sorted.length === 0){
            alert("No such result found!");
            return [];
          }
          else{
            //alert(JSON.stringify(sorted, null, 2));
            alert("Result found!");
            return sorted;
          }
        }
    } 
    catch(error) {
        console.error(error)
    }
}

export default App;