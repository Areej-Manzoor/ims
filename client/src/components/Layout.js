import { Outlet } from 'react-router-dom';
import NavbarElem from './NavbarElem';
import Box from '@mui/material/Box';


function Layout() {
    return (
        <div>
            <NavbarElem />
            <Box display="flex" justifyContent="center" alignItems="center" >
            <main>
                <Outlet />
                </main>
            </Box>
        </div>
    );
}

export default Layout;
