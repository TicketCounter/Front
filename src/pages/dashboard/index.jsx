// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';

// project import
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

import withAuth from '../../utils/withAuth';

import { useEffect, useState } from 'react';
import axios from '../../config/axios';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

const localizer = momentLocalizer(moment);

const DashboardDefault = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios.get('/events')
      .then(response => {
        const fetchedEvents = response.data.map(event => ({
          title: event.title,
          start: new Date(event.date),
          end: new Date(event.date)
        }));
        setEvents(fetchedEvents);
      })
      .catch(error => console.error('Error fetching events:', error));
    axios.get('/events/stats')
      .then(response => {
        setStats(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the stats!', error);
      });
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Events" count={stats.totalEvents}/>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Participats" count={stats.totalParticipants}/>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Active Events" count={stats.totalActiveEvents}/>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Passed Events" count={stats.totalPassedEvents}/>
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      <Grid item xs={12}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </Grid>
    </Grid>
  );
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //



export default withAuth(DashboardDefault);``