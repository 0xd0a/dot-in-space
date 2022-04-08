import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {LOMap} from './Map'
import Landing from './Landing'

import ListItemLink from './ListItemLink'
import LaunchDot from './LaunchDot'
import { withRouter } from 'react-router-dom';

import CreateDot from './CreateDot'

const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({
  root: {
  //  display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    height: '100vh',
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
}));


const PersistentDrawerRight = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [cd, setCd] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const initCreateDot = () =>{
    setCd(!cd)
  }

  const logOut = () => {
    localStorage.removeItem('usertoken');
    props.history.push('/');
    console.log("Logout");
  }

  let loggedin = (
    <div className={classes.root}>
      {cd? <CreateDot onClose={initCreateDot}/>:""}
      <CssBaseline />
      <AppBar

        position="absolute"  style={{ background: 'transparent', boxShadow: 'none'}}
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar
        >
          <Typography variant="h6" noWrap className={classes.title}>

          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            className={clsx(open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        {/*<div className={classes.drawerHeader} />*/}

        <LOMap />
      </main>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItemLink icon="" to="/signin" primary="SignIn Again" />
          <ListItem button key="Launch dot"  onClick={initCreateDot}>
            <ListItemText primary="Launch dot"/>
          </ListItem>
{/*          {['My Dots', 'Launch Dot'].map((text, index) => (
            <ListItem button key={text} >
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))} */}
        </List>
        <Divider />
        <List>
            <ListItem button key="Sign Out"  onClick={logOut}>
              <ListItemText primary="Sign Out"/>
            </ListItem>
        </List>
      </Drawer>
    </div>
  );
  let signin= (
    <div>
      <Landing />
    </div>
  )
  ;
  {/*console.log(localStorage.usertoken);
  console.log(typeof(localStorage.usertoken));*/}
  if(!localStorage.usertoken) props.history.push(`/signin`)

  return loggedin;
}

export default withRouter(PersistentDrawerRight);
