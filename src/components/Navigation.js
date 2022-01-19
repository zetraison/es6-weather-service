import React, { useState } from 'react';
import { 
    Button, 
    Container, 
    Form, 
    FormControl, 
    Nav, 
    Navbar
} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';


const Navigation = (props) => {
    const {onInputSubmit} = props;

    const [city, setCity] = useState('');

    const location = useLocation();
    
    const onSubmit = e => {e.preventDefault(); onInputSubmit(city)}

    const setActive = isActive => isActive ? 'active' : 'inactive';
        
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
            <Navbar.Brand href="/">Прогноз погоды</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto" activeKey={location.pathname}>
                    <Nav.Link
                        href="/"
                        as={Link}
                        to={"/"}
                        className={setActive}
                    >
                        Главная
                    </Nav.Link>
                    <Nav.Link
                        href="/detail"
                        as={Link}
                        to={"/detail/"}
                        className={setActive}
                    >
                        Детальный прогноз
                    </Nav.Link>
                </Nav>
                <Form className="d-flex" onSubmit={onSubmit}>
                    <FormControl 
                        type="search"
                        placeholder="Поиск"
                        className="me-2"
                        aria-label="Search"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                    />
                    <Button 
                        type="submit"
                        variant="outline-success" 
                    >
                        Поиск
                    </Button>
                </Form>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    );
    
}

export default Navigation;
