// material-ui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

// assets
import avatar from 'assets/images/users/avatar-group.png';
import AnimateButton from 'components/@extended/AnimateButton';

// react-router-dom
import { Link as RouterLink } from 'react-router-dom';

// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //

export default function NavCard() {
  return (
    <MainCard sx={{ bgcolor: 'grey.50', m: 3 }}>
      <Stack alignItems="center" spacing={2.5}>
        <CardMedia component="img" image={avatar} sx={{ width: 112 }} />
        <Stack alignItems="center">
          <Typography variant="h5">Mantis Pro</Typography>
          <Typography variant="h6" color="secondary">
            Checkout pro features
          </Typography>
        </Stack>
        <AnimateButton>
          <Button component={RouterLink} to="/pro-features" variant="contained" color="success" size="small">
            Pro
          </Button>
        </AnimateButton>
      </Stack>
    </MainCard>
  );
}