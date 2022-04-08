import React, { Component, useState } from 'react'
import { login } from './UserFunctions'

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {LOMap} from './Map'
import { withRouter } from 'react-router-dom';

class Login extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()

    const user = {
      email: this.state.email,
      password: this.state.password
    }

    login(user).then(res => {
      if (!res.error) {
        this.props.history.push(`/profile`)
      } else /*if (error && typeof res.error == 'string')*/{
        this.setState({error:res.error});
      }
    })
  }


  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
//    backgroundImage: 'url(https://source.unsplash.com/random)',
//    backgroundRepeat: 'no-repeat',
//    backgroundColor:
//      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: "100px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  textfield:{
    borderRadius:'100px',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignIn=(props)=> {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const [email, setEmail]=useState('');
  const [password, setPassword]=useState('');
  const [error, setError]=useState('');

  const onSubmit=(e) => {
    e.preventDefault();
    setLoading(true);
    const user = {
      email: email,
      password: password
    }

    login(user).then(res => {
      if (typeof(res) === "undefined") {
        setError("Request failed, try again");
      } else if (!res.error) {
        props.history.push(`/`)
      } else {
        setError(res.error);
      }
      setLoading(false);
    })

  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={6} md={8} className={classes.image} >
        <LOMap  />
        </Grid>

      <Grid item xs={12} sm={6} md={4} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={onSubmit}>
            <TextField
              className={classes.textfield}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onInput={e=>setEmail(e.target.value)}

            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onInput={e=>setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >

               {loading?(<CircularProgress color="secondary" size={24} className={classes.buttonProgress} />)
               :(<span>Sign In</span>)}
            </Button>
            <Grid container>
              <Grid item xs>
{/*                <Link href="#" variant="body2">
                  Forgot password?
                </Link>*/}
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
              <Grid item>
                <div>{ error!="" && <h3 className="error"> {error}</h3>}</div>

              </Grid>
            </Grid>
            <Box mt={5}>

            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
const SignInSide=withRouter(SignIn);
export {Login, SignInSide}
