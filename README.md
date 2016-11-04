xhr-env-provider
===============
Load client-side configuration from a remote server with an XMLHttpRequest.

## Note
This npm module is un-released as I could not settle on the merit/usefulness of loading environment config in this way. The asynchronous request makes it awkward to use this library as it introduces async behavior and promises in inconvenient places.

``` js
// Sometimes it works out really nicely....
envProvider.value("API_URL")
  .then(apiUrl => fetch(`${apiUrl}/accounts`))
  .then(accounts => /* Do something with the accounts list */);


// But other times it doesn't.

// It could look like this with more traditional config approach...
const MyReactDate = (date) => (
  <div>{myDateFormatter.format(date, config.DATE_FORMAT)}</div>
);

// but this is how it would look with this package. :( Way too verbose
class MyReactDate extends React.Component {
  componentDidMount() {
    this.dateFormat = "";
    envProvider.value("DATE_FORMAT").then(dateFormat => this.dateFormat = dateFormat);
  }

  render() {
    return <div>{myDateFormatter.format(date, this.dateFormat)}</div>
  }
};
```

I think I need to see more use cases and use this pattern a bit more to fully understand it. Until then, I won't plan on putting any more work into releasing this library.


## Setup
This library assumes that it will be able to fetch your application's JavaScript environment variables from the headers of an HTTP response. Once it has fetched them, it caches them in memory. You can define what HTTP header to use.

It's up to you to configure some server with the appropriate header value. The header must contain a JSON-encoded string containing all of the environment config values.

Here is a simple example using Express middleware:

``` js
const app = express();

app.use(function (req, res, next) {
  response.set('JS-ENV', process.env.JS_ENV); // process.env.JS_ENV='{"MY_VAR": "some value", "OTHER_CONFIG": "stuff"}'
  next();
});
```

## Usage
``` js
import EnvProvider from "xhr-env-provider";

const envProvider = new EnvProvider("http://my-config-provider.com", "JS-ENV");

envProvider.value("API_URL")
  .then(apiUrl => fetch(`${apiUrl}/accounts`))
  .then(accounts => /* Do something with the accounts list */);
```
