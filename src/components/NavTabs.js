import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';

const NavTabs = (props) => {
    const {tabs, onTabChange} = props;
    const [activeKey, setActiveKey] = useState(0);
    
    const handleSelect = (eventKey) => {
        setActiveKey(eventKey); 
        onTabChange(eventKey);
    }
    
    return (
        <Nav justify variant="tabs" 
            activeKey={activeKey} 
            onSelect={handleSelect} 
        >
            {tabs.map((name, index) => <Nav.Item key={index}><Nav.Link eventKey={index}>{name}</Nav.Link></Nav.Item>)}
        </Nav>
    );
}

export default NavTabs;
